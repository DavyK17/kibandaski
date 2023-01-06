// IMPORTS
const pool = require("../pool");
const { isNumeric, isLength, trim, escape } = require("validator");
const sanitizeHtml = require("../../util/sanitizeHtml");

// FUNCTIONS
const getUsers = async(req, res) => {
    try {
        if (req.query.id) { // GET USER BY ID
            // Validate and sanitise user ID
            let id = trim(req.query.id);
            if (!isNumeric(id, { no_symbols: true }) || !isLength(id, { min: 7, max: 7 })) return res.status(400).send("Error: Invalid user ID provided.");

            // Get user
            let result = await pool.query("SELECT id, first_name, last_name, phone, email, role FROM users WHERE id = $1", [id]);

            // Send error if user does not exist
            if (result.rows.length === 0) return res.status(404).send("Error: This user does not exist.");

            // Create and send user object
            res.status(200).json({
                id: result.rows[0].id,
                firstName: result.rows[0].first_name,
                lastName: result.rows[0].last_name,
                phone: parseInt(result.rows[0].phone),
                email: result.rows[0].email,
                role: result.rows[0].role
            });
        } else { // GET ALL USERS
            // Create users array
            let users = [];

            // Add each user to users array
            let result = await pool.query("SELECT id, first_name, last_name, phone, email, role FROM users ORDER BY id ASC");
            result.rows.forEach(({ id, first_name, last_name, phone, email, role }) => {
                let user = { id, firstName: first_name, lastName: last_name, phone: Number(phone), email, role };
                users.push(user);
            });

            // Send users array
            res.status(200).json(users);
        }
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const getUsersByRole = async(req, res) => {
    try { // Sanitise role
        let role = sanitizeHtml(trim(escape(req.params.role))).toLowerCase();

        // Create users array
        let users = [];

        // Get users in role
        let result = await pool.query("SELECT id, first_name, last_name, phone, email FROM users WHERE role = $1 ORDER BY id ASC", [role]);

        // Send error if no users found in role
        if (result.rows.length === 0) return res.status(404).send("Error: No users found in provided role.");

        // Add each user in role to users array
        result.rows.forEach(({ id, first_name, last_name, phone, email }) => {
            let user = { id, firstName: first_name, lastName: last_name, phone: Number(phone), email };
            users.push(user);
        });

        // Send users array
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

module.exports = { getUsers, getUsersByRole };