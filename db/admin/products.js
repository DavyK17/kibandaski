const pool = require("../pool");
const idGen = require("../../util/idGen");

const createProduct = async(req, res) => {
    const { name, price, category } = req.body;
    const id = idGen(5);

    try {
        // Create product
        let text = `INSERT INTO products (id, name, price, category, created_at) VALUES ($1, $2, $3, $4, to_timestamp(${Date.now()} / 1000)) RETURNING id`;
        let values = [id, name, Number(price), category];

        let result = await pool.query(text, values);
        res.status(201).send(`Product created with ID: ${result.rows[0].id}`);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const updateProduct = async(req, res) => {
    if (!req.query.id) return res.status(400).send("Error: No product ID specified.");

    try {
        // Retrieve existing details from database if not provided in body
        let result = await pool.query("SELECT name, price, category FROM products WHERE id = $1", [req.query.id]);

        const name = req.body.name || result.rows[0].name;
        const price = req.body.price || result.rows[0].price;
        const category = req.body.category || result.rows[0].category;

        // Update product details
        let text = "UPDATE products SET name = $1, price = $2, category = $3 WHERE id = $4 RETURNING id";
        let values = [name, Number(price), category, req.query.id];

        result = await pool.query(text, values);
        res.status(200).send(`Product modified with ID: ${result.rows[0].id}`);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const deleteProduct = async(req, res) => {
    if (!req.query.id) return res.status(400).send("Error: No product ID specified.");
    
    try {
        let result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING id", [req.query.id]);
        res.status(204).send(`Product created with ID: ${result.rows[0].id}`);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

module.exports = { createProduct, updateProduct, deleteProduct };