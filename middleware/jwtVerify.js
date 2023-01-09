const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtVerify = (req, res, next) => {
    // Send error if no Authorization header
    if (!req.headers.authorization) return res.status(401).send("Error: You are not authorised to perform this operation.");

    // Get token from Authorization header
    const token = req.headers.authorization.split(" ")[1];
    let payload;

    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            // Send error if JWT is unauthorized
            return res.status(401).send("Error: You are not authorised to perform this operation.");
        }
        // Otherwise, send bad request error
        return res.status(400).send("Error: Invalid token in session.")
    }

    req.user = { id: payload.id, email: payload.email, role: payload.role, cartId: payload.cartId };
    next();
}

module.exports = jwtVerify;