const router = require("express").Router();
const db = require("../../db/index").admin.orders;

router.get("/", db.getOrders);
router.get("/:userId", db.getOrdersByUser);
router.get("/acknowledge", db.acknowledgeOrder);
router.get("/fulfill", db.fulfillOrder);

module.exports = router;