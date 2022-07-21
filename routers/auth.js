/* CONFIGURATION */

// General
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db/index");

// node-postgres
const { Pool } = require("pg");
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Passport.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { ensureLoggedIn } = require("connect-ensure-login");

passport.use(new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
        try {
            const result = await pool.query("SELECT id, email, password FROM users WHERE email = $1", [email]);
            if (result.rows.length === 0) return done(null, false);
            
            const passwordMatch = await bcrypt.compare(password, result.rows[0].password);
            if (!passwordMatch) return done(null, false);

            return done(null, { id: result.rows[0].id, email: result.rows[0].email });
        } catch(err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query("SELECT id, email FROM users WHERE id = $1", [id]);
        if (result.rows.length === 0) return done(null, false);

        return done(null, { id: result.rows[0].id, email: result.rows[0].email });
    } catch(err) {
        return done(err);
    }
});

/* IMPLEMENTATION */

// User account
router.get("/account", ensureLoggedIn("/login"), (req, res) => {
    res.json(req.user);
});

// User registration
router.get("/register", (req, res) => {
    res.json({ info: "Create a new account" });
});

router.post("/register", db.users.createUser);

// User login and logout
router.get("/login", (req, res) => {
    res.json({ info: "Kindly log in with your account details" });
});

router.post("/login", passport.authenticate("local", { failureRedirect: "/login" }), (req, res) => {
    res.json({ info: "Login successful" });
});

router.get("/logout", ensureLoggedIn("/login"), (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.json({ info: "Logout successful" });
    });
});

module.exports = router;