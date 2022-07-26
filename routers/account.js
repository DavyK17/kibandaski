const router = require("express").Router();
const db = require("../db/users");
const { ensureLoggedIn } = require("connect-ensure-login");

// User account
router.get("/", ensureLoggedIn("/login"), (req, res) => res.json(req.user));
router.put("/", ensureLoggedIn("/login"), db.updateUser);
router.delete("/", ensureLoggedIn("/login"), db.deleteUser);

module.exports = router;