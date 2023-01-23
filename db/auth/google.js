// IMPORTS
const bcrypt = require("bcrypt");
const pool = require("../pool");
const requestIP = require("request-ip");

const idGen = require("../../util/idGen");
const loginAttempt = require("../../util/loginAttempt");

// FUNCTIONS
const login = async(req, accessToken, refreshToken, profile, done) => {
    // Get request IP address
    const ip = requestIP.getClientIp(req);

    // Generate login attempt ID
    const attemptId = idGen(15);

    try { // Get Google credentials
        let result = await pool.query("SELECT * FROM federated_credentials WHERE id = $1 AND provider = $2", [profile.id, profile.provider]);

        // Create user account if credentials don't exist
        if (result.rows.length === 0) {
            // Send error if email already exists in database
            result = await pool.query("SELECT email FROM users WHERE email = $1", [profile.emails[0].value]);
            if (result.rows.length > 0) return res.status(409).send("Error: A user with the provided email already exists.");

            // Generate user ID and cart ID
            const userId = idGen(7);
            const cartId = idGen(7);

            // Generate password hash
            const salt = await bcrypt.genSalt(17);
            const passwordHash = await bcrypt.hash(process.env.GENERIC_PASSWORD, salt);

            // Add user to database
            let text = `INSERT INTO users (id, first_name, last_name, phone, email, password, created_at) VALUES ($1, $2, $3, $4, $5, $6, to_timestamp(${Date.now()} / 1000)) RETURNING id`;
            let values = [userId, profile.name.givenName, profile.name.familyName, "254700000000", profile.emails[0].value, passwordHash];
            result = await pool.query(text, values);

            // Add user cart to database
            result = await pool.query("INSERT INTO carts (id, user_id) VALUES ($1, $2)", [cartId, userId]);

            // Add Google credentials to database
            result = await pool.query("INSERT INTO federated_credentials (id, provider, user_id) VALUES ($1, $2, $3)", [profile.id, profile.provider, userId]);

            // Add user details to be confirmed to session
            return done(null, { id: userId, email: profile.emails[0].value, role: "customer", cartId: cartId, confirmDetails: true, provider: profile.provider });
        }

        // Save details confirmation status
        const confirmed = result.rows[0].confirmed;
        const provider = result.rows[0].provider;

        // Get user details
        result = await pool.query("SELECT users.id AS id, users.email AS email, users.password AS password, users.role AS role, carts.id AS cart_id FROM users JOIN carts ON carts.user_id = users.id WHERE email = $1", [profile.emails[0].value]);

        // Log login attempt
        await loginAttempt(attemptId, ip, profile.emails[0].value, "google", true);

        // Add user details to be confirmed to session if not confirmed
        if (!confirmed) {
            const { id, email, role, cart_id } = result.rows[0];
            return done(null, { id, email, role, cartId: cart_id, confirmDetails: true, provider });
        }

        // Add user to session
        return done(null, { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role, cartId: result.rows[0].cart_id });
    } catch (err) {
        return done({ status: 500, message: "An unknown error occurred. Kindly try again." });
    }
}

module.exports = { login };