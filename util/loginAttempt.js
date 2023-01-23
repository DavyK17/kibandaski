// Login attempt log function
const loginAttempt = async(id, ip, email, strategy, success) => {
    let text = `INSERT INTO login_attempts (id, ip, email, attempted_at, strategy, successful) VALUES ($1, $2, $3, to_timestamp(${Date.now()} / 1000), $4, $5)`;
    let values = [id, ip, email, strategy, success];
    return await pool.query(text, values);
}

// Export
module.exports = loginAttempt;