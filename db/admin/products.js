require("dotenv").config();
const client = require("../client");
const idGen = require("../../util/idGen");

const createProduct = async(req, res) => {
    const { name, price, category } = req.body;
    const id = idGen(5);

    try {
        // Create product
        let text = `INSERT INTO products (id, name, price, category, created_at) VALUES ($1, $2, $3, $4, to_timestamp(${Date.now()} / 1000)) RETURNING id`;
        let values = [id, name, price, category];

        let result = await client.query(text, values);
        res.status(201).send(`Product created with ID: ${result.rows[0].id}`);
    } catch (err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

const updateProduct = async(req, res) => {
    const id = req.params.id;

    try {
        // Retrieve existing details from database if not provided in body
        let result = await client.query("SELECT name, price, category FROM products WHERE id = $1", [id]);

        const name = req.body.name || result.rows[0].name;
        const price = req.body.price || result.rows[0].price;
        const category = req.body.category || result.rows[0].category;

        // Update product details
        let text = "UPDATE products SET name = $1, price = $2, category = $3 WHERE id = $4 RETURNING id";
        let values = [name, price, category, id];

        result = await client.query(text, values);
        res.status(200).send(`Product modified with ID: ${result.rows[0].id}`);
    } catch (err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

const deleteProduct = async(req, res) => {
    const id = req.params.id;

    try {
        let result = await client.query("DELETE FROM products WHERE id = $1 RETURNING id", [id]);
        res.status(204).send(`Product created with ID: ${result.rows[0].id}`);
    } catch (err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct
}