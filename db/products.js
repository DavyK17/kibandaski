require("dotenv").config();
const idGen = require("../util/idGen");

const { Pool } = require("pg");
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

const getProducts = async(req, res) => {
    try {
        if (req.query.category) { // Get products by category
            let result = await pool.query("SELECT id, name, price FROM products WHERE category = $1 ORDER BY id ASC", [req.query.category]);
            res.status(200).json(result.rows);
        } else { // Get all products
            let result = await pool.query("SELECT id, name, price, category FROM products ORDER BY id ASC");
            res.status(200).json(result.rows);
        }
    } catch (err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

const getProductById = async(req, res) => {
    const id = req.params.id;

    try {
        let result = await pool.query("SELECT id, name, price, category FROM products WHERE id = $1", [id]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

const createProduct = async(req, res) => {
    const { name, price, category } = req.body;
    const id = idGen(5);

    try {
        // Create product
        let text = `INSERT INTO products (id, name, price, category, created_at) VALUES ($1, $2, $3, $4, to_timestamp(${Date.now()} / 1000)) RETURNING id`;
        let values = [id, name, price, category];

        let result = await pool.query(text, values);
        res.status(201).send(`Product created with ID: ${result.rows[0].id}`);
    } catch (err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

const updateProduct = async(req, res) => {
    const id = req.params.id;

    try {
        // Retrieve existing details from database if not provided in body
        let result = await pool.query("SELECT name, price, category FROM products WHERE id = $1", [id]);

        const name = req.body.name || result.rows[0].name;
        const price = req.body.price || result.rows[0].price;
        const category = req.body.category || result.rows[0].category;

        // Update product details
        let text = "UPDATE products SET name = $1, price = $2, category = $3 WHERE id = $4 RETURNING id";
        let values = [name, price, category, id];

        result = await pool.query(text, values);
        res.status(200).send(`Product modified with ID: ${result.rows[0].id}`);
    } catch (err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

const deleteProduct = async(req, res) => {
    const id = req.params.id;

    try {
        let result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING id", [id]);
        res.status(204).send(`Product created with ID: ${result.rows[0].id}`);
    } catch (err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}