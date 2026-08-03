# Classmate Hub

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
