// IMPORTS
const pool = require("../pool");
const { isNumeric, isLength, trim } = require("validator");

// FUNCTIONS
const getOrders = async(req, res) => {
    // Validate and sanitise user ID
    let userId = trim(req.user.id);
    if (!isNumeric(userId, { no_symbols: true }) || !isLength(userId, { min: 7, max: 7 })) return res.status(401).send("Error: Invalid user ID in session.");

    try {
        if (req.query.id) { // GET ORDER BY ID
            // Validate and sanitise order ID
            let id = trim(req.query.id);
            if (!isNumeric(id, { no_symbols: true }) || !isLength(id, { min: 10, max: 10 })) return res.status(400).send("Error: Invalid order ID provided.");

            // Send error if order does not exist
            let result = await pool.query("SELECT id, created_at, status FROM orders WHERE id = $1 AND user_id = $2", [id, userId]);
            if (result.rows.length === 0) return res.status(404).send("Error: This order does not exist.");

            // Create order object
            let order = { id: result.rows[0].id, createdAt: result.rows[0].created_at, status: result.rows[0].status, items: [] };

            // Add each item on order to items array in order object
            result = await pool.query("SELECT order_items.product_id AS product_id, products.name AS name, order_items.quantity AS quantity, (order_items.quantity * products.price) AS total_cost FROM order_items JOIN products ON order_items.product_id = products.id WHERE order_items.order_id = $1", [id]);
            result.rows.forEach(({ product_id, name, quantity, total_cost }) => {
                let item = { productId: product_id, name, quantity, totalCost: total_cost };
                order.items.push(item);
            });

            // Send order
            res.status(200).json(order);
        } else { // GET ALL ORDERS
            // Create orders array
            let orders = [];

            // Get orders
            let result = await pool.query("SELECT id, created_at, status FROM orders WHERE user_id = $1 ORDER BY created_at DESC", [userId]);

            // Add each order to orders array
            if (result.rows.length > 0) result.rows.forEach(({ id, created_at, status }) => {
                let order = { id, createdAt: created_at, status };
                orders.push(order);
            });

            // Send orders array
            res.status(200).json(orders);
        }
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const cancelOrder = async(req, res) => {
    // Send error if no order ID provided
    if (!req.query.id) return res.status(400).send("Error: No order ID provided.");

    // VALIDATION AND SANITISATION
    // Order ID
    let id = trim(req.query.id);
    if (!isNumeric(id, { no_symbols: true }) || !isLength(id, { min: 10, max: 10 })) return res.status(400).send("Error: Invalid order ID provided.");

    // User ID
    let userId = trim(req.user.id);
    if (!isNumeric(userId, { no_symbols: true }) || !isLength(userId, { min: 7, max: 7 })) return res.status(401).send("Error: Invalid user ID in session.");

    // CANCEL ORDER
    try { // Get order
        let result = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [id, userId]);

        // Send error if order does not exist
        if (result.rows.length === 0) return res.status(404).send("Error: This order does not exist.");

        // Cancel order if pending
        if (result.rows[0].status === "pending") {
            result = await pool.query("UPDATE orders SET status = 'cancelled' WHERE id = $1 AND user_id = $2 RETURNING id", [id, userId]);
            return res.status(200).send(`Order cancelled with ID: ${result.rows[0].id}`);
        }

        // Send error if order has been cancelled or processed
        res.status(403).send(`Error: The order has already been ${result.rows[0].status}`);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

module.exports = { getOrders, cancelOrder };