require("dotenv").config();
const app = require("./app");
const port = process.env.PORT || 8000;

/* LISTENER */
app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});