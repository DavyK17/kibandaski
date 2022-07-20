require("dotenv").config();
const idGen = require("../util/idGen");

const Pool = require("pg").Pool;
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

const getUsers = (req, res) => {
    pool.query(
        "SELECT * FROM users ORDER BY id ASC",
        (err, result) => {
            if (err) throw err;
            res.status(200).json(result.rows);
        }
    );
}

const getUserById = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(
        "SELECT * FROM users WHERE id = $1", [id],
        (err, result) => {
            if (err) throw err;
            res.status(200).json(result.rows);
        }
    );
}

const createUser = (req, res) => {
    const { firstName, lastName, email } = req.body;

    pool.query(
        `INSERT INTO users (id, first_name, last_name, email, created_at) VALUES (${parseInt(idGen(7))}, $1, $2, $3, to_timestamp(${Date.now()} / 1000)) RETURNING *;`, [firstName, lastName, email],
        (err, result) => {
            if (err) throw err;
            res.status(201).send(`User added with ID: ${result.rows[0].id}`);
        }
    );
}

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { firstName, lastName, email } = req.body;

    pool.query(
        "UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE id = $4",
        [firstName, lastName, email, id],
        (err, result) => {
            if (err) throw err;
            res.status(200).send(`User modified with ID: ${id}`);
        }
    );
}

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(
        "DELETE FROM users WHERE id = $1", [id],
        (err, result) => {
            if (err) throw err;
            res.status(204).send(`User deleted with ID: ${id}`);
        }
    )
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}