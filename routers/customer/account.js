const router = require("express").Router();
const db = require("../../db/index").customer.users;

router.get("/", (req, res) => res.json(req.user));
router.put("/", db.updateUser);
router.delete("/", db.deleteUser);

module.exports = router;