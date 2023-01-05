// IMPORTS
const bcrypt = require("bcrypt");
const pool = require("../pool");
const idGen = require("../../util/idGen");
const { isEmail, isNumeric, isLength, trim, escape, normalizeEmail } = require("validator");
const sanitizeHtml = require("../../util/sanitizeHtml");

// KENYAN PHONE NUMBER VALIDATOR
const checkPhone = value => {
    if (value.match(/^254\d{9}$/)) return true;
    return false;
};

// FUNCTIONS
const getUser = async(req, res) => {
    try { // Validate and sanitise user ID
        let id = trim(req.user.id);
        if (!isNumeric(id, { no_symbols: true }) || !isLength(id, { min: 7, max: 7 })) return res.status(400).send("Error: Invalid user ID in session.");

        // Get user
        let result = await pool.query("SELECT id, first_name, last_name, phone, email FROM users WHERE id = $1", [id]);

        // Create and send user object
        res.status(200).json({
            id: result.rows[0].id,
            firstName: result.rows[0].first_name,
            lastName: result.rows[0].last_name,
            phone: parseInt(result.rows[0].phone),
            email: result.rows[0].email
        });
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const createUser = async(req, res) => {
    // Generate user ID and cart ID
    const userId = idGen(7);
    const cartId = idGen(7);

    // VALIDATION AND SANITISATION
    let { firstName, lastName, phone, email, password } = req.body;

    // First name
    if (typeof firstName !== "string") return res.status(403).send("Error: First name must be a string.");
    firstName = sanitizeHtml(trim(escape(firstName)));

    // Last name
    if (typeof lastName !== "string") return res.status(403).send("Error: Last name must be a string.");
    lastName = sanitizeHtml(trim(escape(lastName)));

    // Phone number
    if (typeof phone !== "number" && typeof phone !== "string") return res.status(403).send(`Error: Phone number must be a number.`);
    phone = trim(typeof phone === "number" ? phone.toString() : phone);
    if (!checkPhone(phone)) return res.status(403).send(`Error: Phone number must be Kenyan (starts with "254").`);

    // Email
    if (typeof email !== "string") return res.status(403).send("Error: Email must be a string.");
    email = sanitizeHtml(normalizeEmail(trim(escape(email)), { gmail_remove_dots: false }));
    if (!isEmail(email)) return res.status(400).send("Error: Invalid email");

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
        result = await pool.query("INSERT INTO carts (id, user_id) VALUES ($1, $2) RETURNING id", [cartId, userId]);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const updateUser = async(req, res) => {
    // User ID
    let userId = trim(req.user.id);
    if (!isNumeric(userId, { no_symbols: true }) || !isLength(userId, { min: 7, max: 7 })) return res.status(400).send("Error: Invalid user ID in session.");

    try { // Retrieve existing details from database if not provided in body
        let result = await pool.query("SELECT first_name, last_name, phone, email, password FROM users WHERE id = $1", [userId]);

        // VALIDATION AND SANITISATION
        // First name
        const firstName = req.body.firstName || result.rows[0].first_name;
        if (typeof firstName !== "string") return res.status(403).send("Error: First name must be a string.");
        firstName = sanitizeHtml(trim(escape(firstName)));

        // Last name
        const lastName = req.body.lastName || result.rows[0].last_name;
        if (lastName && typeof lastName !== "string") return res.status(403).send("Error: Last name must be a string.");
        lastName = sanitizeHtml(trim(escape(lastName)));

        // Phone number
        const phone = req.body.phone || result.rows[0].phone;
        if (typeof phone !== "number" && typeof phone !== "string") return res.status(403).send(`Error: Phone number must be a number.`);
        phone = trim(typeof phone === "number" ? phone.toString() : phone);
        if (!checkPhone(phone)) return res.status(403).send(`Error: Phone number must be Kenyan (starts with "254").`);

        // Email
        const email = req.body.email || result.rows[0].email;
        if (typeof email !== "string") return res.status(403).send("Error: Email must be a string.");
        email = sanitizeHtml(normalizeEmail(trim(escape(email)), { gmail_remove_dots: false }));

        // Password
        const salt = await bcrypt.genSalt(17);
        passwordHash = req.body.password ? await bcrypt.hash(trim(req.body.password), salt) : result.rows[0].password;

        // UPDATE USER DETAILS
        let text = "UPDATE users SET first_name = $1, last_name = $2, phone = $3, email = $4, password = $5 WHERE id = $6 RETURNING id";
        let values = [firstName, lastName, phone, email, passwordHash, userId];
        result = await pool.query(text, values);

        // Send confirmation of update
        if (result.rows[0].id === userId) res.status(200).send("Account updated successfully");
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const deleteUser = async(req, res) => {
    // VALIDATION AND SANITISATION
    // User ID
    let userId = trim(req.user.id);
    if (!isNumeric(userId, { no_symbols: true }) || !isLength(userId, { min: 7, max: 7 })) return res.status(400).send("Error: Invalid user ID in session.");

    // Cart ID
    let cartId = trim(req.user.cartId);
    if (!isNumeric(cartId, { no_symbols: true }) || !isLength(cartId, { min: 7, max: 7 })) return res.status(400).send("Error: Invalid cart ID in session.");

    try {
        // Delete orders
        let orders = [];
        let result = await pool.query("SELECT id FROM orders WHERE user_id = $1", [userId]);
        result.rows.forEach(row => orders.push(row.id));

        orders.forEach(async(id) => {
            result = await pool.query("DELETE FROM order_items WHERE order_id = $1", [id]);
            result = await pool.query("DELETE FROM orders WHERE id = $1", [id]);
        });

        // Delete cart
        result = await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
        result = await pool.query("DELETE FROM carts WHERE id = $1", [cartId]);

        // Delete user
        result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [userId]);
        if (result.rows[0].id === userId) res.status(204).send("Account deleted successfully");
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

module.exports = { getUser, createUser, updateUser, deleteUser };