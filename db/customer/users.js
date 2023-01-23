// IMPORTS
const bcrypt = require("bcrypt");
const pool = require("../pool");

const checkPhone = require("../../util/checkPhone");
const { isEmail, isNumeric, isLength, trim, escape, normalizeEmail } = require("validator");
const sanitizeHtml = require("../../util/sanitizeHtml");

// FUNCTIONS
const getUser = async(req, res) => {
    try { // Validate and sanitise user ID
        let id = trim(req.user.id);
        if (!isNumeric(id, { no_symbols: true }) || !isLength(id, { min: 7, max: 7 })) return res.status(401).send("Error: Invalid user ID in session.");

        // Get user
        let result = await pool.query("SELECT id, first_name, last_name, phone, email FROM users WHERE id = $1", [id]);
        let user = {
            id: result.rows[0].id,
            firstName: result.rows[0].first_name,
            lastName: result.rows[0].last_name,
            phone: parseInt(result.rows[0].phone),
            email: result.rows[0].email
        };

        // Get third-party credentials
        result = await pool.query("SELECT id, provider FROM federated_credentials WHERE user_id = $1", [id]);
        let federatedCredentials = result.rows;

        // Send user
        res.status(200).json({...user, federatedCredentials });
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const updateUser = async(req, res) => {
    // Validate and sanitise user ID
    let userId = trim(req.user.id);
    if (!isNumeric(userId, { no_symbols: true }) || !isLength(userId, { min: 7, max: 7 })) return res.status(401).send("Error: Invalid user ID in session.");

    try { // Retrieve existing details from database if not provided in body
        let result = await pool.query("SELECT first_name, last_name, phone, email, password FROM users WHERE id = $1", [userId]);
        let old = {
            firstName: result.rows[0].first_name,
            lastName: result.rows[0].last_name,
            phone: result.rows[0].phone,
            email: result.rows[0].email,
            password: result.rows[0].password
        };

        // VALIDATION AND SANITISATION
        let { firstName, lastName, phone, email, currentPassword, newPassword } = req.body;

        // Send error if no details are provided
        if (!firstName && !lastName && !phone && !email && !currentPassword && !newPassword) return res.status(400).send("Error: No updates provided.");

        // First name
        firstName = firstName || old.firstName;
        if (typeof firstName !== "string") return res.status(400).send("Error: First name must be a string.");
        firstName = sanitizeHtml(trim(escape(firstName)));

        // Last name
        lastName = lastName || old.lastName;
        if (typeof lastName !== "string") return res.status(400).send("Error: Last name must be a string.");
        lastName = sanitizeHtml(trim(escape(lastName)));

        // Phone number
        phone = phone || old.phone;
        if (typeof phone !== "number" && typeof phone !== "string") return res.status(400).send("Error: Phone must be a number.");
        phone = sanitizeHtml(trim(typeof phone === "number" ? phone.toString() : phone));
        if (!isNumeric(phone, { no_symbols: true })) return res.status(400).send("Error: Phone must contain numbers only.");
        if (!isLength(phone, { min: 12, max: 12 })) return res.status(400).send("Error: Invalid phone number provided (must be 254XXXXXXXXX).");
        if (!checkPhone("general", phone)) return res.status(400).send("Error: Phone must be Kenyan (starts with \"254\").");

        // Email
        email = email || old.email;
        if (typeof email !== "string") return res.status(400).send("Error: Email must be a string.");
        email = sanitizeHtml(normalizeEmail(trim(escape(email)), { gmail_remove_dots: false }));
        if (!isEmail(email)) return res.status(400).send("Error: Invalid email provided.");

        // Do the following if current password provided
        if (currentPassword) {
            // Send error if new password not provided
            if (!newPassword) return res.status(400).send("Error: No new password provided.");

            // Do the following if new password provided
            if (newPassword) {
                // Send error if current password is incorrect
                const currentPasswordMatch = await bcrypt.compare(trim(currentPassword), old.password);
                if (!currentPasswordMatch) return res.status(401).send("Error: Incorrect password provided.");

                // Send error if no updates made
                const newPasswordMatch = await bcrypt.compare(newPassword, old.password);
                if (old.firstName === firstName && old.lastName === lastName && old.phone === phone && old.email === email && newPasswordMatch)
                    return res.status(400).send("Error: No updates provided.");
            }
        }

        // Hash new password if present
        const salt = await bcrypt.genSalt(17);
        const passwordHash = newPassword ? await bcrypt.hash(trim(newPassword), salt) : old.password;

        // UPDATE USER DETAILS
        let text = "UPDATE users SET first_name = $1, last_name = $2, phone = $3, email = $4, password = $5 WHERE id = $6 RETURNING id";
        let values = [firstName, lastName, phone, email, passwordHash, userId];
        result = await pool.query(text, values);

        // Confirm update
        if (result.rows[0].id === userId) {
            req.user.email = email;
            res.status(200).send("Account updated successfully");
        }
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const deleteUser = async(req, res) => {
    // VALIDATION AND SANITISATION
    // User ID
    let userId = trim(req.user.id);
    if (!isNumeric(userId, { no_symbols: true }) || !isLength(userId, { min: 7, max: 7 })) return res.status(401).send("Error: Invalid user ID in session.");

    // Cart ID
    let cartId = trim(req.user.cartId);
    if (!isNumeric(cartId, { no_symbols: true }) || !isLength(cartId, { min: 7, max: 7 })) return res.status(401).send("Error: Invalid cart ID in session.");

    try { // DELETE USER
        // Create orders array
        let orders = [];

        // Add each order by user to orders array
        let result = await pool.query("SELECT id FROM orders WHERE user_id = $1", [userId]);
        result.rows.forEach(row => orders.push(row.id));

        // Delete each order and its items in orders array
        orders.forEach(async(id) => {
            result = await pool.query("DELETE FROM order_items WHERE order_id = $1", [id]);
            result = await pool.query("DELETE FROM orders WHERE id = $1", [id]);
        });

        // Delete cart and its items
        result = await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
        result = await pool.query("DELETE FROM carts WHERE id = $1", [cartId]);

        // Delete third-party credentials
        result = await pool.query("DELETE FROM federated_credentials WHERE user_id = $1", [userId]);

        // Delete user and log out
        result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [userId]);
        if (result.rows[0].id === userId) req.logout(err => {
            if (err) return res.status(500).send("An unknown error occurred. Kindly try again.");
            res.status(204).send("Account deleted successfully");
        });
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const unlinkThirdParty = async(req, res) => {
    // VALIDATION AND SANITISATION
    // Third-party provider
    let provider = sanitizeHtml(trim(escape(req.query.provider))).toLowerCase();

    // User ID
    let userId = trim(req.user.id);
    if (!isNumeric(userId, { no_symbols: true }) || !isLength(userId, { min: 7, max: 7 })) return res.status(401).send("Error: Invalid user ID in session.");

    try { // Get third-party credentials
        let result = await pool.query("SELECT * FROM federated_credentials WHERE user_id = $1 AND provider = $2", [userId, provider]);

        // Send error if credentials do not exist
        if (result.rows.length === 0) return res.status(404).send("Error: No credentials found for the given provider.");

        // Delete third-party credentials
        result = await pool.query("DELETE FROM federated_credentials WHERE user_id = $1 AND provider = $2", [userId, provider]);
        res.status(204).send(`${provider.charAt(0).toUpperCase() + provider.slice(1)} credentials unlinked successfully.`);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

module.exports = { getUser, updateUser, deleteUser, unlinkThirdParty };