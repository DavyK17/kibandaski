/* IMPORTS */
// General
const router = require("express").Router();
const db = require("../../db/index").auth;
const pool = require("../../db/pool");

// Authentication middleware
const { loggedIn } = require("../../middleware/authenticated");


/* PASSPORT.JS */
const passport = require("passport");

// Strategies
const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy({ usernameField: "email", passReqToCallback: true }, db.local.login));

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.NODE_ENV === "production" ? "https://kibandaski.up.railway.app" : "http://localhost:8000"}/api/auth/login/google/callback`,
    passReqToCallback: true,
    scope: ["email", "profile"]
}, db.third.login));

// Serialize and Deserealize
passport.serializeUser(async(user, done) => {
    try {
        let result = await pool.query("SELECT users.id AS id, users.email AS email, users.role AS role, carts.id AS cart_id FROM users JOIN carts ON carts.user_id = users.id WHERE users.id = $1", [user.id]);
        if (result.rows.length === 0) return done(null, false);

        let data = { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role, cartId: result.rows[0].cart_id };
        if (user.federatedCredentials) data.federatedCredentials = user.federatedCredentials;

        return done(null, data);
    } catch (err) {
        return done(err);
    }
});
passport.deserializeUser((user, done) => done(null, user));


/* IMPLEMENTATION */
router.get("/logout", db.local.logout);
router.all("/user", loggedIn, (req, res) => res.json(req.user));

// Login router
const loginRouter = require("./login");
router.use("/login", loginRouter);

// Register router
const registerRouter = require("./register");
router.use("/register", registerRouter);


/* EXPORT */
module.exports = router;