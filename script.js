const API_KEY = "PASTE_YOUR_KEY_HERE";
const URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

const skeleton = document.getElementById("skeleton");
const errorState = document.getElementById("error-state");
const errorMessage = document.getElementById("error-message");
const content = document.getElementById("content");
const titleEl = document.getElementById("title");
const imageEl = document.getElementById("image");
const explanationEl = document.getElementById("explanation");

function showState(state) {
  skeleton.classList.add("hidden");
  errorState.classList.add("hidden");
  content.classList.add("hidden");

  if (state === "loading") skeleton.classList.remove("hidden");
  if (state === "error") errorState.classList.remove("hidden");
  if (state === "content") content.classList.remove("hidden");
}

function fetchAPOD() {
  showState("loading");

  fetch(URL)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      titleEl.textContent = data.title;
      imageEl.src = data.url;
      imageEl.alt = data.title;
      explanationEl.textContent = data.explanation;
      showState("content");
    })
    .catch(error => {
      errorMessage.textContent = error.message || "Something went wrong";
      showState("error");
    });
}

fetchAPOD();