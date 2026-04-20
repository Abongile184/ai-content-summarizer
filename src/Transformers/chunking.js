import { AutoTokenizer } from "@xenova/transformers";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getSummarizer } from "./transformersSetup";
import prettyMilliseconds from 'pretty-ms';

// --------------------------------------------------
// Tokenizer singleton
// --------------------------------------------------
let tokenizer = null;

async function getTokenizer() {
  if (!tokenizer) {
    tokenizer = await AutoTokenizer.from_pretrained(
      "Xenova/distilbart-cnn-6-6"
    );
  }
  console.log(`tokenizer : ${tokenizer }`)
  return tokenizer;
}

// --------------------------------------------------
// Token-aware splitter
// --------------------------------------------------
async function createSplitter() {
   //This is an asynchronous function call designed to fetch the necessary tokenizer configuration and associated files 
  const tokenizer = await getTokenizer(); 

  return new RecursiveCharacterTextSplitter({
    chunkSize: 400,
    chunkOverlap: 50,
    lengthFunction: (text) => tokenizer.encode(text).length,
    separators: ["\n\n", "\n", ". ", " ", ""],
  });
}

// --------------------------------------------------
// Hierarchical summarization
// --------------------------------------------------
export async function summarizeLargeText(text, shouldStop) {
  // 1. Start Total Timer
  const fullProcessStart = performance.now();

  const summarizer = await getSummarizer();
  const splitter = await createSplitter();

  const chunks = await splitter.splitText(text);
  console.log(`🧩 Chunks created: ${chunks.length}`);

  const partialSummaries = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunkStart = performance.now(); // Start individual chunk timer

    // --- MEASURE TOKENS FOR THIS CHUNK ---
    const chunkTokens = tokenizer.encode(chunks[i]).length;
    console.log(`🧩 Chunk ${i} size: ${chunkTokens} tokens`);

    if (shouldStop && shouldStop()) {
    throw new Error("STOPPED");
  }

    const result = await summarizer(chunks[i], {
      max_new_tokens: 100, // Keep partials smaller to save room for final step
      min_new_tokens: 30,
    });

    const chunkDuration = performance.now() - chunkStart;
    console.log(`  map_chunk_${i}: ${prettyMilliseconds(chunkDuration, { secondsDecimalDigits: 0 })}`);

    partialSummaries.push(result[0].summary_text);
  }

  const combined = partialSummaries.join(" ");
  console.log("📝 Combined Summary Input:", combined);

  console.log("🤝 Starting Reduce Step...");
  
  const reduceStart = performance.now(); 

  console.time("⏱️ REDUCE_STEP"); // Track final synthesis

  const final = await summarizer(combined, {
    max_new_tokens: 250,      // Lowered from 512 to avoid hitting the 1024 limit
    min_new_tokens: 60,       // Reduced to ensure it can finish naturally
    length_penalty: 1.0,      // Neutral penalty to prevent rambling
    num_beams: 4, 
    early_stopping: true, 
    do_sample: false,
    repetition_penalty: 1.15,
    no_repeat_ngram_size: 3,
  });

  const reduceDuration = performance.now() - reduceStart;
  console.log(`⏱️ REDUCE_STEP: ${prettyMilliseconds(reduceDuration, { secondsDecimalDigits: 0 })}`);

  // --- FULL PROCESS FINISH ---
  const fullDuration = performance.now() - fullProcessStart;
  console.log(`✅ FULL_PROCESS: ${prettyMilliseconds(fullDuration, { secondsDecimalDigits: 0 })}`);

  return final[0].summary_text;
}