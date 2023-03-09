const router = require("express").Router();
const db = require("../../db/index").customer.products;

router.get("/categories", db.getCategories);

router.get("/", db.getProducts);
router.get("/:category", db.getProductsByCategory);

module.exports = router;