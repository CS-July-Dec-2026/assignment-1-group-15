const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const dbFile = path.join(__dirname, "classmates.db");
const isNewDatabase = !fs.existsSync(dbFile);
const db = new Database(dbFile);

if (isNewDatabase) {
  db.exec(`
    CREATE TABLE accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      display_name TEXT NOT NULL,
      message TEXT
    );
  `);

  const addAccount = db.prepare(
    "INSERT INTO accounts (username, password, display_name, message) VALUES (?, ?, ?, ?)"
  );

  addAccount.run("arjun", "Football123", "Arjun", null);
  addAccount.run("meera", "SummerFun2024", "Meera", null);
  addAccount.run("kabir", "ChessMaster9", "Kabir", null);
  addAccount.run("zara", "RainbowUnicorn", "Zara", null);

  console.log("Set up a fresh classmates.db with four accounts.");
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));

function page(title, content) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title} - Classmate Hub</title>
  <link rel="stylesheet" href="/public/style.css">
</head>
<body>
  <div class="wrapper">
    <div class="card">
      ${content}
    </div>
  </div>
</body>
</html>`;
}

app.get("/", (req, res) => {
  if (req.cookies.username) {
    return res.redirect("/account");
  }

  res.send(page("Log In", `
    <h1>🎓 Classmate Hub</h1>
    <p class="subtitle">Log in to see your page!</p>
    <form method="POST" action="/login">
      <label>Username</label>
      <input type="text" name="username" placeholder="e.g. arjun" required autofocus>
      <label>Password</label>
      <input type="password" name="password" placeholder="Your password" required>
      <button type="submit" class="btn btn-blue">Log In 🚀</button>
    </form>
  `));
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const checkQuery = "SELECT * FROM accounts WHERE username = '" + username + "' AND password = '" + password + "'";
  const match = db.prepare(checkQuery).get();

  if (!match) {
    return res.send(page("Log In", `
      <h1>🎓 Classmate Hub</h1>
      <p class="subtitle sad">😕 That username/password didn't match. Try again!</p>
      <form method="POST" action="/login">
        <label>Username</label>
        <input type="text" name="username" placeholder="e.g. arjun" required autofocus>
        <label>Password</label>
        <input type="password" name="password" placeholder="Your password" required>
        <button type="submit" class="btn btn-blue">Log In 🚀</button>
      </form>
    `));
  }

  res.cookie("username", match.username);
  res.redirect("/account");
});

app.get("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/");
});

app.get("/account", (req, res) => {
  if (!req.cookies.username) {
    return res.redirect("/");
  }

  const me = db.prepare("SELECT * FROM accounts WHERE username = ?").get(req.cookies.username);
  if (!me) {
    res.clearCookie("username");
    return res.redirect("/");
  }

  const messageBlock = me.message
    ? `<div class="message-box">💬 <strong>${me.display_name}'s message:</strong><br>${me.message}</div>`
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

app.get("/set-message", (req, res) => {
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

app.post("/set-message", (req, res) => {
  if (!req.cookies.username) {
    return res.redirect("/");
  }

  db.prepare("UPDATE accounts SET message = ? WHERE username = ?").run(
    req.body.message,
    req.cookies.username
  );

  res.redirect("/account");
});

app.get("/change-password", (req, res) => {
  if (!req.cookies.username) {
    return res.redirect("/");
  }

  res.send(page("Change Password", `
    <h1>🔑 Change Password</h1>
    <p class="subtitle">Pick something only you know!</p>
    <form method="POST" action="/change-password">
      <label>New password</label>
      <input type="password" name="password" placeholder="New password" required autofocus>
      <button type="submit" class="btn btn-green">Save Password ✅</button>
    </form>
    <a href="/account" class="btn btn-pink" style="margin-top: 14px; display:inline-block;">Back</a>
  `));
});

app.post("/change-password", (req, res) => {
  if (!req.cookies.username) {
    return res.redirect("/");
  }

  db.prepare("UPDATE accounts SET password = ? WHERE username = ?").run(
    req.body.password,
    req.cookies.username
  );

  res.redirect("/account");
});

app.listen(PORT, () => {
  console.log(`Classmate Hub is running on http://localhost:${PORT}`);
});
