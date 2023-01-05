const router = require("express").Router();
const db = require("../../db/index").customer.cart;

router.get("/", db.getCart);
router.post("/", db.addToCart);
router.delete("/", db.emptyCart);

router.get("/checkout", db.checkout);

module.exports = router;