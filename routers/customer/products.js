const router = require("express").Router();
const db = require("../../db/index").customer.products;

router.get("/", db.getProducts);
router.get("/:id", db.getProductById);

module.exports = router;