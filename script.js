const API_KEY = "EmrqUgGfVz0H1duyHhAFWxLJOwlmB9rXXNfiRXBk";
const BASE_URL = "https://api.nasa.gov/planetary/apod?api_key=" + API_KEY;

const datePicker = document.getElementById("date-picker");
const skeleton = document.getElementById("skeleton");
const errorState = document.getElementById("error-state");
const errorMessage = document.getElementById("error-message");
const content = document.getElementById("content");
const titleEl = document.getElementById("title");
const imageEl = document.getElementById("image");
const hdLink = document.getElementById("hd-link");
const dateText = document.getElementById("date-text");
const explanationEl = document.getElementById("explanation");

// Set date picker limits
const today = new Date();
datePicker.max = formatDate(today);
datePicker.min = "1995-06-16"; // first ever APOD

// Listen for date change
datePicker.addEventListener("change", function () {
  fetchAPOD(this.value);
});

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function goToToday() {
  datePicker.value = "";
  fetchAPOD();
}

function showState(state) {
  skeleton.classList.add("hidden");
  errorState.classList.add("hidden");
  content.classList.add("hidden");

  if (state === "loading") skeleton.classList.remove("hidden");
  if (state === "error") errorState.classList.remove("hidden");
  if (state === "content") content.classList.remove("hidden");
}

function fetchAPOD(date) {
  showState("loading");

  let url = BASE_URL;
  if (date) {
    url += "&date=" + date;
  }

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then(data => {
      titleEl.textContent = data.title;
      imageEl.src = data.url;
      imageEl.alt = data.title;

      // High-res link — only show if hdurl exists and it's an image
      if (data.hdurl && data.media_type === "image") {
        hdLink.href = data.hdurl;
        hdLink.classList.remove("hidden");
      } else {
        hdLink.classList.add("hidden");
      }

      // Show formatted date
      const d = new Date(data.date + "T00:00:00");
      dateText.textContent = d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });

      explanationEl.textContent = data.explanation;
      showState("content");
    })
    .catch(error => {
      errorMessage.textContent = error.message || "Something went wrong";
      showState("error");
    });
}

fetchAPOD();