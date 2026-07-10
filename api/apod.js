// api/apod.js
// Vercel serverless function. Deployed automatically as GET /api/apod
// The key is read from the NASA_API_KEY environment variable set in the
// Vercel dashboard (Project Settings -> Environment Variables) — never from
// a committed file, and never sent to the browser.

module.exports = async function handler(req, res) {
  const NASA_API_KEY = process.env.NASA_API_KEY;

  if (!NASA_API_KEY) {
    return res.status(500).json({ msg: "Server is missing NASA_API_KEY" });
  }

  try {
    const params = new URLSearchParams({ api_key: NASA_API_KEY });

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
};
