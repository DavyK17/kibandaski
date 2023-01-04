/* CONFIGURATION */

// General
require("dotenv").config();
const app = require("express")();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const passport = require("passport");
const port = process.env.PORT || 8000;

// connect-ensure-login
const login = require("connect-ensure-login").ensureLoggedIn("/login");

// Swagger UI Express
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Express session
const session = require("express-session");
const store = new session.MemoryStore();

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Helmet
app.use(helmet());

// Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 172800000,
        secure: true,
        sameSite: "none",
    },
    store
}));

// Passport.js
app.use(passport.initialize());
app.use(passport.session());


/* IMPLEMENTATION */

app.get("/", (req, res) => {
    res.send("Welcome to Kibandaski!");
});

// Routers
const authRouter = require("./routers/auth");
app.use("/", authRouter);

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