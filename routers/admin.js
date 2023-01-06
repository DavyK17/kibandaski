const router = require("express").Router();

// Routers
const ordersRouter = require("./admin/orders");
router.use("/orders", ordersRouter);

const productsRouter = require("./admin/products");
router.use("/products", productsRouter);

const usersRouter = require("./admin/users");
router.use("/users", usersRouter);

// Export
module.exports = router;