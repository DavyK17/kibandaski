const router = require("express").Router();
const db = require("../db/users");
const { ensureLoggedIn } = require("connect-ensure-login");

router.get("/", db.getUsers);
router.get("/:id", db.getUserById);

module.exports = router;