// No API key here anymore — the browser calls our own server, which holds
// the real NASA key in .env and forwards the request server-side.
const BASE_URL = "/api/apod?ignore=1";

const datePicker = document.getElementById("date-picker");
const skeleton = document.getElementById("skeleton");
const errorState = document.getElementById("error-state");
const errorMessage = document.getElementById("error-message");
const content = document.getElementById("content");
const titleEl = document.getElementById("title");
const imageEl = document.getElementById("image");
const imageLoading = document.getElementById("image-loading");
const videoContainer = document.getElementById("video-container");
const hdLink = document.getElementById("hd-link");
const dateText = document.getElementById("date-text");
const explanationEl = document.getElementById("explanation");
const copyrightEl = document.getElementById("copyright");
const favBtn = document.getElementById("fav-btn");
const favCount = document.getElementById("fav-count");
const favList = document.getElementById("fav-list");
const favEmpty = document.getElementById("fav-empty");
const favPanel = document.getElementById("fav-panel");
const favOverlay = document.getElementById("fav-overlay");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const toast = document.getElementById("toast");


let currentDate = null;
let lightboxOpen = false;
let favPanelOpen = false;

const today = new Date();
datePicker.max = formatDate(today);
datePicker.min = "1995-06-16";

datePicker.addEventListener("change", function () {
  fetchAPOD(this.value);
});


function createStars() {
  const container = document.getElementById("stars");
  for (let i = 0; i < 160; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    const size = Math.random() * 2 + 0.5;
    star.style.width = size + "px";
    star.style.height = size + "px";
    star.style.animationDelay = Math.random() * 4 + "s";
    star.style.animationDuration = (Math.random() * 3 + 2) + "s";
    container.appendChild(star);
  }
}


function showState(state) {
  skeleton.classList.add("hidden");
  errorState.classList.add("hidden");
  content.classList.add("hidden");
  content.classList.remove("visible");
  errorState.classList.remove("visible");

  if (state === "loading") {
    skeleton.classList.remove("hidden");
  }
  if (state === "error") {
    errorState.classList.remove("hidden");
    requestAnimationFrame(() => errorState.classList.add("visible"));
  }
  if (state === "content") {
    content.classList.remove("hidden");
    requestAnimationFrame(() => content.classList.add("visible"));
  }
}

function fetchAPOD(date) {
  showState("loading");

  let url = BASE_URL;
  if (date) {
    url += "&date=" + date;
  }

  fetch(url)
    .then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then(function (data) {
      if (data.code === 400) throw new Error(data.msg || "Invalid date");
      displayData(data);
    })
    .catch(function (error) {
      errorMessage.textContent = error.message || "Something went wrong";
      showState("error");
    });
}


function displayData(data) {
  currentDate = data.date;
  datePicker.value = data.date;

  titleEl.textContent = data.title;
  explanationEl.textContent = data.explanation;

  var d = new Date(data.date + "T00:00:00");
  dateText.textContent = d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  if (data.copyright) {
    copyrightEl.textContent = "\u00A9 " + data.copyright;
    copyrightEl.classList.remove("hidden");
  } else {
    copyrightEl.classList.add("hidden");
  }

  if (data.media_type === "video") {
    imageEl.style.display = "none";
    imageLoading.classList.add("hidden");
    videoContainer.innerHTML =
      '<iframe src="' + data.url + '" allowfullscreen></iframe>';
    videoContainer.classList.remove("hidden");
    hdLink.classList.add("hidden");
  } else {
    videoContainer.classList.add("hidden");
    videoContainer.innerHTML = "";
    imageEl.style.display = "none";
    imageEl.style.opacity = "0";
    imageLoading.classList.remove("hidden");
    imageEl.src = data.url;
    imageEl.alt = data.title;

    if (data.hdurl) {
      hdLink.href = data.hdurl;
      hdLink.classList.remove("hidden");
    } else {
      hdLink.classList.add("hidden");
    }
  }

  updateFavButton(data.date);

  showState("content");
}

