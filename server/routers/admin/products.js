const router = require("express").Router();
const db = require("../../db/index").admin.products;

router.post("/", db.createProduct);
router.put("/", db.updateProduct);
router.delete("/", db.deleteProduct);

module.exports = router;