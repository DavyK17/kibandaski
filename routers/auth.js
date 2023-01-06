/* CONFIGURATION */

// General
const router = require("express").Router();
const bcrypt = require("bcrypt");
const pool = require("../db/pool");
const db = require("../db/index").customer.users;
const idGen = require("../util/idGen");
const requestIP = require("request-ip");

// Validation and sanitisation
const { isEmail, trim, escape, normalizeEmail } = require("validator");
const sanitizeHtml = require("../util/sanitizeHtml");

// connect-ensure-login
const login = require("connect-ensure-login").ensureLoggedIn("/auth/login");
const logout = require("connect-ensure-login").ensureLoggedOut("/auth/user");

// PASSPORT.JS
const passport = require("passport");

// Authentication function
const authenticate = async(req, email, password, done) => {
    // Get request IP address
    const ip = requestIP.getClientIp(req);

    // Generate attempt ID and define attempt log function
    const attemptId = idGen(15);
    const logAttempt = async(success) => {
        let text = `INSERT INTO login_attempts (id, ip, email, attempted_at, successful) VALUES ($1, $2, $3, to_timestamp(${Date.now()} / 1000), ${success})`;
        let values = [attemptId, ip, email];
        return await pool.query(text, values);
    }

    // Validate and sanitise email
    if (typeof email !== "string") return res.status(400).send("Error: Email must be a string.");
    email = sanitizeHtml(normalizeEmail(trim(escape(email)), { gmail_remove_dots: false }));
    if (!isEmail(email)) return res.status(400).send("Error: Invalid email provided.");

    try { // Get user details
        let result = await pool.query("SELECT users.id AS id, users.email AS email, users.password AS password, users.role AS role, carts.id AS cart_id FROM users JOIN carts ON carts.user_id = users.id WHERE email = $1", [email]);

        // Send null if user does not exist
        if (result.rows.length === 0) {
            await logAttempt(false);
            return done(null, false);
        }

        // Send null if password hashes do not match
        const passwordMatch = await bcrypt.compare(password, result.rows[0].password);
        if (!passwordMatch) {
            await logAttempt(false);
            return done(null, false);
        }

        // Add user to session
        await logAttempt(true);
        return done(null, { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role, cartId: result.rows[0].cart_id });
    } catch (err) {
        return done(err);
    }
}

// Strategies
const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy({ usernameField: "email", passReqToCallback: true }, authenticate));

const { BasicStrategy } = require("passport-http");
passport.use(new BasicStrategy({ usernameField: "email", passReqToCallback: true }, authenticate));

// Serialize and Deserealize
passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    try {
        let result = await pool.query("SELECT users.id AS id, users.email AS email, users.role AS role, carts.id AS cart_id FROM users JOIN carts ON carts.user_id = users.id WHERE users.id = $1", [id]);
        if (result.rows.length === 0) return done(null, false);

        return done(null, { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role, cartId: result.rows[0].cart_id });
    } catch (err) {
        return done(err);
    }
});

/* IMPLEMENTATION */

// User object
router.all("/user", login, (req, res) => res.json(req.user));

// Registration
router.get("/register", (req, res) => {
    res.send("Create a new account");
});

router.post("/register", db.createUser);

// Login
router.post("/login", logout, passport.authenticate(["local", "basic"]), (req, res) => {
    res.send("Login successful");
});

router.all("/login", (req, res) => {
    res.send("Kindly log in with your account details");
});

// Logout
router.get("/logout", login, (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).send("An unknown error occurred. Kindly try again.");
        res.send("Logout successful");
    });
});


/* EXPORT */
module.exports = router;