function onImageLoad() {
  imageLoading.classList.add("hidden");
  imageEl.style.display = "block";
  requestAnimationFrame(function () {
    imageEl.style.opacity = "1";
  });
}

function formatDate(date) {
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function goToToday() {
  datePicker.value = "";
  fetchAPOD();
}

function randomAPOD() {
  showState("loading");
  fetch(BASE_URL + "&count=1")
    .then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then(function (data) {
      displayData(data[0]);
    })
    .catch(function (error) {
      errorMessage.textContent = error.message || "Something went wrong";
      showState("error");
    });
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("nasa-apod-favorites")) || [];
  } catch (e) {
    return [];
  }
}

function saveFavorites(list) {
  localStorage.setItem("nasa-apod-favorites", JSON.stringify(list));
}

function toggleFavorite() {
  if (!currentDate) return;
  var favorites = getFavorites();
  var index = -1;
  for (var i = 0; i < favorites.length; i++) {
    if (favorites[i].date === currentDate) {
      index = i;
      break;
    }
  }

  if (index > -1) {
    favorites.splice(index, 1);
    showToast("Removed from favorites");
  } else {
    favorites.push({ date: currentDate, title: titleEl.textContent });
    showToast("Added to favorites");
  }

  saveFavorites(favorites);
  updateFavButton(currentDate);
  renderFavorites();
}
function updateFavButton(date) {
  var favorites = getFavorites();
  var isFav = false;
  for (var i = 0; i < favorites.length; i++) {
    if (favorites[i].date === date) {
      isFav = true;
      break;
    }
  }
  favBtn.textContent = isFav ? "\u2665" : "\u2661";
  if (isFav) {
    favBtn.classList.add("active");
  } else {
    favBtn.classList.remove("active");
  }
}

function renderFavorites() {
  var favorites = getFavorites();
  favCount.textContent = favorites.length;

  if (favorites.length === 0) {
    favList.innerHTML = "";
    favEmpty.classList.remove("hidden");
    return;
  }

  favEmpty.classList.add("hidden");
  var html = "";
  for (var i = favorites.length - 1; i >= 0; i--) {
    html +=
      '<div class="fav-item" onclick="loadFavorite(\'' + favorites[i].date + '\')">' +
      '<div class="fav-item-date">' + favorites[i].date + '</div>' +
      '<div class="fav-item-title">' + favorites[i].title + '</div>' +
      '</div>';
  }
  favList.innerHTML = html;
}

function loadFavorite(date) {
  toggleFavorites();
  fetchAPOD(date);
}

function toggleFavorites() {
  favPanelOpen = !favPanelOpen;
  if (favPanelOpen) {
    renderFavorites();
    favOverlay.classList.remove("hidden");
    requestAnimationFrame(function () {
      favOverlay.classList.add("visible");
      favPanel.classList.add("open");
    });
  } else {
    favOverlay.classList.remove("visible");
    favPanel.classList.remove("open");
    setTimeout(function () {
      favOverlay.classList.add("hidden");
    }, 300);
  }
}

function openLightbox() {
  if (imageEl.style.display === "none") return;
  lightboxImg.src = imageEl.src;
  lightboxImg.alt = imageEl.alt;
  lightbox.classList.remove("hidden");
  lightboxOpen = true;
  requestAnimationFrame(function () {
    lightbox.classList.add("visible");
  });
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("visible");
  lightboxOpen = false;
  document.body.style.overflow = "";
  setTimeout(function () {
    lightbox.classList.add("hidden");
  }, 300);
}

function shareAPOD() {
  var text = titleEl.textContent;
  var url = window.location.href;

  if (navigator.share) {
    navigator.share({ title: text, url: url }).catch(function () {});
  } else {
    navigator.clipboard.writeText(url).then(function () {
      showToast("Link copied to clipboard");
    });
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  setTimeout(function () {
    toast.classList.remove("visible");
  }, 2000);
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if (lightboxOpen) closeLightbox();
    if (favPanelOpen) toggleFavorites();
  }
});

createStars();
fetchAPOD();