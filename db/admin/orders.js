// IMPORTS
const pool = require("../pool");
const { isNumeric, isLength, trim } = require("validator");

// FUNCTIONS
const getOrders = async(req, res) => {
    try {
        if (req.query.id) { // GET ORDER BY ID
            // Validate and sanitise order ID
            let id = trim(req.query.id);
            if (!isNumeric(id, { no_symbols: true }) || !isLength(id, { min: 10, max: 10 })) return res.status(400).send("Error: Invalid order ID provided.");

            // Send error if order does not exist
            let result = await pool.query("SELECT id, user_id, status FROM orders WHERE id = $1", [id]);
            if (result.rows.length === 0) return res.status(404).send("Error: This order does not exist.");

            // Create order object
            let order = { id: result.rows[0].id, userId: result.rows[0].user_id, status: result.rows[0].status, items: [] };

            // Add each item on the order to array in order object
            result = await pool.query("SELECT order_items.product_id AS product_id, order_items.quantity AS quantity, (order_items.quantity * products.price) AS total_cost FROM order_items JOIN products ON order_items.product_id = products.id WHERE order_items.order_id = $1", [id]);
            result.rows.forEach(({ product_id, quantity, total_cost }) => {
                let item = { productId: product_id, quantity, totalCost: total_cost };
                order.items.push(item);
            });

            // Send order
            res.status(200).json(order);
        } else { // GET ALL ORDERS
            let result = await pool.query("SELECT id, user_id, status FROM orders ORDER BY created_at DESC");
            res.status(200).json(result.rows);
        }
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const getOrdersByUser = async(req, res) => {
    // Validate and sanitise user ID
    let id = trim(req.params.userId);
    if (!isNumeric(id, { no_symbols: true }) || !isLength(id, { min: 7, max: 7 })) return res.status(400).send("Error: Invalid user ID provided.");

    try { // Get orders by user
        let result = await pool.query("SELECT id, status FROM orders WHERE user_id = $1 ORDER BY created_at DESC", [id]);

        // Send error if no orders found by user
        if (result.rows.length === 0) return res.status(404).send("Error: No orders found from provided user.");

        // Send orders by user
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const acknowledgeOrder = async(req, res) => {
    // Send error if no order ID provided
    if (!req.query.id) return res.status(400).send("Error: No order ID provided.");

    // Validate and sanitise order ID
    let id = trim(req.query.id);
    if (!isNumeric(id, { no_symbols: true }) || !isLength(id, { min: 10, max: 10 })) return res.status(400).send("Error: Invalid order ID provided.");

    try { // Get order
        let result = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);

        // Send error if order does not exist
        if (result.rows.length === 0) return res.status(404).send("Error: This order does not exist.");

        // Acknowledge order if pending
        if (result.rows[0].status === "pending") {
            result = await pool.query("UPDATE orders SET status = 'acknowledged' WHERE id = $1 RETURNING id", [id]);
            return res.status(200).send(`Order acknowledged with ID: ${result.rows[0].id}`);
        }

        // Send error if order has been acknowledged or fulfilled
        res.status(403).send(`Error: The order has already been ${result.rows[0].status}`);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const fulfillOrder = async(req, res) => {
    // Send error if no order ID provided
    if (!req.query.id) return res.status(400).send("Error: No order ID provided.");

    // Validate and sanitise order ID
    let id = trim(req.query.id);
    if (!isNumeric(id, { no_symbols: true }) || !isLength(id, { min: 10, max: 10 })) return res.status(400).send("Error: Invalid order ID provided.");

    try { // Get order
        let result = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);

        // Send error if order does not exist
        if (result.rows.length === 0) return res.status(404).send("Error: This order does not exist.");

        // Send error if still pending
        if (result.rows[0].status === "pending") return res.status(403).send("Error: The order is still pending.");

        // Fulfill order if acknowledged
        if (result.rows[0].status === "acknowledged") {
            result = await pool.query("UPDATE orders SET status = 'fulfilled' WHERE id = $1 RETURNING id", [id]);
            return res.status(200).send(`Order fulfilled with ID: ${result.rows[0].id}`);
        }

        // Send error if fulfilled or cancelled
        res.status(403).send(`Error: The order has already been ${result.rows[0].status}`);

    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

module.exports = { getOrders, getOrdersByUser, acknowledgeOrder, fulfillOrder };