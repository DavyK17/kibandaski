const router = require("express").Router();
const db = require("../db/orders");

router.get("/", db.getOrders);
router.get("/:id", db.getOrderById);

module.exports = router;