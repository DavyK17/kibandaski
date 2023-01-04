require("dotenv").config();
const client = require("../client");

const getOrders = async(req, res) => {
    try {
        let result = await client.query("SELECT id, status FROM orders WHERE user_id = $1 ORDER BY created_at DESC", [req.user.id]);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

const getOrderById = async(req, res) => {
    try {
        let result = await client.query("SELECT id, status FROM orders WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
        if (result.rows.length === 0) return res.status(404).send("Error: This order does not exist.");

        let order = {...result.rows[0], items: [] };

        result = await client.query("SELECT order_items.product_id AS product_id, order_items.quantity AS quantity, (order_items.quantity * products.price) AS total_cost FROM order_items JOIN products ON order_items.product_id = products.id WHERE order_items.order_id = $1", [req.params.id]);
        result.rows.forEach(({ product_id, quantity, total_cost }) => {
            let item = { productId: product_id, quantity, totalCost: total_cost };
            order.items.push(item);
        });

        res.status(200).json(order);
    } catch (err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

const cancelOrder = async(req, res) => {
    try {
        let result = await client.query("UPDATE orders SET status = 'cancelled' WHERE id = $1 AND user_id = $2 RETURNING id", [req.params.id, req.user.id]);
        res.status(200).send(`Order cancelled with ID: ${result.rows[0].id}`);
    } catch (err) {
        res.status(500).send(`Error: ${err.detail}`);
    }
}

module.exports = {
    getOrders,
    getOrderById,
    cancelOrder
}