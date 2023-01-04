/* CONFIGURATION */

// General
require("dotenv").config();
const router = require("express").Router();
const bcrypt = require("bcrypt");
const client = require("../db/client");
const db = require("../db/index");

// connect-ensure-login
const login = require("connect-ensure-login").ensureLoggedIn("/login");
const logout = require("connect-ensure-login").ensureLoggedOut("/account");

// Passport.js
const passport = require("passport");
const authenticate = async(email, password, done) => {
    try {
        let result = await client.query("SELECT users.id AS id, users.email AS email, users.password AS password, users.role AS role, carts.id AS cart_id FROM users JOIN carts ON carts.user_id = users.id WHERE email = $1", [email]);
        if (result.rows.length === 0) return done(null, false);

        const passwordMatch = await bcrypt.compare(password, result.rows[0].password);
        if (!passwordMatch) return done(null, false);

        return done(null, { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role, cartId: result.rows[0].cart_id });
    } catch (err) {
        return done(err);
    }
}

const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy({ usernameField: "email" }, authenticate));

const { BasicStrategy } = require("passport-http");
passport.use(new BasicStrategy({ usernameField: "email" }, authenticate));

passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    try {
        let result = await client.query("SELECT users.id AS id, users.email AS email, users.role AS role, carts.id AS cart_id FROM users JOIN carts ON carts.user_id = users.id WHERE users.id = $1", [id]);
        if (result.rows.length === 0) return done(null, false);

        return done(null, { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role, cartId: result.rows[0].cart_id });
    } catch (err) {
        return done(err);
    }
});

/* IMPLEMENTATION */

// User registration
router.get("/register", (req, res) => {
    res.send("Create a new account");
});

router.post("/register", db.users.createUser);

// User login and logout
router.get("/login", (req, res) => {
    res.send("Kindly log in with your account details");
});

router.post("/login", logout, passport.authenticate(["local", "basic"], { failureRedirect: "/login" }), (req, res) => {
    res.send("Login successful");
});

router.get("/logout", login, (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).send(`Error: ${err.detail}`);
        res.send("Logout successful");
    });
});

module.exports = router;