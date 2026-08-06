const express = require("express");
const router = express.Router();
const db = require("../db");
const { page } = require("../views");

router.get("/account", (req, res) => {
  if (!req.cookies.username) {
    return res.redirect("/");
  }

  const me = db.prepare("SELECT * FROM accounts WHERE username = ?").get(req.cookies.username);
  if (!me) {
    res.clearCookie("username");
    return res.redirect("/");
  }

  const messageBlock = me.message
    ? `<div class="message-box" id="msg-container" data-ciphertext="${me.message}" data-iv="${me.iv}">
         <div id="locked-state">
           💬 <strong>${me.display_name}'s message:</strong><br>
           🔒 <em>Message is encrypted</em><br><br>
           <input type="password" id="unlock-password" placeholder="Enter password">
           <button id="unlock-btn" class="btn btn-yellow" style="padding: 5px 10px; font-size: 0.9em;">Unlock</button>
         </div>
         <div id="decrypted-state" style="display: none;">
           💬 <strong>${me.display_name}'s message:</strong><br>
           <span id="decrypted-message"></span>
         </div>
       </div>
       <script src="/public/crypto.js"></script>
       <script>
         document.getElementById('unlock-btn').addEventListener('click', async () => {
           const pwd = document.getElementById('unlock-password').value;
           const container = document.getElementById('msg-container');
           const ciphertext = container.getAttribute('data-ciphertext');
           const iv = container.getAttribute('data-iv');
           
           try {
             const plaintext = await decryptMessage(ciphertext, iv, pwd);
             document.getElementById('decrypted-message').textContent = plaintext;
             document.getElementById('locked-state').style.display = 'none';
             document.getElementById('decrypted-state').style.display = 'block';
           } catch (error) {
             alert('Invalid password / Decryption failed');
           }
         });
       </script>`
    : `<div class="message-box empty">💬 No message set yet.</div>`;

  res.send(page("My Page", `
    <h1>👋 Hi, ${me.display_name}!</h1>
    ${messageBlock}
    <div class="button-row">
      <a href="/set-message" class="btn btn-yellow">✏️ Set My Message</a>
      <a href="/change-password" class="btn btn-green">🔑 Change Password</a>
    </div>
    <a href="/logout" class="btn btn-pink" style="margin-top: 14px; display:inline-block;">Log Out</a>
  `));
});

router.get("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/");
});

module.exports = router;
