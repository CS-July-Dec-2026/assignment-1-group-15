const express = require("express");
const router = express.Router();
const db = require("../db");
const { page } = require("../views");

router.get("/set-message", (req, res) => {
  if (!req.cookies.username) {
    return res.redirect("/");
  }

  res.send(page("Set My Message", `
    <h1>✏️ Set My Message</h1>
    <p class="subtitle">This will show up on your page.</p>
    <form method="POST" action="/set-message">
      <label>Your message</label>
      <input type="text" name="message" placeholder="Say something fun!" required autofocus>
      <button type="submit" class="btn btn-yellow">Save Message 💾</button>
    </form>
    <a href="/account" class="btn btn-pink" style="margin-top: 14px; display:inline-block;">Back</a>
  `));
});

router.post("/set-message", (req, res) => {
  if (!req.cookies.username) {
    return res.redirect("/");
  }

  db.prepare("UPDATE accounts SET message = ? WHERE username = ?").run(
    req.body.message,
    req.cookies.username
  );

  res.redirect("/account");
});

module.exports = router;
