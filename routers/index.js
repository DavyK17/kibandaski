const router = require("express").Router();
const loggedIn = require("connect-ensure-login").ensureLoggedIn("/api/auth/login");

// Authentication
const authRouter = require("./auth");
router.use("/auth", authRouter);

// Admin
const adminRouter = require("./admin");
router.use("/admin", loggedIn, (req, res, next) => {
    // Send error if user is not an admin
    if (req.user.role !== "admin") return res.status(403).send("Error: You are not authorised to carry out this operation.");
    next();
}, adminRouter);

// Customer
const customerRouter = require("./customer");
router.use("/customer", customerRouter);

// API documentation
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("../openapi.json");
router.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Export
module.exports = router;