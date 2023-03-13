// IMPORTS
const { readFileSync } = require("fs");
const { join } = require("path");
const pool = require("../pool");

// FUNCTION
const seedDatabase = async() => {
    const parsedData = JSON.parse(readFileSync(join(process.cwd(), "server", "db", "seed", "data.json"), "utf-8"));
    
    try {
        // Define tables array
        const tables = ["order_items", "orders", "cart_items", "carts", "products", "federated_credentials", "users", "user_sessions", "login_attempts"];

        // Delete existing data from tables
        for (const table of tables) await pool.query(`DELETE FROM ${table}`);

        // Insert seed data to tables
        for (const user of parsedData.users) {
            const { id, first_name, last_name, phone, email, password, created_at, role, locked } = user;

            let text = `INSERT INTO users (id, first_name, last_name, phone, email, password, created_at, role, locked) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`;
            let values = [id, first_name, last_name, phone, email, password, created_at, role, locked];

            await pool.query(text, values);
        }

        for (const cart of parsedData.carts) {
            const { id, user_id } = cart;

            let text = `INSERT INTO carts (id, user_id) VALUES ($1, $2) RETURNING id`;
            let values = [id, user_id];

            await pool.query(text, values);
        }

        for (const product of parsedData.products) {
            const { id, name, price, category, created_at, description, locked } = product;

            let text = `INSERT INTO products (id, name, price, category, created_at, description, locked) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
            let values = [id, name, price, category, created_at, description, locked];

            await pool.query(text, values);
        }

        return "Database seeded successfully";
    } catch(err) {
        return err;
    }
}

module.exports = seedDatabase;