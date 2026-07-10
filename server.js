// server.js
// Tiny static file server + API proxy.
// The NASA API key lives ONLY here (server-side, via .env) and is never sent to the browser.

require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;
const NASA_API_KEY = process.env.NASA_API_KEY;

if (!NASA_API_KEY) {
  console.error(
    "Missing NASA_API_KEY. Copy .env.example to .env and paste your key from https://api.nasa.gov"
  );
  process.exit(1);
}

// Serve the static frontend (index.html, style.css, script.js, screenshot.png)
app.use(express.static(path.join(__dirname)));

// Proxy endpoint. Frontend calls THIS, never api.nasa.gov directly.
app.get("/api/apod", async (req, res) => {
  try {
    const params = new URLSearchParams({ api_key: NASA_API_KEY });

    // Only forward the params this app actually uses
    if (req.query.date) params.set("date", req.query.date);
    if (req.query.count) params.set("count", req.query.count);

    const nasaRes = await fetch(
      `https://api.nasa.gov/planetary/apod?${params.toString()}`
    );
    const data = await nasaRes.json();
    res.status(nasaRes.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to reach NASA APOD API" });
  }
});

app.listen(PORT, () => {
  console.log(`NASA APOD app running at http://localhost:${PORT}`);
});
