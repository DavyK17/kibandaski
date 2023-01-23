// IMPORTS
const bcrypt = require("bcrypt");
const passport = require("passport");
const pool = require("../pool");
const requestIP = require("request-ip");

const idGen = require("../../util/idGen");
const loginAttempt = require("../../util/loginAttempt");

// FUNCTIONS
const login = async(req, accessToken, refreshToken, profile, done) => {
    // Get request IP address
    const ip = requestIP.getClientIp(req);

    // Generate login attempt ID
    const attemptId = idGen(15);

    try { // Get Google credentials
        let result = await pool.query("SELECT * FROM federated_credentials WHERE id = $1 AND provider = $2", [profile.id, profile.provider]);

        // Create user account if credentials don't exist
        if (result.rows.length === 0) {
            // Send error if email already exists in database
            result = await pool.query("SELECT email FROM users WHERE email = $1", [profile.emails[0].value]);
            if (result.rows.length > 0) return res.status(409).send("Error: A user with the provided email already exists.");

            // Generate user ID and cart ID
            const userId = idGen(7);
            const cartId = idGen(7);

            // Generate password hash
            const salt = await bcrypt.genSalt(17);
            const passwordHash = await bcrypt.hash(process.env.GENERIC_PASSWORD, salt);

            // Add user to database
            let text = `INSERT INTO users (id, first_name, last_name, phone, email, password, created_at) VALUES ($1, $2, $3, $4, $5, $6, to_timestamp(${Date.now()} / 1000)) RETURNING id`;
            let values = [userId, profile.name.givenName, profile.name.familyName, "254700000000", profile.emails[0].value, passwordHash];
            result = await pool.query(text, values);

            // Add user cart to database
            result = await pool.query("INSERT INTO carts (id, user_id) VALUES ($1, $2)", [cartId, userId]);

            // Add Google credentials to database
            result = await pool.query("INSERT INTO federated_credentials (id, provider, user_id) VALUES ($1, $2, $3)", [profile.id, profile.provider, userId]);

            // Add user details to be confirmed to session
            const federatedCredentials = { id: profile.id, provider: profile.provider, confirm: true };
            return done(null, { id: userId, email: profile.emails[0].value, role: "customer", cartId: cartId, federatedCredentials });
        }

        // Save federated credentials details
        const federatedCredentials = { id: result.rows[0].id, provider: result.rows[0].provider, confirm: !result.rows[0].confirmed };

        // Get user details
        result = await pool.query("SELECT users.id AS id, users.email AS email, users.password AS password, users.role AS role, carts.id AS cart_id FROM users JOIN carts ON carts.user_id = users.id WHERE email = $1", [profile.emails[0].value]);

        // Log login attempt
        await loginAttempt(attemptId, ip, profile.emails[0].value, "google", true);

        // Add user details to be confirmed to session if not confirmed
        if (!result.rows[0].confirmed) {
            const { id, email, role, cart_id } = result.rows[0];
            return done(null, { id, email, role, cartId: cart_id, federatedCredentials });
        }

        // Add user to session
        return done(null, { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role, cartId: result.rows[0].cart_id });
    } catch (err) {
        return done({ status: 500, message: "An unknown error occurred. Kindly try again." });
    }
}

const callback = strategy => {
    // Return authentication middleware function
    return (req, res) => {
        passport.authenticate(strategy, async(err, user) => {
            // Send error if present
            if (err) return res.status(err.status).send(err.message);

            // Link user (if present and confirmed) to federated credentials
            if (strategy !== "local" && !user.federatedCredentials) {
                try { // Get federated credentials
                    let result = await pool.query("SELECT * FROM federated_credentials WHERE provider = $1 AND user_id = $2", [strategy, user.id]);

                    // Send error if credentials already exist
                    if (result.rows.length > 0) {
                        let provider = strategy.charAt(0).toUpperCase() + strategy.slice(1);
                        return res.status(403).send(`Error: Your ${provider} credentials are already linked to your account.`);
                    }

                    // Add credentials to database as confirmed
                    const { id, provider } = user.federatedCredentials;
                    result = await pool.query("INSERT INTO federated_credentials (id, provider, user_id, confirmed) VALUES ($1, $2, $3, $4)", [id, provider, req.user.id, true]);

                    // Redirect user to cart
                    res.redirect("/cart");
                } catch (err) {
                    res.status(500).send("An unknown error occurred. Kindly try again.");
                }
            }

            // Authenticate user
            req.login(user, (err) => {
                // Send error if present
                if (err) return res.status(500).send("An unknown error occurred. Kindly try again.");

                // Return user object if local login
                if (strategy === "local") return res.json(user);

                // Redirect user to confirm account details if unconfirmed
                if (user.federatedCredentials.confirm) return res.redirect("/register");

                // Redirect user to cart
                res.redirect("/cart");
            });
        })(req, res);
    }
}

module.exports = { login, callback };