require("dotenv").config();
const bcrypt = require("bcrypt");
const client = require("../client");
const idGen = require("../../util/idGen");

const getUser = async(req, res) => {
    try {
        let result = await client.query("SELECT id, first_name, last_name, phone, email FROM users WHERE id = $1", [req.user.id]);
        res.status(200).json({
            id: result.rows[0].id,
            firstName: result.rows[0].first_name,
            lastName: result.rows[0].last_name,
            phone: parseInt(result.rows[0].phone),
            email: result.rows[0].email
        });
    } catch (err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

const createUser = async(req, res) => {
    const { firstName, lastName, phone, email, password } = req.body;
    const userId = idGen(7);
    const cartId = idGen(7);

    try {
        // Send error if email already exists in database
        let result = await client.query("SELECT email FROM users WHERE email = $1", [email]);
        if (result.rows.length > 0) return res.status(409).send("Error: A user with the provided email already exists.");

        // Create user
        const salt = await bcrypt.genSalt(17);
        const passwordHash = await bcrypt.hash(password, salt);

        let text = `INSERT INTO users (id, first_name, last_name, phone, email, password, created_at) VALUES ($1, $2, $3, $4, $5, $6, to_timestamp(${Date.now()} / 1000)) RETURNING id`;
        let values = [userId, firstName, lastName, phone, email, passwordHash];

        result = await client.query(text, values);
        res.status(201).send(`User created with ID: ${result.rows[0].id}`);

        // Create cart
        text = "INSERT INTO carts (id, user_id) VALUES ($1, $2) RETURNING id";
        values = [cartId, userId];

        result = await client.query(text, values);
    } catch (err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

const updateUser = async(req, res) => {
    try {
        // Retrieve existing details from database if not provided in body
        let result = await client.query("SELECT first_name, last_name, phone, email, password FROM users WHERE id = $1", [req.user.id]);

        const firstName = req.body.firstName || result.rows[0].first_name;
        const lastName = req.body.lastName || result.rows[0].last_name;
        const phone = req.body.phone || result.rows[0].phone;
        const email = req.body.email || result.rows[0].email;

        const salt = await bcrypt.genSalt(17);
        const passwordHash = req.body.password ? await bcrypt.hash(req.body.password, salt) : result.rows[0].password;

        // Update user details
        let text = "UPDATE users SET first_name = $1, last_name = $2, phone = $3, email = $4, password = $5 WHERE id = $6 RETURNING id";
        let values = [firstName, lastName, phone, email, passwordHash, req.user.id];

        result = await client.query(text, values);
        res.status(200).send(`User modified with ID: ${result.rows[0].id}`);
    } catch (err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

const deleteUser = async(req, res) => {
    try {
        // Delete orders
        let orders = [];
        let result = await client.query("SELECT id FROM orders WHERE user_id = $1", [req.user.id]);
        result.rows.forEach(row => orders.push(row.id));

        orders.forEach(async(id) => {
            result = await client.query("DELETE FROM order_items WHERE order_id = $1", [id]);
            result = await client.query("DELETE FROM orders WHERE id = $1", [id]);
        });

        // Delete cart
        result = await client.query("DELETE FROM cart_items WHERE cart_id = $1", [req.user.cartId]);
        result = await client.query("DELETE FROM carts WHERE id = $1", [req.user.cartId]);

        // Delete user
        result = await client.query("DELETE FROM users WHERE id = $1 RETURNING id", [req.user.id]);
        res.status(204).send(`User deleted with ID: ${result.rows[0].id}`);
    } catch (err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

module.exports = {
    getUser,
    createUser,
    updateUser,
    deleteUser
}