const router = require("express").Router();
const db = require("../../db/index").admin.orders;

router.get("/", db.getOrders);
router.get("/:userId", db.getOrdersByUser);
router.get("/:orderId", db.getOrderById);
router.get("/fulfill/:orderId", db.fulfillOrder);

module.exports = router;