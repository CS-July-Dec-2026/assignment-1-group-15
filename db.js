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
      message TEXT,
      iv TEXT
    );
  `);

  const addAccount = db.prepare(
    "INSERT INTO accounts (username, password, display_name, message, iv) VALUES (?, ?, ?, ?, ?)"
  );

  addAccount.run("arjun", "Football123", "Arjun", null, null);
  addAccount.run("meera", "SummerFun2024", "Meera", null, null);
  addAccount.run("kabir", "ChessMaster9", "Kabir", null, null);
  addAccount.run("zara", "RainbowUnicorn", "Zara", null, null);

  console.log("Set up a fresh classmates.db with four accounts.");
}

module.exports = db;
