const router = require("express").Router();
const db = require("../../db/index").customer.orders;

router.get("/", db.getOrders);
router.get("/:id", db.getOrderById);
router.delete("/:id", db.cancelOrder);

module.exports = router;