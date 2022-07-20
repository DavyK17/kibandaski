require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 8000;

// App
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ info: "Welcome to Kibandaski" });
});

// Listener
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});