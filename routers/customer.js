const router = require("express").Router();
const login = require("connect-ensure-login").ensureLoggedIn("/login");

// No login
const productsRouter = require("./customer/products");
router.use("/products", productsRouter);

// Login required
const accountRouter = require("./customer/account");
router.use("/account", login, accountRouter);

const cartRouter = require("./customer/cart");
router.use("/cart", login, cartRouter);

const ordersRouter = require("./customer/orders");
router.use("/orders", login, ordersRouter);

// Export
module.exports = router;