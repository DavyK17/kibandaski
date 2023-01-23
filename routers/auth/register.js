const router = require("express").Router();
const db = require("../../db/index").auth.local;
const { loggedIn, loggedOut } = require("../../middleware/authenticated");

router.get("/", loggedOut, (req, res) => res.send("Create a new account"));
router.post("/", loggedOut, db.register);

router.get("/confirm-federated", loggedIn, (req, res) => res.redirect("/api/auth/register"));
router.put("/confirm-federated", loggedIn, db.confirmFederatedDetails);

module.exports = router;