const router = require("express").Router();

// Routers
const ordersRouter = require("./orders");
router.use("/orders", ordersRouter);

const productsRouter = require("./products");
router.use("/products", productsRouter);

const usersRouter = require("./users");
router.use("/users", usersRouter);

// Export
module.exports = router;