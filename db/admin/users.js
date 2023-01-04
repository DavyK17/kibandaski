require("dotenv").config();
const client = require("../client");

const getUsers = async(req, res) => {
    try {
        let users = [];

        let result = await client.query("SELECT id, first_name, last_name, phone, email, role FROM users ORDER BY id ASC");
        result.rows.forEach(({ id, first_name, last_name, phone, email, role }) => {
            let user = { id, firstName: first_name, lastName: last_name, phone, email, role };
            users.push(user);
        });

        res.status(200).json(users);
    } catch (err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

const getUserById = async(req, res) => {
    try {
        let result = await client.query("SELECT id, first_name, last_name, phone, email, role FROM users WHERE id = $1", [req.params.id]);

        let user = {
            id: result.rows[0].id,
            firstName: result.rows[0].first_name,
            lastName: result.rows[0].last_name,
            phone: result.rows[0].phone,
            email: result.rows[0].email,
            role: result.rows[0].role
        };
        res.status(200).json(user);
    } catch (err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

module.exports = {
    getUsers,
    getUserById
}