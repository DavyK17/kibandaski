// IMPORTS
const bcrypt = require("bcrypt");
const pool = require("../pool");
const requestIP = require("request-ip");

const checkPhone = require("../../util/checkPhone");
const idGen = require("../../util/idGen");
const loginAttempt = require("../../util/loginAttempt");
const { isEmail, isNumeric, isLength, trim, escape, normalizeEmail } = require("validator");
const sanitizeHtml = require("../../util/sanitizeHtml");

// FUNCTIONS
const register = async(req, res) => {
    // Generate user ID and cart ID
    const userId = idGen(7);
    const cartId = idGen(7);

    // VALIDATION AND SANITISATION
    let { firstName, lastName, phone, email, password } = req.body;

    // First name
    if (typeof firstName !== "string") return res.status(400).send("Error: First name must be a string.");
    firstName = sanitizeHtml(trim(escape(firstName)));

    // Last name
    if (typeof lastName !== "string") return res.status(400).send("Error: Last name must be a string.");
    lastName = sanitizeHtml(trim(escape(lastName)));

    // Phone number
    if (typeof phone !== "number" && typeof phone !== "string") return res.status(400).send(`Error: Phone number must be a number.`);
    phone = sanitizeHtml(trim(typeof phone === "number" ? phone.toString() : phone));
    if (!isNumeric(phone, { no_symbols: true })) return res.status(400).send("Error: Phone must contain numbers only.");
    if (!isLength(phone, { min: 12, max: 12 })) return res.status(400).send("Error: Invalid phone number provided (must be 254XXXXXXXXX).");
    if (!checkPhone("general", phone)) return res.status(400).send("Error: Phone must be Kenyan (starts with \"254\").");

    // Email
    if (typeof email !== "string") return res.status(400).send("Error: Email must be a string.");
    email = sanitizeHtml(normalizeEmail(trim(escape(email)), { gmail_remove_dots: false }));
    if (!isEmail(email)) return res.status(400).send("Error: Invalid email provided.");

    // Password
    const salt = await bcrypt.genSalt(17);
    const passwordHash = await bcrypt.hash(trim(password), salt);

    try {
        // Send error if email already exists in database
        let result = await pool.query("SELECT email FROM users WHERE email = $1", [email]);
        if (result.rows.length > 0) return res.status(409).send("Error: A user with the provided email already exists.");

        // Add user to database
        let text = `INSERT INTO users (id, first_name, last_name, phone, email, password, created_at) VALUES ($1, $2, $3, $4, $5, $6, to_timestamp(${Date.now()} / 1000)) RETURNING id`;
        let values = [userId, firstName, lastName, phone, email, passwordHash];
        result = await pool.query(text, values);
        res.status(201).send(`User created with ID: ${result.rows[0].id}`);

        // Add user cart to database
        result = await pool.query("INSERT INTO carts (id, user_id) VALUES ($1, $2)", [cartId, userId]);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const confirmFederatedDetails = async(req, res) => {
    // Send error if user is not authorised
    const { id, provider, confirm } = req.user.federatedCredentials;
    if (!id || !provider || !confirm) return res.status(401).send("Error: You are not authorised to perform this operation.");

    // VALIDATION AND SANITISATION
    let { phone, password } = req.body;

    // Phone number
    if (typeof phone !== "number" && typeof phone !== "string") return res.status(400).send(`Error: Phone number must be a number.`);
    phone = sanitizeHtml(trim(typeof phone === "number" ? phone.toString() : phone));
    if (!isNumeric(phone, { no_symbols: true })) return res.status(400).send("Error: Phone must contain numbers only.");
    if (!isLength(phone, { min: 12, max: 12 })) return res.status(400).send("Error: Invalid phone number provided (must be 254XXXXXXXXX).");
    if (!checkPhone("general", phone)) return res.status(400).send("Error: Phone must be Kenyan (starts with \"254\").");

    // Password
    const salt = await bcrypt.genSalt(17);
    const passwordHash = await bcrypt.hash(trim(password), salt);

    // User ID
    let userId = trim(req.user.id);
    if (!isNumeric(userId, { no_symbols: true }) || !isLength(userId, { min: 7, max: 7 })) return res.status(401).send("Error: Invalid user ID in session.");

    try { // Update user details
        let result = await pool.query("UPDATE users SET phone = $1, password = $2 WHERE id = $3 RETURNING id", [phone, passwordHash, userId]);

        // Confirm update
        if (result.rows[0].id === userId) {
            // Update federated details confirmation status
            result = await pool.query("UPDATE federated_credentials SET confirmed = $1 WHERE provider = $2 AND user_id = $3", [true, provider, userId]);

            // Get updated user details
            result = await pool.query("SELECT users.id AS id, users.email AS email, users.role AS role, carts.id AS cart_id FROM users JOIN carts ON carts.user_id = users.id WHERE email = $1", [req.user.email]);

            // Add user to session
            req.user = { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role, cartId: result.rows[0].cart_id };

            // Return user object
            res.json(req.user);
        }
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const logout = (req, res) => {
    // Send error if already logged out
    if (!req.user) return res.status(403).send("Error: You are already logged out.");

    // Log out
    req.logout(err => {
        if (err) return res.status(500).send("An unknown error occurred. Kindly try again.");
        res.send("Logout successful");
    });
}

const login = async(req, email, password, done) => {
    // Send error if already logged in
    if (req.user) return done({ status: 403, message: "Error: You are already logged in." });

    // Get request IP address
    const ip = requestIP.getClientIp(req);

    // Generate login attempt ID
    const attemptId = idGen(15);

    // Validate and sanitise email
    if (!email) return done({ status: 400, message: "Error: No email provided." });
    if (typeof email !== "string") return done({ status: 400, message: "Error: Email must be a string." });
    email = sanitizeHtml(normalizeEmail(trim(escape(email)), { gmail_remove_dots: false }));
    if (!isEmail(email)) return done({ status: 400, message: "Error: Invalid email provided." });

    // Validate password
    if (!password) return done({ status: 400, message: "Error: No password provided." });

    try { // Get user details
        let result = await pool.query("SELECT users.id AS id, users.email AS email, users.password AS password, users.role AS role, carts.id AS cart_id FROM users JOIN carts ON carts.user_id = users.id WHERE email = $1", [email]);

        // Send error if user does not exist
        if (result.rows.length === 0) {
            await loginAttempt(attemptId, ip, email, "local", false);
            return done({ status: 401, message: "Error: Incorrect email or password provided." });
        }

        // Send null if password hashes do not match
        const passwordMatch = await bcrypt.compare(password, result.rows[0].password);
        if (!passwordMatch) {
            await loginAttempt(attemptId, ip, email, "local", false);
            return done({ status: 401, message: "Error: Incorrect email or password provided." });
        }

        // Add user to session
        await loginAttempt(attemptId, ip, email, "local", true);
        return done(null, { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role, cartId: result.rows[0].cart_id, federatedCredentials: [] });
    } catch (err) {
        return done({ status: 500, message: "An unknown error occurred. Kindly try again." });
    }
}

module.exports = { register, confirmFederatedDetails, logout, login };