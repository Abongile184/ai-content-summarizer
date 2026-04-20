//connect the model to the button 
let worker = null;

export function getWorker() {
  if (!worker) {
    worker = new Worker(
      new URL("./summarizer.worker.js", import.meta.url),
      { type: "module" }
    );
  }
  return worker;
}

export function stopWorker() {
  if (!worker) {
    return false; // 👈 nothing to stop
  }

  worker.postMessage({ type: "STOP" });

  setTimeout(() => {
    worker.terminate();
    worker = null;
    console.log("🧹 Worker terminated");
  }, 200);

  return true; // 👈 stop initiated
}



/*
AnalyzeButton.js
   ↓ uses the web worker
workerController.js
   ↓ controls the web worker
summarizer.worker.js
*/