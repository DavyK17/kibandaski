const router = require("express").Router();
const db = require("../../db/index").auth.local;
const { loggedIn, loggedOut } = require("../../middleware/authenticated");

router.get("/", loggedOut, (req, res) => res.send("Create a new account"));
router.post("/", loggedOut, db.register);

router.get("/ctpr", loggedIn, (req, res) => res.redirect("/api/auth/register"));
router.put("/ctpr", loggedIn, db.confirmThirdPartyRegistration);

module.exports = router;