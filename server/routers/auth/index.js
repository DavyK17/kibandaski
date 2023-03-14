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

const FacebookStrategy = require("passport-facebook").Strategy;
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.NODE_ENV === "production" ? "https://kibandaski.up.railway.app" : "http://localhost:8000"}/api/auth/login/facebook/callback`,
    passReqToCallback: true,
    scope: ["email"],
    profileFields: ["id", "email", "first_name", "last_name"]
}, db.third.login));

// Serialize and Deserealize
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async(id, done) => {
    try {
        // Get user details
        let result = await pool.query("SELECT users.id AS id, users.email AS email, users.role AS role, carts.id AS cart_id FROM users JOIN carts ON carts.user_id = users.id WHERE users.id = $1", [id]);

        // Return false if details not found
        if (result.rows.length === 0) return done(null, false);

        // Create user object and third-party credentials array
        let data = { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role, cartId: result.rows[0].cart_id };
        let federatedCredentials = [];

        // Get all third-party credentials
        result = await pool.query("SELECT id, provider, confirmed FROM federated_credentials WHERE user_id = $1", [id]);

        // Add each credential to array if present
        if (result.rows.length > 0) result.rows.forEach(({ id, provider, confirmed }) => federatedCredentials.push({ id, provider, confirm: !confirmed }));

        // Return user object
        return done(null, {...data, federatedCredentials });
    } catch (err) {
        return done(err);
    }
});


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