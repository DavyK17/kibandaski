// IMPORTS
const pool = require("../pool");
const { isNumeric, isLength, trim, escape } = require("validator");
const sanitizeHtml = require("../../util/sanitizeHtml");

// FUNCTIONS
const getProducts = async(req, res) => {
    try {
        if (req.query.id) { // GET PRODUCT BY ID
            // Validate and sanitise product ID
            let id = trim(req.query.id);
            if (!isNumeric(id, { no_symbols: true }) || !isLength(id, { min: 5, max: 5 })) return res.status(400).send("Error: Invalid product ID provided.");

            // Send error if product does not exist
            let result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
            if (result.rows.length === 0) return res.status(404).send("Error: This product does not exist.");

            // Send product
            result = await pool.query("SELECT id, name, price, category FROM products WHERE id = $1", [id]);
            res.status(200).json(result.rows[0]);
        } else { // GET ALL PRODUCTS
            let result = await pool.query("SELECT id, name, price, category FROM products ORDER BY id ASC");
            res.status(200).json(result.rows);
        }
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

const getProductsByCategory = async(req, res) => {
    try { // Sanitise category
        let category = sanitizeHtml(trim(escape(req.params.category))).toLowerCase();

        // Get products in category
        let result = await pool.query("SELECT id, name, price FROM products WHERE category = $1 ORDER BY id ASC", [category]);

        // Send error if no products in category
        if (result.rows.length === 0) return res.status(404).send("Error: No products found in provided category.");

        // Send products in category
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

module.exports = { getProducts, getProductsByCategory };