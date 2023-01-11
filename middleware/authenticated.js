const loggedIn = (req, res, next) => {
    if (!req.user) return res.status(401).send("Error: You are not logged in.");
    next();
}

const loggedOut = (req, res, next) => {
    if (req.user) return res.status(403).send("Error: You are not logged out.");
    next();
}

module.exports = { loggedIn, loggedOut };