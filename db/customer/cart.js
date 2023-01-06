// IMPORTS
const pool = require("../pool");
const idGen = require("../../util/idGen");
const { isNumeric, isLength, trim } = require("validator");

// FUNCTIONS
const getCart = async(req, res) => {
    // VALIDATION AND SANITISATION
    // User ID
    let userId = trim(req.user.id);
    if (!isNumeric(userId, { no_symbols: true }) || !isLength(userId, { min: 7, max: 7 })) return res.status(400).send("Error: Invalid user ID in session.");

    // Cart ID
    let cartId = trim(req.user.cartId);
    if (!isNumeric(cartId, { no_symbols: true }) || !isLength(cartId, { min: 7, max: 7 })) return res.status(400).send("Error: Invalid cart ID in session.");

    try { // Get cart
        let result = await pool.query("SELECT * FROM carts WHERE user_id = $1", [userId]);

        // Send error if cart does not exist (albeit somehow, because users can't create them separately)
        if (result.rows.length === 0) return res.status(404).send("Error: This cart does not exist.");

        // Create cart object
        let cart = { id: result.rows[0].id, userId: result.rows[0].user_id, items: [] };

        // Add each item in cart to items array in cart object
        result = await pool.query("SELECT cart_items.product_id AS product_id, cart_items.quantity AS quantity, (cart_items.quantity * products.price) AS total_cost FROM cart_items JOIN products ON cart_items.product_id = products.id WHERE cart_id = $1", [cartId]);
        result.rows.forEach(({ product_id, quantity, total_cost }) => {
            let item = { productId: product_id, quantity, totalCost: total_cost };
            cart.items.push(item);
        });

        // Send cart
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const addToCart = async(req, res) => {
    // VALIDATION AND SANITISATION
    let { productId, quantity = 1 } = req.body;

    // Product ID
    if (typeof productId !== "string") return res.status(400).send("Error: Product ID must be a string.");
    if (!isNumeric(productId, { no_symbols: true }) || !isLength(productId, { min: 5, max: 5 })) return res.status(400).send("Error: Invalid product ID provided.");

    // Quantity
    if (typeof quantity !== "string" && typeof quantity !== "number") return res.status(400).send("Error: Quantity must be a number.");
    if (typeof quantity === "string") { // If quantity is a string, trim, validate for numeric values and convert to number
        quantity = trim(quantity);
        if (!isNumeric(quantity, { no_symbols: true })) return res.status(400).send("Error: Quantity must be a number.");
        quantity = Math.round(quantity);
    };

    // Cart ID
    let cartId = trim(req.user.cartId);
    if (!isNumeric(cartId, { no_symbols: true }) || !isLength(cartId, { min: 7, max: 7 })) return res.status(400).send("Error: Invalid cart ID in session.");

    try { // Get item in cart
        let result = await pool.query("SELECT product_id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2", [cartId, productId]);

        // Update quantity if item is already in cart
        if (result.rows.length > 0) {
            // Add requested quantity to existing quantity in cart
            quantity += parseInt(result.rows[0].quantity);

            // Update quantity in database
            result = await pool.query("UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING product_id", [quantity, cartId, productId]);
            return res.status(200).send(`Quantity updated in cart for product with ID: ${result.rows[0].product_id}`);
        }

        // Otherwise, add item to cart
        let text = `INSERT INTO cart_items (cart_id, product_id, quantity, added_at) VALUES ($1, $2, $3, to_timestamp(${Date.now()} / 1000)) RETURNING product_id`;
        let values = [cartId, productId, quantity];
        result = await pool.query(text, values);
        res.status(200).send(`Added to cart product with ID: ${result.rows[0].product_id}`);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const emptyCart = async(req, res) => {
    // Validate and sanitise cart ID
    let cartId = trim(req.user.cartId);
    if (!isNumeric(cartId, { no_symbols: true }) || !isLength(cartId, { min: 7, max: 7 })) return res.status(400).send("Error: Invalid cart ID in session.");

    try { // Get cart
        let result = await pool.query("SELECT * FROM cart_items WHERE cart_id = $1", [cartId]);

        // Send error if cart is empty
        if (result.rows.length === 0) return res.status(403).send("Error: Your cart is already empty.");

        // Empty cart
        result = await pool.query("DELETE FROM cart_items WHERE cart_id = $1 RETURNING cart_id", [cartId]);
        if (result.rows[0].cart_id === cartId) res.status(200).send("Emptied cart successfully");
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const checkout = async(req, res) => {
    // Generate order ID
    const orderId = idGen(10);

    // VALIDATION AND SANITISATION
    // User ID
    let userId = trim(req.user.id);
    if (!isNumeric(userId, { no_symbols: true }) || !isLength(userId, { min: 7, max: 7 })) return res.status(400).send("Error: Invalid user ID in session.");

    // Cart ID
    let cartId = trim(req.user.cartId);
    if (!isNumeric(cartId, { no_symbols: true }) || !isLength(cartId, { min: 7, max: 7 })) return res.status(400).send("Error: Invalid cart ID in session.");

    try { // Get cart
        let result = await pool.query("SELECT * FROM cart_items WHERE cart_id = $1", [cartId]);

        // Send error if cart is empty
        if (result.rows.length === 0) return res.status(403).send("Error: Your cart is empty.");

        // Create order
        let text = `INSERT INTO orders (id, user_id, created_at, status) VALUES ($1, $2, to_timestamp(${Date.now()} / 1000), 'pending') RETURNING id`;
        let values = [orderId, userId]
        result = await pool.query(text, values);

        // Create order items array
        let items = [];

        // Add cart items to order items array
        result = await pool.query(`SELECT product_id, quantity FROM cart_items WHERE cart_id = $1`, [cartId]);
        result.rows.forEach(row => items.push({ productId: row.product_id, quantity: row.quantity }));

        // Add order items to order in database
        items.forEach(async(item) => {
            result = await pool.query("INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)", [orderId, item.productId, item.quantity]);
        });

        // Empty cart
        result = await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);

        // Confirm order
        res.status(201).send(`Order placed with ID: ${orderId}`);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

module.exports = { getCart, addToCart, emptyCart, checkout };