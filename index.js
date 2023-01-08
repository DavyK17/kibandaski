/* CONFIGURATION */

// General
require("dotenv").config();
const app = require("express")();
const port = process.env.PORT || 8000;

// Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie Parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// CORS
const cors = require("cors");
const origin = app.get("env") === "production" ? "https://kibandaski.up.railway.app" : "http://localhost:3000";
app.use(cors({ origin }));

// Helmet
const helmet = require("helmet");
app.use(helmet());

// JSON Web Token verification
const jwtVerify = require("./middleware/jwtVerify");

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
app.use("/admin", jwtVerify, (req, res, next) => {
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