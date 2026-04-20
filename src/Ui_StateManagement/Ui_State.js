
const elements = {
  btn: document.getElementById("Summarize"),
  input: document.getElementById("content-area"),
  output: document.getElementById("output_summary"),
  loadfile: document.querySelector('#insert-file label'), 
  home: document.getElementById('return-home')
};

const STYLES = {
  IDLE:       { text: "Summarize",      bg: "bg-black",     hover: "hover:bg-blue-500", pulse: false },
  LOADING:    { text: "⌛ Loading Model...", bg: "bg-red-600",   hover: "hover:bg-red-600",  pulse: true  },
  PROCESSING: { text: "⚙️ Summarizing...", bg: "bg-orange-500", hover: "hover:bg-orange-500", pulse: true  },
  DONE:       { text: "✅ Done",        bg: "bg-green-600", hover: "hover:bg-green-600", pulse: false },
  ERROR:      { text: "❌ Error",       bg: "bg-red-800",   hover: "hover:bg-red-800",  pulse: false }
};

export function updateUiState(stateKey) {
  const { btn, input, loadfile, home, output } = elements;
  const s = STYLES[stateKey];

  // 1. Update Button Text
  btn.textContent = s.text;

  // 2. Handle Tailwind Classes (Swap Backgrounds)
  // Remove all possible state colors, then add the current one
  const allColors = Object.values(STYLES).flatMap(x => [x.bg, x.hover]);
  btn.classList.remove(...allColors);
  btn.classList.add(s.bg, s.hover);

  // 3. Toggle Disabled/Opacity States
  const isBusy = (stateKey === "LOADING" || stateKey === "PROCESSING");
  
  [btn, loadfile, home].forEach(el => {
  if (!el) return;

  // For real buttons
  if (el.tagName === 'BUTTON') {
    el.disabled = isBusy;
  }

  // For all elements (including the Label)
  el.classList.toggle("opacity-50", isBusy);
  el.classList.toggle("cursor-not-allowed", isBusy);
  
  // This is the key: it stops the label from opening the file picker
  el.classList.toggle("pointer-events-none", isBusy); });

  input.readOnly = isBusy;
  input.classList.toggle("opacity-50", isBusy);

}
