import debounce from "lodash/debounce";
import "./styles/tailwind.css";


//link each button from home Ui to each button
document.addEventListener("DOMContentLoaded", () => {
  const textButton = document.getElementById('text-button');
  const videoButton = document.getElementById('video-button');

  if (textButton) {
    textButton.addEventListener('click', () => {
      window.location.href = 'Text-Content/TextUi.html';
    });
  }

  if (videoButton) {
    videoButton.addEventListener('click', () => {
     // window.location.href = 'Video-Content/VideoUi.html';
     alert(`Hi there This Feature is still in development, it was meant to be a RAG pipeline for video content Stay tuned for more of this future development`)
    });
  }
});


