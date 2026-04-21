
# 🧠 AI-Powered Content Summarizer (Transformers.js)

A fully client-side AI application that summarizes text and documents directly in the browser using **Transformers.js**, **Web Workers**, and **ONNX runtime**.

This project demonstrates real-world AI integration, performance optimization, and modern frontend architecture.

---

## 🚀 Features

* ✨ **Text Summarization** (short & long content)
* 📄 **File Upload Support** (.txt, .md, .json, .pdf)
* 🧩 **Chunking for Large Text** (LangChain-style processing)
* ⚡ **Web Worker Offloading** (non-blocking UI)
* 🧠 **Local AI Inference** (no API calls, runs fully in-browser)
* 🛑 **Cancelable Inference (Stop Button)**
* 💾 **Model Caching with IndexedDB**
* 🎯 **Dynamic UI State Management**
* 🚀 **WebGPU / WASM Acceleration**

---

## 🧱 Tech Stack

### 🧠 AI / ML

* **Transformers.js (@xenova/transformers)**
* **ONNX Runtime (WebAssembly / WebGPU)**
* **DistilBART CNN Model (Summarization)**

### ⚙️ Processing

* **LangChain Text Splitter**
* **Custom Chunking Pipeline**
* **Tokenizer-based chunk sizing**

### 🧵 Concurrency

* **Web Workers**

  * Offloads heavy AI computation
  * Prevents UI freezing
  * Enables safe termination (memory cleanup)

### 💾 Storage

* **IndexedDB**

  * Model caching detection
  * Avoids repeated heavy loads

### 🎨 Frontend

* **Vanilla JavaScript (ES Modules)**
* **Tailwind CSS**
* **Webpack (Multi-page setup)**

### 📄 File Handling

* **PDF.js** (for PDF text extraction)

---

## 🏗️ Architecture Overview

```
Main Thread (UI)
 ├── AnalyzeButton (User Interaction)
 ├── UI State Manager
 ├── File Handler (Upload + Parsing)
 └── Worker Controller
        ↓
Web Worker (AI Engine)
 ├── transformersSetup (model loading)
 ├── chunking (large text handling)
 ├── summarization pipeline
 └── STOP signal handling
```

---

## 🧠 How It Works

### 1. User Input

* User pastes text or uploads a file

### 2. Worker Execution

* Text is sent to a **Web Worker**
* Worker decides:

  * Short text → direct summarization
  * Long text → chunk → summarize → reduce

### 3. AI Processing

* Runs locally using **Transformers.js**
* Uses ONNX model (`distilbart-cnn-6-6`)

### 4. Result

* Summary is returned to UI
* UI updates state accordingly

---

## 🛑 Stop / Cancellation System

The app includes a robust stop mechanism:

* Sends a **STOP signal** to worker
* Interrupts chunk processing
* Terminates worker thread
* Frees memory (CPU / GPU / WASM)

---

## ⚡ Performance Optimizations

* Web Workers for parallel processing
* Token-aware chunking (prevents overflow)
* IndexedDB model caching detection
* WASM multi-threading
* Optional WebGPU acceleration

---

## ☁️ Model Hosting (Cloudflare R2)

Due to the large size of the Transformers.js model (~556 MB), the model is not bundled with the application. Instead, it is hosted using Cloudflare R2 for efficient, scalable delivery.

### 🧠 Why Cloudflare R2?

- Avoids bundling large ONNX files in the frontend
- Enables fast CDN-based model delivery
- No egress fees (cost-efficient for production)
- Scalable and production-ready storage

---

### ⚠️ Important Note

## ☁️ Model Hosting (Cloudflare R2 via Rclone)

Due to the large size of the Transformers.js model (~556MB), the model is not bundled with the frontend.  
Instead, it is hosted on Cloudflare R2 and accessed via a public endpoint.

---

## ⚠️ Why This Approach?

Browser uploads are unreliable for large model files (>300MB).  
To ensure reliable, resumable uploads, this project uses:

- **Rclone CLI (S3-compatible)**
- Cloudflare R2 Object Storage

---

## 🚀 Setup Instructions

### 1. Install Rclone

```bash
winget install Rclone.Rclone


2. Configure Rclone for Cloudflare R2
rclone config

n) New remote
name> r2

Storage> S3
provider> Cloudflare

env_auth> false (enter credentials manually)

access_key_id> <YOUR_R2_ACCESS_KEY>
secret_access_key> <YOUR_R2_SECRET_KEY>

region> auto

endpoint> https://<account-id>.r2.cloudflarestorage.com

Save configuration.
Go to Cloudflare dashboard:

R2 → Manage R2 API Tokens
Create API token with:
Read + Write access to bucket

3.Upload Model to R2
Ensure your local structure:
src/transformers/Xenova/distilbart-cnn-6-6/

Then run:
rclone copy "src/transformers/Xenova" r2:transformers-models/Xenova -P

4. Verify Upload
rclone ls r2:transformers-models

5. Enable Public Access
In Cloudflare dashboard:
Go to R2 → your bucket
Enable:
Public Development URL

6. Configure CORS (Required for Browser Access)
Add this CORS policy:
[
  {
    "AllowedOrigins": [
      "*"
    ],
    "AllowedMethods": [
      "GET",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "Content-Length",
      "Content-Type"
    ]
  }
]

7.Update your configuration:
env.allowLocalModels = false;
env.allowRemoteModels = true;
env.remoteHost = "https://<your-public-r2-url>";

## 📁 Project Structure

```
---

