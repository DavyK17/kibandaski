require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const { Pool } = require("pg");
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

const session = require("express-session");
const store = new session.MemoryStore();

const app = express();
const db = require("./db/index");
const port = process.env.PORT || 8000;

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
        secure: true,
        sameSite: "none",
    },
    store
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query("SELECT id FROM users WHERE id = $1", [id]);
        if (result.rows.length === 0) return done(null, false);

        return done(null, { id: result.rows[0].id });
    } catch(err) {
        return done(err);
    }
});

passport.use(new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
        try {
            const result = await pool.query("SELECT id, email, password FROM users WHERE email = $1", [email]);
            if (result.rows.length === 0) return done(null, false);
            
            const passwordMatch = await bcrypt.compare(password, result.rows[0].password);
            if (!passwordMatch) return done(null, false);

            return done(null, { id: result.rows[0].id });
        } catch(err) {
            return done(err);
        }
    }
));

app.get("/", (req, res) => {
    res.json({ info: "Welcome to Kibandaski" });
});

// User account
app.get("/account", (req, res) => {
    res.json({ info: "Login successful" });
});

// User registration
app.get("/register", (req, res) => {
    res.json({ info: "Create a new account" });
});

app.post("/register", db.users.createUser);

// User login
app.get("/login", (req, res) => {
    res.json({ info: "Kindly log in with your account details" });
});

app.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("account")
    }
);

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
app.all("*", (req, res) => {
    res.status(400).send("Error: This operation does not exist");
});

// Listener
app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});