const router = require("express").Router();
const db = require("../db/users");

// User account
router.get("/", (req, res) => res.json(req.user));
router.put("/", db.updateUser);
router.delete("/", db.deleteUser);

module.exports = router;