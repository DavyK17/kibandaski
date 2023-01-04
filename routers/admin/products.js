const router = require("express").Router();
const db = require("../../db/index").admin.products;

router.post("/", db.createProduct);
router.put("/:id", db.updateProduct);
router.delete("/:id", db.deleteProduct);

module.exports = router;