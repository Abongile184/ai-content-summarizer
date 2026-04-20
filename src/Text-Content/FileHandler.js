// src/Text-Content/FileHandler.js
import * as pdfjsLib from 'pdfjs-dist'; //step 1 install then Import and Configure PDF.js

//step 2 Configure Webpack to find the worker file automatically
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

//step 3 The Extraction Function
async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Extracting strings and adding a space between items
        const pageText = textContent.items.map(item => item.str).join(" ");
        fullText += pageText + "\n\n";
    }
    return fullText.replace(/\s+/g, ' ').trim(); //remove all white spaces so tokens can be used efficiently
}

export function initializeFileUpload() {
  const fileInput = document.getElementById('file-input');
  const fileNameLabel = document.getElementById('file-name');
  const dropZone = document.getElementById('content-area');
  const dropOverlay = document.getElementById('drop-overlay');

  if (!fileInput || !dropZone) {
    console.warn('⚠️ FileHandler: Missing required DOM elements.');
    return; }

  // ✅ Core file handler
  async function handleFile(file) { // Add 'async' here
    const fileName = file.name.toLowerCase();
    const allowedExtensions = ['.txt', '.md', '.json', '.pdf'];
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

    //step 4 check file extension
    if (!hasValidExtension) {
      alert('Only .txt, .pdf, .md, or .json files are allowed.');
      return;
    }

    //step 5 check PDF size limit
    const MAX_SIZE_MB = 3;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    
    if (fileName.endsWith('.pdf') && file.size > MAX_SIZE_BYTES) {
      alert(`The PDF is too large. Please upload a file smaller than ${MAX_SIZE_MB} MB.`);
      return;
    }

    // ✨ TRIGGER BOUNCE ANIMATION FOR ALL UPLOADS
    dropZone.classList.add("animate-bounce");
    setTimeout(() => dropZone.classList.remove("animate-bounce"), 500);

    //step 6 update label
    if (fileNameLabel) {
      fileNameLabel.textContent = file.name;
    }

    //step 7 process content
    try {
      let content = "";

      if (fileName.endsWith('.pdf')) {
        // --- PDF BRANCH ---
        // We call the helper function we created earlier
        content = await extractTextFromPDF(file);
      } else {
        // --- TEXT BRANCH ---
        // Standard files (txt, md, json) can be read as plain text
        content = await file.text();
      }

      // Finally, put the extracted text into your UI
      dropZone.value = content;

    } catch (error) {
      console.error("Extraction failed:", error);
      alert("Could not read the file content.");
    }
  }

  // ✅ Drag & Drop Events with animations
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add(
      "scale-105", "shadow-lg", "ring-2", "ring-cyan-400", "border-cyan-400"
    );
    dropOverlay?.classList.replace('opacity-0', 'opacity-100');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove(
      "scale-105", "shadow-lg", "ring-2", "ring-cyan-400", "border-cyan-400"
    );
    dropOverlay?.classList.replace('opacity-100', 'opacity-0');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove(
      "scale-105", "shadow-lg", "ring-2", "ring-cyan-400", "border-cyan-400"
    );
    dropOverlay?.classList.replace('opacity-100', 'opacity-0');

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);

    // 🎞 Add bounce animation feedback
    dropZone.classList.add("animate-bounce");
    setTimeout(() => dropZone.classList.remove("animate-bounce"), 500);
  });

  // ✅ Manual upload
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  });
}
