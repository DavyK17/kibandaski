// IMPORTS
const pool = require("../pool");
const idGen = require("../../util/idGen");
const { isNumeric, isLength, trim, escape } = require("validator");
const sanitizeHtml = require("../../util/sanitizeHtml");

// FUNCTIONS
const createProduct = async(req, res) => {
    // Generate product ID
    const id = idGen(5);

    // VALIDATION AND SANITISATION
    let { name, description, price, category } = req.body;

    // Name
    if (typeof name !== "string") return res.status(400).send("Error: Name must be a string.");
    name = sanitizeHtml(trim(escape(name)));

    // Description
    if (typeof description !== "string") return res.status(400).send("Error: Description must be a string.");
    description = sanitizeHtml(trim(escape(description)));
    if (!isLength(description, { min: 1, max: 255 })) return res.status(400).send("Error: Description must be no longer than 255 characters.");

    // Price
    if (typeof price !== "string" && typeof price !== "number") return res.status(400).send("Error: Price must be a number.");
    if (typeof price === "string") price = trim(price);
    price = Math.round(price);

    // Category
    if (typeof category !== "string") return res.status(400).send("Error: Category must be a string.");
    category = sanitizeHtml(trim(escape(category))).toLowerCase();

    try { // Get product
        let result = await pool.query("SELECT * FROM products WHERE name = $1", [name]);

        // Send error if product already exists
        if (result.rows.length > 0) return res.status(409).send("Error: A product with the provided name already exists.");

        // Create product
        let text = `INSERT INTO products (id, name, description, price, category, created_at) VALUES ($1, $2, $3, $4, $5, to_timestamp(${Date.now()} / 1000)) RETURNING id`;
        let values = [id, name, description, price, category];
        result = await pool.query(text, values);
        res.status(201).send(`Product created with ID: ${result.rows[0].id}`);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const updateProduct = async(req, res) => {
    // Send error if no product ID provided
    if (!req.query.id) return res.status(400).send("Error: No product ID provided.");

    // VALIDATION
    let { name, description, price, category } = req.body;

    // Send error if no details are provided
    if (!name && !description && !price && !category) return res.status(400).send("Error: No updates provided.");

    // Name
    if (name && typeof name !== "string") return res.status(400).send("Error: Name must be a string.");

    // Description
    if (description && typeof description !== "string") return res.status(400).send("Error: Description must be a string.");

    // Price
    if (price && typeof price !== "string" && typeof price !== "number") return res.status(400).send("Error: Price must be a number.");

    // Category
    if (category && typeof category !== "string") return res.status(400).send("Error: Category must be a string.");

    // Product ID (also sanitised)
    let id = trim(req.query.id);
    if (!isNumeric(id, { no_symbols: true }) || !isLength(id, { min: 5, max: 5 })) return res.status(400).send("Error: Invalid product ID provided.");

    try { // Get product
        let result = await pool.query("SELECT name, description, price, category FROM products WHERE id = $1", [id]);

        // Send error if product does not exist
        if (result.rows.length === 0) return res.status(404).send("Error: This product does not exist.");

        // Save existing details to object
        let old = {...result.rows[0] };

        // SANITISATION
        // Name
        name = sanitizeHtml(trim(escape(name || old.name)));

        // Description
        description = sanitizeHtml(trim(escape(description || old.description)));
        if (!isLength(description, { min: 1, max: 255 })) return res.status(400).send("Error: Description must be no longer than 255 characters.");

        // Price
        price = price || old.price;
        if (typeof price === "string") price = trim(price);
        price = Math.round(price);

        // Category
        category = sanitizeHtml(trim(escape(category || old.category)));

        // Send error if no updates made
        if (old.name === name && old.description === description && old.price === price && old.category === category) return res.status(400).send("Error: No updates provided.");

        // Update product
        result = await pool.query("UPDATE products SET name = $1, description = $2, price = $3, category = $4 WHERE id = $5 RETURNING id", [name, description, price, category, id]);
        res.status(200).send(`Product updated with ID: ${result.rows[0].id}`);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const deleteProduct = async(req, res) => {
    // Send error if no product ID provided
    if (!req.query.id) return res.status(400).send("Error: No product ID provided.");

    // Validate and sanitise product ID
    let id = trim(req.query.id);
    if (!isNumeric(id, { no_symbols: true }) || !isLength(id, { min: 5, max: 5 })) return res.status(400).send("Error: Invalid product ID provided.");

    try { // Get product
        let result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);

        // Send error if product does not exist
        if (result.rows.length === 0) return res.status(404).send("Error: This product does not exist.");

        // Delete product
        result = await pool.query("DELETE FROM products WHERE id = $1", [id]);
        res.status(204).send("Product deleted successfully");
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

module.exports = { createProduct, updateProduct, deleteProduct };