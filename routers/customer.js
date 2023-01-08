const router = require("express").Router();
const jwtVerify = require("../middleware/jwtVerify");

// No login
const productsRouter = require("./customer/products");
router.use("/products", productsRouter);

// Login required
const accountRouter = require("./customer/account");
router.use("/account", jwtVerify, accountRouter);

const cartRouter = require("./customer/cart");
router.use("/cart", jwtVerify, cartRouter);

const ordersRouter = require("./customer/orders");
router.use("/orders", jwtVerify, ordersRouter);

// Export
module.exports = router;