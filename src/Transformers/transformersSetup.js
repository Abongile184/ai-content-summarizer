import { pipeline, env } from "@xenova/transformers";
import { hasModel, markModelCached } from "../Storage/modelCache";
import prettyMilliseconds from 'pretty-ms';

// --------------------------------------------------
// CRITICAL CONFIG
// --------------------------------------------------
env.allowLocalModels = false;
env.allowRemoteModels = true;
//env.localModelPath = "/Transformers";
env.remoteHost = "https://pub-ab3346267ac5487bbbc6cd907c02452f.r2.dev"

// WASM speedup
env.backends.onnx.wasm.numThreads = navigator.hardwareConcurrency || 4;

// --------------------------------------------------
// OPTIONAL: WebGPU diagnostics
// --------------------------------------------------
(async () => {
  if (!navigator.gpu) {
    console.warn("⚠️ WebGPU not supported — using WASM");
    return;
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (adapter) {
    console.log("🚀 WebGPU available (Transformers.js will auto-use it)");
  }
})();

// --------------------------------------------------
// MODEL CONFIG
// --------------------------------------------------
const MODEL_ID = "Xenova/distilbart-cnn-6-6";
let summarizer = null;

// --------------------------------------------------
// SUMMARIZER (singleton)
// --------------------------------------------------
export async function getSummarizer() {
  if (summarizer) return summarizer;

  const cached = await hasModel(MODEL_ID);

  if (!cached) {
  console.log("⬇️ Fetching model from Cloudflare R2...");
} else {
  console.log("⚡ Using cached model (browser cache)");
  }

  console.log("📡 Loading model from:", env.remoteHost);

   // 1. START TRACKING
  const startTime = performance.now();
  console.log("🚀 Model Load Time Started...")

  summarizer = await pipeline(
    "summarization",
    MODEL_ID,
    {
     // dtype: "fp16", // half precision reduces memory usage and can improve performance, especially with the WebGPU backend
    }
  );

  // 2. CALCULATE DURATION
  const duration = performance.now() - startTime;

  // 3. FORMAT AND LOG
  console.log(`🚀 Model Load Time: ${prettyMilliseconds(duration, { secondsDecimalDigits: 0 })}`);

  // Mark model as cached AFTER successful load
  await markModelCached(MODEL_ID);

  return summarizer;
}

// --------------------------------------------------
// SHORT TEXT SUMMARIZATION
// --------------------------------------------------
export async function summarizeText(text) {//inference configuration for model output
  const summarizer = await getSummarizer();

  const output = await summarizer(text, {
    max_new_tokens: 380,
    min_new_tokens: 80,
    do_sample: false, //disables random sampling during text generation keep if false as it uses alot of token to generate creative output
    temperature: 0.7, // tunes the creativeness of the model but uses alot of token 
    top_k: 50, //Ensures the model only chooses from "sensible" options
    num_beams: 4, //Increasing num_beams lets the model explore multiple potential paths or 'beams' for the next word.
    length_penalty: 2.0, //to encourage the model to generate longer sequences
    early_stopping: true,
    repetition_penalty: 1.2,
    no_repeat_ngram_size: 3, //a decoding parameter that prevents the model from repeating any sequence of three consecutive tokens
  });

  return output[0].summary_text;
}
