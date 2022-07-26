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

const getCart = async (req, res) => {
    try {
        let result = await pool.query("SELECT * FROM carts WHERE user_id = $1", [req.user.id]);
        res.status(200).json(result.rows[0]);
    } catch(err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

const addToCart = async (req, res) => {
    let { productId, quantity } = req.body;

    try {
        // Update quantity if product is already in cart
        let result = await pool.query("SELECT product_id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2", [req.user.cartId, productId]);
        if (result.rows.length > 0) {
            quantity = parseInt(quantity) + result.rows[0].quantity;
            
            result = await pool.query("UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING product_id", [quantity, req.user.cartId, productId]);
            res.status(200).send(`Quantity updated in cart for product with ID: ${result.rows[0].product_id}`);
        } else { // Add product to cart
            let text = `INSERT INTO cart_items (cart_id, product_id, quantity, added_at) VALUES ($1, $2, $3, to_timestamp(${Date.now()} / 1000)) RETURNING product_id`;
            let values = [req.user.cartId, productId, quantity];
    
            result = await pool.query(text, values);
            res.status(201).send(`Added to cart product with ID: ${result.rows[0].product_id}`);
        }
    } catch(err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

const emptyCart = async (req, res) => {
    try {
        let result = await pool.query("DELETE FROM cart_items WHERE cart_id = $1 RETURNING cart_id", [req.user.cartId]);
        res.status(204).send(`Emptied cart with ID: ${result.rows[0].cart_id}`);
    } catch(err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

module.exports = {
    getCart,
    addToCart,
    emptyCart
}