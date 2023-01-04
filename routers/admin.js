const router = require("express").Router();
const db = require("../db/index").admin;

// Login attempts
router.get("/logins", db.loginAttempts);

// Users
router.get("/users", db.users);

// Routers
const ordersRouter = require("./admin/orders");
router.use("/orders", ordersRouter);

const productsRouter = require("./admin/products");
router.use("/products", productsRouter);

// Export
module.exports = router;