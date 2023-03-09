const router = require("express").Router();
const db = require("../../db/index").customer.orders;

router.get("/", db.getOrders);
router.get("/cancel", db.cancelOrder);

module.exports = router;