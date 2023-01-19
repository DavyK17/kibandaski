const router = require("express").Router();
const db = require("../../db/index").customer.cart;

router.get("/", db.getCart);
router.post("/", db.addToCart);
router.delete("/", db.emptyCart);

router.post("/checkout", db.beginCheckout, db.getPaymentToken, db.completeCheckout);

router.put("/item", db.updateCartItem);
router.delete("/item", db.removeCartItem);

module.exports = router;