const router = require("express").Router();
const loggedIn = require("connect-ensure-login").ensureLoggedIn("/auth/login");

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

// Export
module.exports = router;