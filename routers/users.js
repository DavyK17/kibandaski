const express = require("express");
const db = require("../db/users");
const router = express.Router();

router.get("/", db.getUsers);
router.get("/:id", db.getUserById);
router.put("/:id", db.updateUser);

module.exports = router;