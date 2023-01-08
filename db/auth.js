// IMPORTS
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./pool");
const requestIP = require("request-ip");

const idGen = require("../util/idGen");
const { isEmail, trim, escape, normalizeEmail } = require("validator");
const sanitizeHtml = require("../util/sanitizeHtml");

// FUNCTIONS
const login = async(req, res) => {
    // Send error if already logged in
    if (req.cookies.token) return res.status(403).send("Error: You are already logged in.");

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
    let { email, password } = req.body;

    if (typeof email !== "string") return res.status(400).send("Error: Email must be a string.");
    email = sanitizeHtml(normalizeEmail(trim(escape(email)), { gmail_remove_dots: false }));
    if (!isEmail(email)) return res.status(400).send("Error: Invalid email provided.");

    try { // Get user details
        let result = await pool.query("SELECT users.id AS id, users.email AS email, users.password AS password, users.role AS role, carts.id AS cart_id FROM users JOIN carts ON carts.user_id = users.id WHERE email = $1", [email]);

        // Send error if user does not exist
        if (result.rows.length === 0) {
            await logAttempt(false);
            return res.status(400).send("Error: Incorrect email or password provided.")
        };

        // Send error if password hashes do not match
        const passwordMatch = await bcrypt.compare(password, result.rows[0].password);
        if (!passwordMatch) {
            await logAttempt(false);
            return res.status(400).send("Error: Incorrect email or password provided.")
        };

        // Create user object
        let user = { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role, cartId: result.rows[0].cart_id };

        // Create JSON web token
        let expiresIn = 172800;
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn });

        // Add token to cookie
        res.cookie("token", token, { maxAge: expiresIn * 1000 });

        // Log successful login and confirm
        await logAttempt(true);
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const logout = (req, res) => {
    try {
        req.user = null;
        res.cookie("token", "", { maxAge: 0 });
        res.status(200).send("Logout successful");
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

module.exports = { login, logout };