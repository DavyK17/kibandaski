const express = require("express");
const app = express();
const port = 8000;

app.get("/", (req, res) => {
    res.send("<h1>Wagwan</h1>");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});