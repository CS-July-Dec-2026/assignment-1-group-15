# PRIVATE INSTRUCTOR SCRIPT — Do Not Show To Students

This file, and this file alone, is what makes the trick work. The app
itself (server.js, public/style.css) contains no comments, hints, or
naming that would tip off a reader — students can read the entire
source code and find nothing suspicious, as intended.

---

## Setup (do this before class)

```bash
git clone <your-repo-url>
cd classmate-hub
npm install
npm start
```

This creates classmates.db automatically on first run, with four
accounts:

| Username | Starting Password | Display Name |
|---|---|---|
| arjun | Football123 | Arjun |
| meera | SummerFun2024 | Meera |
| kabir | ChessMaster9 | Kabir |
| zara | RainbowUnicorn | Zara |

Make sure your machine is reachable on the intranet from student
machines (same network/Wi-Fi, firewall allowing the port — port 3000 by
default). Test the URL from one student laptop before the session starts
so you're not debugging networking live in front of the class.

---

## The Demo Script — Step by Step

### 1. Show the code first (this is the whole point)

Project server.js on screen, or let students read it on their own
laptops. Let them genuinely look for a minute or two. Ask: "does anyone
see anything wrong with this?" They shouldn't find anything — that's
expected and intended. Move on once it's clear nobody has spotted it.

### 2. Host it, and have everyone connect

Start the server on your machine (npm start), and give students your
intranet IP and port, e.g. http://192.168.1.42:3000. Have a few
students open it in their browsers to confirm they can reach it.

### 3. Pick one volunteer as "the target" (using Zara in this script)

Have that student:
1. Log in normally with the starting password (zara / RainbowUnicorn).
2. Click "Set My Message" and type something only they would know —
   a fun fact, an inside joke, anything personal and a little silly.
   This is the "proof" ingredient for later.
3. Click "Change Password" and set a brand new password — and tell
   them explicitly not to say it out loud or show anyone.

### 4. Challenge the rest of the class

Ask two or three other students to try logging in as that user (e.g.
zara) using the old password, or just guessing. They'll get "That
username/password didn't match. Try again!" every time. Let this go on
for a bit — the failed attempts are what make the reveal land.

### 5. The reveal

On your own machine (or projected), go to the login page and enter:

- Username: zara' --   (replace zara with whichever student
  you picked — the trailing ' -- is the exact trick)
- Password: anything at all — literally type xxxxx or leave a
  single character. It is never checked.

(Verified: both `zara' --` with a space, and `zara'--` with no space,
work identically — so don't worry about getting the spacing exactly
right if you're typing this live and nervous about it.)

Click Log In. You will land on the account page as that student —
and it will display THEIR secret message, the one only they set,
that you never saw or were told. That's the "how did you know that?!"
moment.

### 6. Let the surprise land before explaining anything

Resist the urge to immediately explain what happened. Ask the class:
"how do you think I just did that, without knowing the password?" Let a
few guesses happen. This is the moment curiosity peaks — which is
exactly the point of running the demo this way before teaching the
underlying concept.

### 7. Now teach the mechanism

Once curiosity is high, this is the moment to introduce SQL Injection as
a concept — walk through the vulnerable line in server.js:

```js
const checkQuery = "SELECT * FROM accounts WHERE username = '" + username + "' AND password = '" + password + "'";
```

and show how zara' -- turns the query into:

```sql
SELECT * FROM accounts WHERE username = 'zara' --' AND password = 'xxxxx'
```

— where -- starts a SQL comment, deleting the password check entirely
from the database's point of view.

---

## Resetting between class sections / demo runs

Delete the database file and restart:

```bash
rm classmates.db
npm start
```

This recreates all four accounts with their original starting passwords
and no messages, ready for the next group.

## If you want to demonstrate the fix afterward

Show the one-line change that closes it, so the lesson ends on the
solution, not just the exploit:

```js
// Vulnerable (what's in server.js today):
const checkQuery = "SELECT * FROM accounts WHERE username = '" + username + "' AND password = '" + password + "'";
const match = db.prepare(checkQuery).get();

// Fixed:
const match = db.prepare("SELECT * FROM accounts WHERE username = ? AND password = ?").get(username, password);
```

Notice this is the exact same pattern already used safely elsewhere in
the same file (/account, /set-message, /change-password all use
? placeholders) — a nice detail to point out: the safe pattern and the
unsafe pattern were sitting side by side the whole time.
