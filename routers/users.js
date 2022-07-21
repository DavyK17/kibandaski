const router = require("express").Router();
const db = require("../db/users");
const { ensureLoggedIn } = require("connect-ensure-login");

router.get("/", db.getUsers);
router.get("/:id", db.getUserById);
router.put("/:id", ensureLoggedIn("/login"), db.updateUser);
router.delete("/:id", ensureLoggedIn("/login"), db.deleteUser);

module.exports = router;