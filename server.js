const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(require("./routes/login"));
app.use(require("./routes/account"));
app.use(require("./routes/message"));
app.use(require("./routes/password"));

app.listen(PORT, () => {
  console.log(`Classmate Hub is running on http://localhost:${PORT}`);
});
