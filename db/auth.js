// IMPORTS
const bcrypt = require("bcrypt");
const pool = require("./pool");
const requestIP = require("request-ip");

const idGen = require("../util/idGen");
const { isEmail, trim, escape, normalizeEmail } = require("validator");
const sanitizeHtml = require("../util/sanitizeHtml");

// FUNCTIONS
const logout = (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).send("An unknown error occurred. Kindly try again.");
        res.send("Logout successful");
    });
}

const loginLocal = async(req, email, password, done) => {
    // Send error if already logged in
    if (req.user) return res.status(403).send("Error: You are already logged in.");

    // Get request IP address
    const ip = requestIP.getClientIp(req);

    // Generate login attempt ID and define function to log attempts
    const attemptId = idGen(15);
    const logAttempt = async(success) => {
        let text = `INSERT INTO login_attempts (id, ip, email, attempted_at, successful) VALUES ($1, $2, $3, to_timestamp(${Date.now()} / 1000), ${success})`;
        let values = [attemptId, ip, email];
        return await pool.query(text, values);
    }

    // Validate and sanitise email
    if (typeof email !== "string") return res.status(400).send("Error: Email must be a string.");
    email = sanitizeHtml(normalizeEmail(trim(escape(email)), { gmail_remove_dots: false }));
    if (!isEmail(email)) return res.status(400).send("Error: Invalid email provided.");

    try { // Get user details
        let result = await pool.query("SELECT users.id AS id, users.email AS email, users.password AS password, users.role AS role, carts.id AS cart_id FROM users JOIN carts ON carts.user_id = users.id WHERE email = $1", [email]);

        // Send null if user does not exist
        if (result.rows.length === 0) {
            await logAttempt(false);
            return done(null, false);
        };

        // Send null if password hashes do not match
        const passwordMatch = await bcrypt.compare(password, result.rows[0].password);
        if (!passwordMatch) {
            await logAttempt(false);
            return done(null, false);
        };

        // Add user to session
        await logAttempt(true);
        return done(null, { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role, cartId: result.rows[0].cart_id });
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

module.exports = { logout, loginLocal };