the current file structure:

Ai_powered_content_summarizer/

├── dist/ ← your Webpack build output
│ ├── Text-Content/
│ │ └── TextUi.html ← built text page HTML
│ ├── Video-Content/
│ │ └── VideoUi.html ← built video page HTML
│ │
│ ├── index.html ← built main landing page
│ ├── 8879230a09f251ef51f4.ico ← favicon processed by Webpack
│ ├── main.js ← JS bundle for landing page
│ ├── text.js ← JS bundle for text page
│ └── video.js ← JS bundle for video page
│
├── node_modules/ ← project dependencies
│
├── src/ ← source files
│ ├── icon/
│ │       └── favicon.ico ← source favicon
│ ├── styles/
│ │       └── tailwind.css ← Tailwind source styles
│ │
│ ├── Text-Content/
│ │     ├── TextUi.html ← text page HTML source
│ │     └── TextUi.js ← text page JS logic
│ │     ├── AnalyzeButton.js ← start the model
│ │     ├── Slider.js (no longer in use)
│ │     ├── FileHandler.js (mainly responsible for Ui file uploads)
│ │   
│ │
│ ├─ Storage/
│ │     └──indexeddb.js (cache the model)
│ │
│ └── Video-Content/ (Future development for RAG pipeline)
│ │   │
│ │   ├── VideoUi.html ← video page HTML source
│ │   └── VideoUi.js ← video page JS logic
│ │
│ │──Transformers/
│ │ │──transformersSetup.js (300 mb after npm install @xenova/transformers -scripts )
│ │ │ │
│ │ │ └── Xenova/
│ │ │       └── distilbart-cnn-6-6/
│ │ │            │     └── onnx/
│ │ │            │            ├── decoder_model_merged_quantized.onnx (147 mb)
│ │ │            │            ├── decoder_model_quantized.onnx (147 mb)
│ │ │            │            ├── decoder_with_past_model_quantized.onnx (135 mb)
│ │ │            │            ├── encoder_model_quantized.onnx (122 mb )
│ │ │            │
│ │ │            │── config.json
│ │ │            │── generation_config.json
│ │ │            │── gitattributes
│ │ │            │── merges.txt
│ │ │            │── quantize_config.json
│ │ │            │── README.md
│ │ │            │── special_tokens_map.json
│ │ │            │── tokenizer_config.json
│ │ │            │── tokenizer.json
│ │ │            │── vocab.json
│ │ │             
│ │ │
│ │ │── chunking.js (langchain for processing long text/data)
│ │
│ │── Ui_StateManagement/
│ │               └── Ui_state.js ( for managing the state of the Ui)
│ │           
│ │
│ │── Workers/
│ │         └── smmmarizer.worker.js (web worker that does the heavy processing)
│ │         └── workerController.js (owns the web worker and also stops it)
│ │
│ │─contentSummarizer.html (home page)
│ │─index.js (main index )
│
├── .babelrc ← Babel config for transpiling JS
├── .gitignore ← ignores node_modules, dist, etc.
├── package.json ← NPM config + scripts
├── package-lock.json ← exact NPM dependency versions
├── postcss.config.js ← Tailwind + Autoprefixer config
├── tailwind.config.js ← Tailwind customization
├── techstack.txt ← optional doc to describe your tech choices
├── requirements.txt ← (just a file i created documenting the development process)
└── webpack.config.js ← Webpack config for multiple pages + assets

---

```

---

## 🧪 Key Engineering Highlights

* ✅ Separation of concerns (UI vs Worker vs AI logic)
* ✅ Singleton model loading pattern
* ✅ Graceful + forced worker termination
* ✅ Race-condition handling (async safety)
* ✅ Memory lifecycle awareness (WASM + GC)

---

## ⚠️ Limitations

* Initial model load is large (~300MB+)
* Browser memory constraints apply
* WebGPU support varies by device
* Transformers Model is token limited to 1024

---

## 🔮 Future Improvements

* 🔁 Model reuse (avoid reload after stop)
* 🎙️ Audio/video summarization
* 🌐 URL scraping (GitHub / Wikipedia)
* 📊 Summary customization (length control)
* 🧠 Multi-model support

---

## 📌 Why This Project Matters

This is not just a demo — it showcases:

* Real-world AI integration in frontend apps
* Performance-conscious engineering
* Advanced async + concurrency handling
* Production-level architecture thinking

---

## 👨‍💻 Author

**Abongile Mavela**

---

## 🪪 License

MIT License
=======
# ai-content-summarizer
this is an ai app that uses the transformers model
>>>>>>> 53c22752312e8f8bd9f1444f55c9d0050bf5e588
