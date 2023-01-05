const pool = require("../pool");

const getProducts = async(req, res) => {
    try {
        if (req.query.id) { // Get product by ID
            let result = await pool.query("SELECT id, name, price, category FROM products WHERE id = $1", [req.query.id]);
            res.status(200).json(result.rows[0]);
        } else { // Get all products
            let result = await pool.query("SELECT id, name, price, category FROM products ORDER BY id ASC");
            res.status(200).json(result.rows);
        }
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const getProductsByCategory = async(req, res) => {
    try {
        let result = await pool.query("SELECT id, name, price FROM products WHERE category = $1 ORDER BY id ASC", [req.params.category]);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

module.exports = { getProducts, getProductsByCategory };