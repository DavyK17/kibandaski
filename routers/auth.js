/* IMPORTS */
const router = require("express").Router();
const db = require("../db/index");
const jwtVerify = require("../middleware/jwtVerify");

/* ROUTES */
// Current user
router.all("/user", jwtVerify, (req, res) => res.json(req.user));

// Registration
router.get("/register", (req, res) => {
    res.send("Create a new account");
});
router.post("/register", db.customer.users.createUser);

// Login
router.post("/login", db.auth.login);
router.all("/login", (req, res) => {
    res.send("Kindly log in with your account details");
});

// Logout
router.get("/logout", jwtVerify, db.auth.logout);


/* EXPORT */
module.exports = router;