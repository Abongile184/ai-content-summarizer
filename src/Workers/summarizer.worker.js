import { summarizeText } from "../Transformers/transformersSetup";
import { summarizeLargeText } from "../Transformers/chunking";

// Worker message listener
let shouldStop = false;

self.onmessage = async (event) => {

  // 🔴 HANDLE STOP SIGNAL
  if (event.data.type === "STOP") {
    shouldStop = true;
    return;
  }

  const { text } = event.data;
  shouldStop = false;

  try {
    const isLong = text.length > 1000;

    const summary = isLong
      ? await summarizeLargeText(text, () => shouldStop)
      : await summarizeText(text);

    self.postMessage({
      type: "success",
      summary,
    });

  } catch (error) {
    if (error.message === "STOPPED") {
      self.postMessage({ type: "stopped" });
    } else {
      self.postMessage({
        type: "error",
        message: error.message,
      });
    }
  }
};

/*
Main Thread (UI only)
 ├─ DOM
 ├─ Buttons
 ├─ Loader
 └─ Sends text → Worker

Web Worker (AI only)
 ├─ transformersSetup
 ├─ chunking
 ├─ model loading
 └─ returns summary
*/