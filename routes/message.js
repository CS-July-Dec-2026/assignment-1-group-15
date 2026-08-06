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
    <form id="message-form" method="POST" action="/set-message">
      <label>Your message</label>
      <input type="text" id="raw-message" placeholder="Say something fun!" required autofocus>
      <label>Your password (to encrypt)</label>
      <input type="password" id="encrypt-password" required>
      <input type="hidden" name="ciphertext" id="ciphertext">
      <input type="hidden" name="iv" id="iv">
      <button type="submit" class="btn btn-yellow">Save Message 💾</button>
    </form>
    <a href="/account" class="btn btn-pink" style="margin-top: 14px; display:inline-block;">Back</a>

    <script src="/public/crypto.js"></script>
    <script>
      document.getElementById('message-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const msg = document.getElementById('raw-message').value;
        const pwd = document.getElementById('encrypt-password').value;
        
        try {
            const encrypted = await encryptMessage(msg, pwd);
            document.getElementById('ciphertext').value = encrypted.ciphertext;
            document.getElementById('iv').value = encrypted.iv;
            
            // Clear plain text values before submitting
            document.getElementById('raw-message').value = '';
            document.getElementById('encrypt-password').value = '';
            
            this.submit();
        } catch (error) {
            alert('Encryption failed: ' + error.message);
        }
      });
    </script>
  `));
});

router.post("/set-message", (req, res) => {
  if (!req.cookies.username) {
    return res.redirect("/");
  }

  db.prepare("UPDATE accounts SET message = ?, iv = ? WHERE username = ?").run(
    req.body.ciphertext,
    req.body.iv,
    req.cookies.username
  );

  res.redirect("/account");
});

module.exports = router;
