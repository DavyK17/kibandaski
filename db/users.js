require("dotenv").config();
const idGen = require("../util/idGen");
const bcrypt = require("bcrypt");

const { Pool } = require("pg");
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

const getUsers = async (req, res) => {
    try {
        const result = await pool.query("SELECT id, first_name, last_name, email FROM users ORDER BY id ASC");
        res.status(200).json(result.rows);
    } catch(err) {
        res.status(500).send(err);
    }
}

const getUserById = async (req, res) => {
    const id = req.params.id;

    try {
        const result = await pool.query("SELECT id, first_name, last_name, email FROM users WHERE id = $1", [id]);
        res.status(200).json(result.rows);
    } catch(err) {
        res.status(500).send(err);
    }
}

const createUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const id = parseInt(idGen(7));

    try {
        // Send error if email already exists in database
        const result = await pool.query("SELECT email FROM users WHERE email = $1", [email]);
        if (result.rows.length > 0) return res.status(409).send("Error: A user with the provided email already exists!");

        // Create user
        const salt = await bcrypt.genSalt(17);
        const passwordHash = await bcrypt.hash(password, salt);
        
        let text = `INSERT INTO users (id, first_name, last_name, email, password, created_at) VALUES ($1, $2, $3, $4, $5, to_timestamp(${Date.now()} / 1000)) RETURNING id`;
        let values = [id, firstName, lastName, email, passwordHash];
        
        const newUser = await pool.query(text, values);
        res.status(201).send(`User created with ID: ${newUser.rows[0].id}`);
    } catch(err) {
        res.status(500).send(err);
    }
}

const updateUser = async (req, res) => {
    const id = req.params.id;

    try {
        // Send error if current user's ID does not match requested ID
        if (req.user.id !== id) return res.status(401).send("Error: You are not authorised to update another user's account!");

        // Retrieve existing details from database if not provided in body
        const result = await pool.query("SELECT first_name, last_name, email, password FROM users WHERE id = $1", [id]);

        const firstName = req.body.firstName || result.rows[0].first_name;
        const lastName = req.body.lastName || result.rows[0].last_name;
        const email = req.body.email || result.rows[0].email;

        const salt = await bcrypt.genSalt(17);
        const passwordHash = req.body.password ? await bcrypt.hash(req.body.password, salt) : result.rows[0].password;

        // Update user details
        let text = "UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4 WHERE id = $5 RETURNING id";
        let values = [firstName, lastName, email, passwordHash, id];

        const updatedUser = await pool.query(text, values);
        res.status(200).send(`User modified with ID: ${updatedUser.rows[0].id}`);
    } catch(err) {
        res.status(500).send(err);
    }
}

const deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        // Send error if current user's ID does not match requested ID
        if (req.user.id !== id) return res.status(401).send("Error: You are not authorised to delete another user's account!");

        // Delete user
        const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
        res.status(204).send(`User deleted with ID: ${result.rows[0].id}`);
    } catch(err) {
        res.status(500).send(err);
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}