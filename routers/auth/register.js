const router = require("express").Router();
const db = require("../../db/index").auth;

router.get("/", (req, res) => res.send("Create a new account"));
router.post("/", db.register);

router.get("/confirm-federated", (req, res) => res.redirect("/api/auth/register"));
router.put("/confirm-federated", db.confirmFederatedDetails);

module.exports = router;