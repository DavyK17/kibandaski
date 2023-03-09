const router = require("express").Router();
const { loggedIn } = require("../../middleware/authenticated");

// No login
const productsRouter = require("./products");
router.use("/products", productsRouter);

// Login required
const accountRouter = require("./account");
router.use("/account", loggedIn, accountRouter);

const cartRouter = require("./cart");
router.use("/cart", loggedIn, cartRouter);

const ordersRouter = require("./orders");
router.use("/orders", loggedIn, ordersRouter);

// Export
module.exports = router;