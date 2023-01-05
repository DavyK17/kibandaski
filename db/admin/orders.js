const pool = require("../pool");

const getOrders = async(req, res) => {
    try {
        if (req.query.id) { // Get order by ID
            let result = await pool.query("SELECT id, user_id, status FROM orders WHERE id = $1", [req.query.id]);
            if (result.rows.length === 0) return res.status(404).send("Error: This order does not exist.");

            let order = { id: result.rows[0].id, userId: result.rows[0].user_id, status: result.rows[0].status, items: [] };

            result = await pool.query("SELECT order_items.product_id AS product_id, order_items.quantity AS quantity, (order_items.quantity * products.price) AS total_cost FROM order_items JOIN products ON order_items.product_id = products.id WHERE order_items.order_id = $1", [req.query.id]);
            result.rows.forEach(({ product_id, quantity, total_cost }) => {
                let item = { productId: product_id, quantity, totalCost: total_cost };
                order.items.push(item);
            });

            res.status(200).json(order);
        } else { // Get all orders
            let result = await pool.query("SELECT id, user_id, status FROM orders ORDER BY created_at DESC");
            res.status(200).json({ id: result.rows[0].id, userId: result.rows[0].user_id, status: result.rows[0].status });
        }
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const getOrdersByUser = async(req, res) => {
    try {
        let result = await pool.query("SELECT id, status FROM orders WHERE user_id = $1 ORDER BY created_at DESC", [req.params.userId]);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const acknowledgeOrder = async(req, res) => {
    if (!req.query.id) return res.status(400).send("Error: No order ID specified.");

    try {
        let result = await pool.query("SELECT * FROM orders WHERE id = $1", [req.query.id]);
        if (result.rows[0].status === "pending") { // Acknowledge order if pending
            result = await pool.query("UPDATE orders SET status = 'acknowledged' WHERE id = $1 RETURNING id", [req.query.id]);
            res.status(200).send(`Order acknowledged with ID: ${result.rows[0].id}`);
        } else {
            res.status(403).send(`Error: The order has already been ${result.rows[0].status}`);
        }
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const fulfillOrder = async(req, res) => {
    if (!req.query.id) return res.status(400).send("Error: No order ID specified.");

    try {
        let result = await pool.query("SELECT * FROM orders WHERE id = $1", [req.query.id]);
        if (result.rows[0].status === "acknowledged") { // Fulfill order if acknowledged
            result = await pool.query("UPDATE orders SET status = 'fulfilled' WHERE id = $1 RETURNING id", [req.query.id]);
            res.status(200).send(`Order fulfilled with ID: ${result.rows[0].id}`);
        } else if (result.rows[0].status === "pending") { // Send error if still pending
            res.status(403).send("Error: The order is still pending.");
        } else { // Send error if fulfilled or cancelled
            res.status(403).send(`Error: The order has already been ${result.rows[0].status}`);
        }
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

module.exports = { getOrders, getOrdersByUser, acknowledgeOrder, fulfillOrder };