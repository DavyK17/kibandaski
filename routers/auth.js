/* IMPORTS */
// General
const router = require("express").Router();
const db = require("../db/index");
const pool = require("../db/pool");

// connect-ensure-login
const { loggedIn, loggedOut } = require("../middleware/authenticated");

/* PASSPORT.JS */
const passport = require("passport");

// Strategies
const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy({ usernameField: "email", passReqToCallback: true }, db.auth.loginLocal));

// Serialize and Deserealize
passport.serializeUser(async(user, done) => {
    try {
        let result = await pool.query("SELECT users.id AS id, users.email AS email, users.role AS role, carts.id AS cart_id FROM users JOIN carts ON carts.user_id = users.id WHERE users.id = $1", [user.id]);
        if (result.rows.length === 0) return done(null, false);

        return done(null, { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role, cartId: result.rows[0].cart_id });
    } catch (err) {
        return done(err);
    }
});
passport.deserializeUser((user, done) => done(null, user));

/* IMPLEMENTATION */
// Login required
router.all("/user", loggedIn, (req, res) => res.json(req.user));

router.get("/logout", db.auth.logout);

// Logout required
router.get("/register", loggedOut, (req, res) => res.send("Create a new account"));
router.post("/register", loggedOut, db.customer.users.createUser);

router.post("/login", (req, res, next) => {
    passport.authenticate(["local"], (err, user) => {
        if (err) return res.status(err.status).send(err.message);
        req.login(user, (err) => {
            if (err) res.status(500).send("An unknown error occurred. Kindly try again.");
            res.json(user);
        });
    })(req, res, next);
});
router.all("/login", (req, res) => res.send("Kindly log in with your account details"));

// Export
module.exports = router;