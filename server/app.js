/* CONFIGURATION */

// General
require("dotenv").config();
const express = require("express");
const { join } = require("path");

// App
const app = express();
app.use(express.static(join(__dirname, "..", "build")));

// Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS
if (app.get("env") === "development") {
    const cors = require("cors");
    app.use(cors({ origin: "http://localhost:3000" }));
}

// Helmet
const helmet = require("helmet");
app.use(helmet());

// Session
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./db/pool");

const sessionConfig = {
    store: new pgSession({ pool, tableName: "user_sessions", createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET,
    name: "kibandaski_sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: "lax", // necessary to enable access to req.user during Passport authentication for linking third-party accounts
        secure: app.get("env") === "production",
    }
}

if (app.get("env") === "production") app.set("trust proxy", 1);
app.use(session(sessionConfig));

// Passport.js
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());


/* ROUTING */
// Routers
const apiRouter = require("./routers/index");
app.use("/api", apiRouter);

// Database seeding
const seedDatabase = require("./db/seed/seed");
app.get("/test/db/seed", async(req, res) => {
    try {
        const result = await seedDatabase();
        if (result === "Database seeded successfully") res.send(result);
    } catch(err) {
        res.status(500).send(err);
    }
});

// Client
app.get("/*", (req, res) => {
    res.sendFile(join(__dirname, "..", "build", "index.html"));
});


/* EXPORT */
module.exports = app;