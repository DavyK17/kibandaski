const express = require("express");
const db = require("../db/users");
const usersRouter = express.Router();

usersRouter.get("/", db.getUsers);
usersRouter.get("/:id", db.getUserById);
usersRouter.put("/:id", db.updateUser);

module.exports = usersRouter;