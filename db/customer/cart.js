// IMPORTS
const axios = require("axios");
const pool = require("../pool");
const idGen = require("../../util/idGen");
const { isNumeric, isLength, trim } = require("validator");
const sanitizeHtml = require("../../util/sanitizeHtml");

// M-PESA NUMBER VALIDATOR
const checkPhone = value => {
    if (value.match(/^254(11[0-5]|7(([0-2]|9)\d|4([0-6]|8)|5[7-9]|6[8-9]))\d{6}$/)) return true;
    return false;
}

// FUNCTIONS
const getCart = async(req, res) => {
    // VALIDATION AND SANITISATION
    // User ID
    let userId = trim(req.user.id);
    if (!isNumeric(userId, { no_symbols: true }) || !isLength(userId, { min: 7, max: 7 })) return res.status(401).send("Error: Invalid user ID in session.");

    // Cart ID
    let cartId = trim(req.user.cartId);
    if (!isNumeric(cartId, { no_symbols: true }) || !isLength(cartId, { min: 7, max: 7 })) return res.status(401).send("Error: Invalid cart ID in session.");

    try { // Get cart
        let result = await pool.query("SELECT * FROM carts WHERE user_id = $1", [userId]);

        // Send error if cart does not exist (albeit somehow, because users can't create them separately)
        if (result.rows.length === 0) return res.status(404).send("Error: This cart does not exist.");

        // Create cart object
        let cart = { id: result.rows[0].id, userId: result.rows[0].user_id, items: [] };

        // Add each item in cart to items array in cart object
        result = await pool.query("SELECT cart_items.product_id AS product_id, products.name AS name, cart_items.quantity AS quantity, (cart_items.quantity * products.price) AS total_cost FROM cart_items JOIN products ON cart_items.product_id = products.id WHERE cart_id = $1", [cartId]);
        result.rows.forEach(({ product_id, name, quantity, total_cost }) => {
            let item = { productId: product_id, name, quantity, totalCost: total_cost };
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
    if (!productId) return res.status(400).send("Error: No product ID provided.");
    if (typeof productId !== "string") return res.status(400).send("Error: Product ID must be a string.");
    productId = trim(productId);
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
    if (!isNumeric(cartId, { no_symbols: true }) || !isLength(cartId, { min: 7, max: 7 })) return res.status(401).send("Error: Invalid cart ID in session.");

    try { // Get item in cart
        let result = await pool.query("SELECT product_id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2", [cartId, productId]);

        // Add to existing quantity if item is already in cart
        if (result.rows.length > 0) {
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

const updateCartItem = async(req, res) => {
    // Send error if no product ID provided
    if (!req.query.id) return res.status(400).send("Error: No product ID provided.");

    // VALIDATION AND SANITISATION
    let { quantity } = req.body;

    // Send error if no details are provided
    if (!quantity) return res.status(400).send("Error: No update provided.");

    // Product ID (also sanitised)
    let productId = trim(req.query.id);
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
    if (!isNumeric(cartId, { no_symbols: true }) || !isLength(cartId, { min: 7, max: 7 })) return res.status(401).send("Error: Invalid cart ID in session.");

    try { // Get item in cart
        let result = await pool.query("SELECT product_id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2", [cartId, productId]);

        // Send error if item is not in cart
        if (result.rows.length === 0) return res.status(404).send("Error: This item is not in the cart.");

        // Send error if no updates made
        if (result.rows[0].quantity === quantity) return res.status(400).send("Error: No update provided.");

        // Update quantity in database
        result = await pool.query("UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING product_id", [quantity, cartId, productId]);
        res.status(200).send(`Quantity updated in cart for product with ID: ${result.rows[0].product_id}`);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const removeCartItem = async(req, res) => {
    // Send error if no product ID provided
    if (!req.query.id) return res.status(400).send("Error: No product ID provided.");

    // VALIDATION AND SANITISATION
    // Product ID
    let productId = trim(req.query.id);
    if (!isNumeric(productId, { no_symbols: true }) || !isLength(productId, { min: 5, max: 5 })) return res.status(400).send("Error: Invalid product ID provided.");

    // Cart ID
    let cartId = trim(req.user.cartId);
    if (!isNumeric(cartId, { no_symbols: true }) || !isLength(cartId, { min: 7, max: 7 })) return res.status(401).send("Error: Invalid cart ID in session.");

    try { // Get item in cart
        let result = await pool.query("SELECT product_id FROM cart_items WHERE cart_id = $1 AND product_id = $2", [cartId, productId]);

        // Send error if item is not in cart
        if (result.rows.length === 0) return res.status(404).send("Error: This item is not in the cart.");

        // Remove item from cart
        result = await pool.query("DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING product_id", [cartId, productId]);
        res.status(204).send(`Removed from cart product with ID: ${result.rows[0].product_id}`);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const emptyCart = async(req, res) => {
    // Validate and sanitise cart ID
    let cartId = trim(req.user.cartId);
    if (!isNumeric(cartId, { no_symbols: true }) || !isLength(cartId, { min: 7, max: 7 })) return res.status(401).send("Error: Invalid cart ID in session.");

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

const beginCheckout = async(req, res, next) => {
    // Generate order ID
    const orderId = idGen(10);

    // VALIDATION AND SANITISATION
    // Phone number
    let { phone } = req.body;
    if (typeof phone !== "number" && typeof phone !== "string") return res.status(400).send("Error: Phone must be a number.");
    phone = sanitizeHtml(trim(typeof phone === "number" ? phone.toString() : phone));
    if (!isNumeric(phone, { no_symbols: true })) return res.status(400).send("Error: Phone must contain numbers only.");
    if (!isLength(phone, { min: 12, max: 12 })) return res.status(400).send("Error: Invalid phone number provided (must be 254XXXXXXXXX).");
    if (!checkPhone(phone)) return res.status(400).send("Error: Phone must be a Safaricom number.");

    // User ID
    let userId = trim(req.user.id);
    if (!isNumeric(userId, { no_symbols: true }) || !isLength(userId, { min: 7, max: 7 })) return res.status(401).send("Error: Invalid user ID in session.");

    // Cart ID
    let cartId = trim(req.user.cartId);
    if (!isNumeric(cartId, { no_symbols: true }) || !isLength(cartId, { min: 7, max: 7 })) return res.status(401).send("Error: Invalid cart ID in session.");

    try { // Get cart
        let result = await pool.query("SELECT * FROM cart_items WHERE cart_id = $1", [cartId]);

        // Send error if cart is empty
        if (result.rows.length === 0) return res.status(409).send("Error: Your cart is empty.");

        // Create cart item costs array
        let costs = [];

        // Add cost of each cart item to array
        let text = "SELECT (products.price * cart_items.quantity) AS total_cost FROM cart_items JOIN products ON products.id = cart_items.product_id WHERE cart_items.cart_id = $1";
        let values = [cartId];
        result = await pool.query(text, values);
        result.rows.forEach(row => costs.push(row.total_cost));

        // Get total cost of all items in cart
        let totalCost = costs.reduce((a, b) => a + b).toString();

        // Send data to next middleware
        req.phone = phone;
        req.orderId = orderId;
        req.userId = userId;
        req.cartId = cartId;
        req.totalCost = totalCost;
        next();
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const getPaymentToken = async(req, res, next) => {
    const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

    const key = process.env.MPESA_CONSUMER_KEY;
    const secret = process.env.MPESA_CONSUMER_SECRET;
    const auth = new Buffer.from(`${key}:${secret}`).toString("base64");

    try {
        let response = await axios.get(url, { headers: { Authorization: `Basic ${auth}` } });
        req.accessToken = response.data.access_token;
        next();
    } catch (err) {
        if (err.response) {
            let { status, data } = err.response;
            return res.status(status).send(`Error: ${data.errorMessage} (M-Pesa)`);
        }

        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const completeCheckout = async(req, res) => {
    let { accessToken, phone, orderId, userId, cartId, totalCost } = req;
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

    const generateTimestamp = (time = Date.now()) => {
        let date = new Date(time);
        const formatDate = date => date.toLocaleString("en-KE", { minimumIntegerDigits: 2, useGrouping: false });

        let year = date.getFullYear();
        let month = formatDate(date.getMonth() + 1);
        let day = formatDate(date.getDate());
        let hours = formatDate(date.getHours());
        let minutes = formatDate(date.getMinutes());
        let seconds = formatDate(date.getSeconds());

        return year + month + day + hours + minutes + seconds;
    }

    let shortcode = 174379;
    let password = new Buffer.from(`${shortcode}${process.env.MPESA_PASSKEY}${generateTimestamp()}`).toString("base64");

    let body = JSON.stringify({
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": generateTimestamp(),
        "TransactionType": "CustomerPayBillOnline",
        "Amount": totalCost,
        "PartyA": phone,
        "PartyB": shortcode,
        "PhoneNumber": phone,
        "CallBackURL": "https://kibandaski.up.railway.app/api/payment/mpesa-callback",
        "AccountReference": "Kibandaski App",
        "TransactionDesc": "Order payment"
    });
    let headers = { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` };

    try {
        // Make payment
        await axios.post(url, body, { headers });

        // Create order
        let text = `INSERT INTO orders (id, user_id, created_at, status) VALUES ($1, $2, to_timestamp(${Date.now()} / 1000), 'pending') RETURNING id`;
        let values = [orderId, userId];
        let result = await pool.query(text, values);

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
        if (err.response) {
            let { status, data } = err.response;
            return res.status(status).send(`Error: ${data.errorMessage} (M-Pesa)`);
        }

        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, emptyCart, beginCheckout, getPaymentToken, completeCheckout };