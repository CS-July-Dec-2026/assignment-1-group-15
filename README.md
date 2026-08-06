
# CS_Lab_1

A simple class portal where students can log in, set a fun personal
message on their page, and update their password.

## Features

- Log in with a username and password
- View your own page with a welcome message
- Set a short personal message that shows up on your page
- Change your password any time

## Tech Stack

- [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) for storage
- Plain HTML/CSS, no front-end framework

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. Open your browser to [http://localhost:3000](http://localhost:3000)

The database (`classmates.db`) is created automatically the first time
you run the app, with a few sample accounts to log in with.

## Project Structure

```
classmate-hub/
├── server.js              # app entry point
├── db.js                  # database setup
├── views.js                # shared page template
├── routes/
│   ├── login.js           # login page
│   ├── account.js         # account page + logout
│   ├── message.js         # set message page
│   └── password.js        # change password page
└── public/
    └── style.css           # styling
```

## Configuration

By default the app runs on port `3000`. To use a different port, set
the `PORT` environment variable before starting:

```bash
PORT=8080 npm start
```

## Client-Side AES-GCM Message Encryption

This application implements zero-knowledge message storage using the Web Crypto API.

### How It Works
- **Encryption**: When setting a message, the plaintext and the user's password never leave the browser. The password is hashed using SHA-256 and used as the key for AES-GCM encryption. A random 12-byte Initialization Vector (IV) is generated. The ciphertext and IV are base64-encoded and sent to the server.
- **Decryption**: On the account page, the server delivers only the ciphertext and IV. The message remains locked until the user enters their password, which is used to locally decrypt the message in the browser.
- **Security**: Because the server only sees the ciphertext and IV, it cannot read the plaintext messages.

### Verification Steps

1. **Verify Locked Page**:
   - Log in and navigate to `/account`. 
   - Notice the UI says "Message is encrypted" and prompts for a password.

2. **Verify Database Storage**:
   - Inspect `classmates.db` using a tool like SQLite Viewer.
   - The `message` column will contain Base64 ciphertext, and `iv` will contain a Base64 IV.

3. **Verify Network Tab (Save)**:
   - Open DevTools Network tab.
   - Go to "Set My Message", fill out the fields, and click save.
   - Inspect the POST request to `/set-message`. Only `ciphertext` and `iv` are sent. No plaintext is sent.

4. **Verify Network Tab (Unlock)**:
   - Open DevTools Network tab.
   - On the `/account` page, enter your password and click "Unlock".
   - Notice that **zero network requests** are made during the decryption process. All processing happens in-browser memory.
