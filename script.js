const API_KEY = "EmrqUgGfVz0H1duyHhAFWxLJOwlmB9rXXNfiRXBk";
const URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

const titleEl = document.getElementById("title");
const imageEl = document.getElementById("image");
const explanationEl = document.getElementById("explanation");

fetch(URL)
  .then(response => response.json())
  .then(data => {
    titleEl.textContent = data.title;
    imageEl.src = data.url;
    imageEl.alt = data.title;
    explanationEl.textContent = data.explanation;
  })
  .catch(error => {
    titleEl.textContent = "Something went wrong";
    explanationEl.textContent = error.message;
  });