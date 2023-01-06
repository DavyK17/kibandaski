const router = require("express").Router();
const db = require("../../db/index").admin.users;

router.get("/", db.getUsers);
router.get("/:role", db.getUsersByRole);

module.exports = router;