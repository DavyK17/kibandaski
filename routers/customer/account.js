const router = require("express").Router();
const db = require("../../db/index").customer.users;

router.get("/", db.getUser);
router.put("/", db.updateUser);
router.delete("/", db.deleteUser);

router.delete("/unlink", db.unlinkThirdParty);

module.exports = router;