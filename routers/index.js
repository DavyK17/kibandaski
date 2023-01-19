const router = require("express").Router();
const { loggedIn } = require("../middleware/authenticated");

// Authentication
const authRouter = require("./auth");
router.use("/auth", authRouter);

// Admin
const adminRouter = require("./admin");
router.use("/admin", loggedIn, (req, res, next) => {
    // Send error if user is not an admin
    if (req.user.role !== "admin") return res.status(401).send("Error: You are not authorised to carry out this operation.");
    next();
}, adminRouter);

// Customer
const customerRouter = require("./customer");
router.use("/customer", customerRouter);

// M-Pesa payment callback route
router.get("/payment/mpesa-callback", loggedIn, (req, res) => {
    let result = req.body.Body.stkCallback.ResultDesc;
    res.status(200).send(result);
});

// API documentation
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("../openapi.json");
router.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Export
module.exports = router;