const pool = require("../pool");
const idGen = require("../../util/idGen");

const getCart = async(req, res) => {
    try {
        let result = await pool.query("SELECT * FROM carts WHERE user_id = $1", [req.user.id]);
        let cart = { id: result.rows[0].id, userId: result.rows[0].user_id, items: [] };

        result = await pool.query("SELECT cart_items.product_id AS product_id, cart_items.quantity AS quantity, (cart_items.quantity * products.price) AS total_cost FROM cart_items JOIN products ON cart_items.product_id = products.id WHERE cart_id = $1", [req.user.cartId]);
        result.rows.forEach(({ product_id, quantity, total_cost }) => {
            let item = { productId: product_id, quantity, totalCost: total_cost };
            cart.items.push(item);
        });

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const addToCart = async(req, res) => {
    let { productId, quantity = 1 } = req.body;

    try {
        // Update quantity if product is already in cart
        let result = await pool.query("SELECT product_id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2", [req.user.cartId, productId]);
        if (result.rows.length > 0) {
            quantity += parseInt(result.rows[0].quantity);

            let text = "UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING product_id";
            let values = [quantity, req.user.cartId, productId];

            result = await pool.query(text, values);
            res.status(200).send(`Quantity updated in cart for product with ID: ${result.rows[0].product_id}`);
        } else { // Add product to cart
            let text = `INSERT INTO cart_items (cart_id, product_id, quantity, added_at) VALUES ($1, $2, $3, to_timestamp(${Date.now()} / 1000)) RETURNING product_id`;
            let values = [req.user.cartId, productId, quantity];

            result = await pool.query(text, values);
            res.status(200).send(`Added to cart product with ID: ${result.rows[0].product_id}`);
        }
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const emptyCart = async(req, res) => {
    try {
        let result = await pool.query("SELECT * FROM cart_items WHERE cart_id = $1", [req.user.cartId]);
        if (result.rows.length === 0) { // Send error if cart is empty
            res.status(403).send("Error: Your cart is already empty.");
        } else { // Empty cart
            result = await pool.query("DELETE FROM cart_items WHERE cart_id = $1 RETURNING cart_id", [req.user.cartId]);
            if (result.rows[0].cart_id === req.user.cartId) res.status(200).send("Emptied cart successfully");
        }
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const checkout = async(req, res) => {
    const orderId = idGen(10);

    try {
        let result = await pool.query("SELECT * FROM cart_items WHERE cart_id = $1", [req.user.cartId]);
        if (result.rows.length === 0) { // Send error if cart is empty
            res.status(403).send("Error: Your cart is empty.");
        } else {
            // Create order
            let text = `INSERT INTO orders (id, user_id, created_at, status) VALUES ($1, $2, to_timestamp(${Date.now()} / 1000), 'pending') RETURNING id`;
            let values = [orderId, req.user.id]
    
            result = await pool.query(text, values);
    
            // Add items to order
            let items = [];
            result = await pool.query(`SELECT product_id, quantity FROM cart_items WHERE cart_id = $1`, [req.user.cartId]);
            result.rows.forEach(row => items.push({ productId: row.product_id, quantity: row.quantity }));
    
            items.forEach(async(item) => {
                text = "INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)";
                values = [orderId, item.productId, item.quantity];
    
                result = await pool.query(text, values);
            });
    
            // Empty cart
            result = await pool.query("DELETE FROM cart_items WHERE cart_id = $1 RETURNING cart_id", [req.user.cartId]);
    
            // Confirm order
            res.status(201).send(`Order placed with ID: ${orderId}`);
        }
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

module.exports = { getCart, addToCart, emptyCart, checkout };