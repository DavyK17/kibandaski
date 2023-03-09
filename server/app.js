/* CONFIGURATION */

// General
require("dotenv").config();
const express = require("express");
const { join } = require("path");
const { clientPort, getServerPort } = require("../src/util/port");

// App
const app = express();
app.use(express.static(join(__dirname, "../build")));

// Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS
if (process.env.NODE_ENV === "development") {
    const cors = require("cors");
    app.use(cors({ origin: `http://localhost:${clientPort}` }));
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
        secure: process.env.NODE_ENV === "production"
    }
}

if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);
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
    res.sendFile(join(__dirname, "../build", "index.html"));
});


/* LISTENER */
getServerPort().then(port => app.listen(port));