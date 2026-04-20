/* src/Text-Content/Slider.js
export function setupSlider(sliderId = "length", displayId = "showValue") {
  const slider = document.getElementById(sliderId);
  const display = document.getElementById(displayId);

  if (!slider) {
    console.warn(`⚠️ Slider element with id "${sliderId}" not found.`);
    return { getValue: () => null };
  }

  // Initialize display
  if (display) {
    display.textContent = `${slider.value}%`;
  }

  // Update in real-time
  slider.addEventListener("input", (e) => {
    if (display) display.textContent = `${e.target.value}%`;
  });

  // Expose getter
  return {
    getValue: () => slider.value,
  };
}

*/