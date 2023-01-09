/* CONFIGURATION */

// General
require("dotenv").config();
const app = require("express")();
const port = process.env.PORT || 8000;

// Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect-ensure-login
const loggedIn = require("connect-ensure-login").ensureLoggedIn("/auth/login");

// CORS
const cors = require("cors");
const origin = app.get("env") === "production" ? "https://kibandaski.up.railway.app" : "http://localhost:3000";
app.use(cors({ origin }));

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
    cookie: { sameSite: "none", httpOnly: false, secure: false }
}

if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    sessionConfig.cookie.httpOnly = true;
    sessionConfig.cookie.secure = true;
}
app.use(session(sessionConfig));

// Passport.js
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

// Swagger UI Express
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));


/* ROUTING */
// Root path
app.get("/", (req, res) => res.send("Welcome to Kibandaski! You can access the API documentation at /docs."));

// Routers
const authRouter = require("./routers/auth");
app.use("/auth", authRouter);

const adminRouter = require("./routers/admin");
app.use("/admin", loggedIn, (req, res, next) => {
    // Send error if user is not an admin
    if (req.user.role !== "admin") return res.status(403).send("Error: You are not authorised to carry out this operation.");
    next();
}, adminRouter);

const customerRouter = require("./routers/customer");
app.use("/customer", customerRouter);

// Send error if route does not exist
app.all("*", (req, res) => {
    res.status(404).send("Error: This operation does not exist.");
});


/* LISTENER */
app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});