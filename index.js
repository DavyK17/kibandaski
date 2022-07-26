/* CONFIGURATION */

// General
require("dotenv").config();
const app = require("express")();
const bodyParser = require("body-parser");
const passport = require("passport");
const port = process.env.PORT || 8000;

// Express session
const session = require("express-session");
const store = new session.MemoryStore();

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 172800000,
        secure: false,
        sameSite: "none",
    },
    store
}));

// Passport.js
app.use(passport.initialize());
app.use(passport.session());


/* IMPLEMENTATION */

app.get("/", (req, res) => {
    res.send("Welcome to Kibandaski!");
});

// Routers
const authRouter = require("./routers/auth");
app.use("/", authRouter);

const usersRouter = require("./routers/users");
app.use("/users", usersRouter);

const productsRouter = require("./routers/products");
app.use("/products", productsRouter);

// const ordersRouter = require("./routers/orders");
// app.use("/orders", ordersRouter);

// const cartRouter = require("./routers/cart");
// app.use("/cart", cartRouter);

// Error messages
app.all("*", (req, res) => {
    res.status(400).send("Error: This operation does not exist!");
});

// Listener
app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});