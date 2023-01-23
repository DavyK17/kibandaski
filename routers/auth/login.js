/* CONFIGURATION */
const router = require("express").Router();
const passport = require("passport");
const { callback } = require("../../db/auth/third");

/* IMPLEMENTATION */
// Local
router.post("/", callback("local"));
router.all("/", (req, res) => res.send("Kindly log in with your account details"));

// Google
router.get("/google", passport.authenticate("google"));
router.get("/google/callback", callback("google"));


/* EXPORT */
module.exports = router;