const router = require("express").Router();
const db = require("../../db/index").admin.users;

router.get("/", db.getUsers);
router.get("/:id", db.getUserById);

module.exports = router;