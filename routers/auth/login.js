/* CONFIGURATION */
const router = require("express").Router();
const passport = require("passport");

// Login function
const login = strategy => {
    return (req, res) => {
        passport.authenticate(strategy, (err, user) => {
            if (err) return res.status(err.status).send(err.message);
            req.login(user, (err) => {
                if (err) return res.status(500).send("An unknown error occurred. Kindly try again.");
                if (user.confirmDetails) return res.redirect("/register");

                if (strategy !== "local") return res.redirect("/cart");
                res.json(user);
            });
        })(req, res);
    }
}


/* IMPLEMENTATION */
// Local
router.post("/", login("local"));
router.all("/", (req, res) => res.send("Kindly log in with your account details"));

// Google
router.get("/google", passport.authenticate("google"));
router.get("/google/callback", login("google"));


/* EXPORT */
module.exports = router;