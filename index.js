require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 8000;
const db = require("./db/index");

// App
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ info: "Welcome to Kibandaski" });
});

// User registration
app.post("/register", db.users.createUser);

// Routers
const usersRouter = require("./routers/users");
app.use("/users", usersRouter);

// const productsRouter = require("./routers/products");
// app.use("/products", productsRouter);

// const ordersRouter = require("./routers/orders");
// app.use("/orders", ordersRouter);

// const cartRouter = require("./routers/cart");
// app.use("/cart", cartRouter);

// Error messages
app.get("*", (req, res) => {
    res.status(404).send("Error: This operation does not exist");
});

app.post("*", (req, res) => {
    res.status(404).send("Error: This operation does not exist");
});

app.put("*", (req, res) => {
    res.status(404).send("Error: This operation does not exist");
});

app.delete("*", (req, res) => {
    res.status(404).send("Error: This operation does not exist");
});

// Listener
app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});