/* CONFIGURATION */

// General
require("dotenv").config();
const express = require("express");
const path = require("path");
const port = process.env.PORT || 8000;

// App
const app = express();
app.use(express.static(path.join(__dirname, "client", "build")));

// Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS
if (app.get("env") === "development") {
    const cors = require("cors");
    const origin = "http://localhost:3000";
    app.use(cors({ origin }));
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
        secure: false
    }
}

if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    sessionConfig.cookie.secure = true;
}
app.use(session(sessionConfig));

// Passport.js
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());


/* ROUTING */
// Routers
const apiRouter = require("./routers/index");
app.use("/api", apiRouter);

// Client
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


/* LISTENER */
app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});

/* EXPORT */
module.exports = app;