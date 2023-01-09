const router = require("express").Router();
const loggedIn = require("connect-ensure-login").ensureLoggedIn("/api/auth/login");

// No login
const productsRouter = require("./customer/products");
router.use("/products", productsRouter);

// Login required
const accountRouter = require("./customer/account");
router.use("/account", loggedIn, accountRouter);

const cartRouter = require("./customer/cart");
router.use("/cart", loggedIn, cartRouter);

const ordersRouter = require("./customer/orders");
router.use("/orders", loggedIn, ordersRouter);

// Export
module.exports = router;