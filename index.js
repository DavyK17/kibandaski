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
const login = require("connect-ensure-login").ensureLoggedIn("/auth/login");

// Helmet
const helmet = require("helmet");
app.use(helmet());

// Session
const session = require("express-session");
const sessionConfig = {
    store: new session.MemoryStore(),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 172800000,
        sameSite: "none",
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

// Swagger UI Express
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));


/* IMPLEMENTATION */

app.get("/", (req, res) => {
    res.send("Welcome to Kibandaski!");
});

// Routers
const authRouter = require("./routers/auth");
app.use("/auth", authRouter);

const adminRouter = require("./routers/admin");
app.use("/admin", login, (req, res, next) => {
    // Send error if user is not an admin
    if (req.user.role !== "admin") return res.status(403).send("Error: You are not authorised to carry out this operation.");
    next();
}, adminRouter);

const customerRouter = require("./routers/customer");
app.use("/customer", customerRouter);

// Error messages
app.all("*", (req, res) => {
    res.status(404).send("Error: This operation does not exist.");
});

// Listener
app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});