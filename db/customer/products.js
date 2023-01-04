require("dotenv").config();
const client = require("../client");

const getProducts = async(req, res) => {
    try {
        if (req.query.category) { // Get products by category
            let result = await client.query("SELECT id, name, price FROM products WHERE category = $1 ORDER BY id ASC", [req.query.category]);
            res.status(200).json(result.rows);
        } else { // Get all products
            let result = await client.query("SELECT id, name, price, category FROM products ORDER BY id ASC");
            res.status(200).json(result.rows);
        }
    } catch (err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

const getProductById = async(req, res) => {
    const id = req.params.id;

    try {
        let result = await client.query("SELECT id, name, price, category FROM products WHERE id = $1", [id]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

module.exports = {
    getProducts,
    getProductById
}