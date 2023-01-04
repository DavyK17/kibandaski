/* CONFIGURATION */

// General
require("dotenv").config();
const router = require("express").Router();
const bcrypt = require("bcrypt");
const client = require("../db/client");
const db = require("../db/index").customer.users;
const idGen = require("../util/idGen");
const requestIP = require("request-ip");

// connect-ensure-login
const login = require("connect-ensure-login").ensureLoggedIn("/login");
const logout = require("connect-ensure-login").ensureLoggedOut("/account");

// Passport.js
const passport = require("passport");
const authenticate = async(req, email, password, done) => {
    const ip = requestIP.getClientIp(req);
    const attemptId = idGen(15);

    try {
        let result = await client.query("SELECT users.id AS id, users.email AS email, users.password AS password, users.role AS role, carts.id AS cart_id FROM users JOIN carts ON carts.user_id = users.id WHERE email = $1", [email]);
        if (result.rows.length === 0) return done(null, false);

        const passwordMatch = await bcrypt.compare(password, result.rows[0].password);
        if (!passwordMatch) {
            let text = `INSERT INTO login_attempts (id, ip, email, attempted_at, successful) VALUES ($1, $2, $3, to_timestamp(${Date.now()} / 1000), FALSE)`;
            let values = [attemptId, ip, email];
            result = await client.query(text, values);

            return done(null, false);
        }

        let text = `INSERT INTO login_attempts (id, ip, email, attempted_at, successful) VALUES ($1, $2, $3, to_timestamp(${Date.now()} / 1000), TRUE)`;
        let values = [attemptId, ip, email];
        result = await client.query(text, values);

        return done(null, { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role, cartId: result.rows[0].cart_id });
    } catch (err) {
        return done(err);
    }
}

const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy({ usernameField: "email", passReqToCallback: true }, authenticate));

const { BasicStrategy } = require("passport-http");
passport.use(new BasicStrategy({ usernameField: "email", passReqToCallback: true }, authenticate));

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

// User object
router.get("/user", login, (req, res) => res.json(req.user));

// User registration
router.get("/register", (req, res) => {
    res.send("Create a new account");
});

router.post("/register", db.createUser);

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