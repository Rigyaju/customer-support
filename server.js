const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "feedback.json");

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

function portalIsOpen() {
  return String(process.env.PORTAL_OPEN || "true").toLowerCase() !== "false";
}
function readFeedback() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); }
  catch (err) { if (err.code === "ENOENT") return []; throw err; }
}
function saveFeedback(items) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf8");
}

app.get("/api/status", (req, res) => {
  res.json({ open: portalIsOpen() });
});

app.post("/api/feedback", (req, res) => {
  if (!portalIsOpen()) return res.status(403).json({ error: "Feedback is currently closed." });
  const message = typeof req.body.message === "string" ? req.body.message.trim() : "";
  if (!message) return res.status(400).json({ error: "Please enter feedback." });
  if (message.length > 100) return res.status(400).json({ error: "Feedback must be 100 characters or fewer." });

  try {
    const items = readFeedback();
    items.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      message,
      submittedAt: new Date().toISOString()
    });
    saveFeedback(items);
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error("Could not save feedback:", err);
    res.status(500).json({ error: "We couldn't save your feedback. Please try again later." });
  }
});

app.get("/closed", (req, res) => res.sendFile(path.join(__dirname, "public", "closed.html")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, () => console.log(`Feedback portal listening on port ${PORT}`));