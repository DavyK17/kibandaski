const pool = require("../pool");

const getLoginAttempts = async(req, res) => {
    try {
        let result = await pool.query("SELECT * FROM login_attempts ORDER BY attempted_at DESC");
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).send("An unknown error occurred. Kindly try again.");
    }
}

module.exports = getLoginAttempts;