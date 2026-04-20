import { updateUiState } from '../Ui_StateManagement/Ui_State';
import { getWorker, stopWorker } from "../Workers/workerController"; //call the web worker 


export function AnalyzeButton() {
  const btnSummarize = document.getElementById("Summarize");
  const input = document.getElementById("content-area");
  const output = document.getElementById("output_summary");
  const stopBtn = document.getElementById("Stop-button"); // 👈 ADD THIS

  if (!btnSummarize || !input || !output) {
    console.warn("⚠️ AnalyzeButton: Missing DOM elements.");
    return;
  }

  // -----------------------------
  // ✅ STOP BUTTON GOES HERE
  // -----------------------------
  stopBtn.addEventListener("click", () => {
  const didStop = stopWorker();

  if (!didStop) { //prevent user from clicking stop button when model is not in use
    output.textContent = "⚠️ Nothing is running.";

    setTimeout(() => {
      output.textContent = "";
    }, 3000); //remove the Ui error response after 3 seconds

    return;
  }

  output.textContent = "⛔ Stopping...";

  setTimeout(() => {
    output.textContent = "";
  }, 3000);

  updateUiState("IDLE");
});

  
  btnSummarize.addEventListener("click", async () => {
    const text = input.value.trim();

    if (!text) {
      alert("Please enter some text first.");
      return;
    }else if(text.length < 600){ //prevent user from trying to summarize less character or data 
      alert("Data insufficient, please enter more data to process")
      return
    }

    try {
      updateUiState("LOADING");

      // i wanted a loaded but after too many attempts failed i settled with this solution
      output.innerHTML = `⌛ Please wait while the Transformers model loads...`;
      setTimeout(() => {
        output.innerHTML = `⌛ Press F12 to see the model loading in the console...`;

        setTimeout(() => {
          output.innerHTML = `⌛ Almost there, finalizing setup...`;
        }, 2000);
      }, 3000);


      const aiWorker = getWorker();

      aiWorker.postMessage({ text });

      aiWorker.onmessage = (event) => {
        const { type, summary, message } = event.data;

        if (type === "stopped") {
          output.textContent = "⛔ Stopped.";
          updateUiState("IDLE");
          return; // ✅ prevent further execution
        }
        
        updateUiState("PROCESSING");
         
        if (type === "success") {
          updateUiState("DONE");
          output.textContent = summary;

          // Revert to default after 3 seconds
          setTimeout(() => updateUiState("IDLE"), 3000);
        }

        if (type === "error") {
          output.textContent = "❌ Error generating summary.";
          setTimeout(() => updateUiState("IDLE"), 3000);
          console.error(message);
        }
       
      };

    } catch (err) {
      console.error("❌ Summarization failed:", err);
      output.textContent = "❌ Error generating summary.";
    } finally {
      
      
    }

  });
}

