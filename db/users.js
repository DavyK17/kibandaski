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
    const id = parseInt(req.params.id);

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
        const result = await pool.query("SELECT email FROM users WHERE email = $1", [email]);
        if (result.rows.length > 0) return res.status(409).send("Error: A user with the provided email already exists");

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
    const id = parseInt(req.params.id);
    const { firstName, lastName, email } = req.body;
    let text = "UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4";
    let values = [firstName, lastName, email, id];

    try {
        const result = await pool.query(text, values);
        res.status(200).send(`User modified with ID: ${id}`);
    } catch(err) {
        res.status(500).send(err);
    }
}

const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
        res.status(204).send(`User deleted with ID: ${id}`);
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