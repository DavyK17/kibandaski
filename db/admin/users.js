const pool = require("../pool");

const getUsers = async(req, res) => {
    try {
        if (req.query.id) { // Get user by ID
            let result = await pool.query("SELECT id, first_name, last_name, phone, email, role FROM users WHERE id = $1", [req.query.id]);
    
            let user = {
                id: result.rows[0].id,
                firstName: result.rows[0].first_name,
                lastName: result.rows[0].last_name,
                phone: parseInt(result.rows[0].phone),
                email: result.rows[0].email,
                role: result.rows[0].role
            };
            res.status(200).json(user);
        } else { // Get all users
            let users = [];
    
            let result = await pool.query("SELECT id, first_name, last_name, phone, email, role FROM users ORDER BY id ASC");
            result.rows.forEach(({ id, first_name, last_name, phone, email, role }) => {
                let user = { id, firstName: first_name, lastName: last_name, phone: parseInt(phone), email, role };
                users.push(user);
            });
    
            res.status(200).json(users);
        }
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

module.exports = getUsers;