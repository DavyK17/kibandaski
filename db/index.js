// AUTHENTICATION FUNCTIONS
const authLocal = require("./auth/local");
const authGoogle = require("./auth/google");

// ADMIN FUNCTIONS
const ordersA = require("./admin/orders");
const productsA = require("./admin/products");
const usersA = require("./admin/users");

// CUSTOMER FUNCTIONS
const cart = require("./customer/cart");
const ordersC = require("./customer/orders");
const productsC = require("./customer/products");
const usersC = require("./customer/users");

// EXPORTS
module.exports = {
    auth: {
        local: authLocal,
        google: authGoogle
    },
    admin: {
        orders: ordersA,
        products: productsA,
        users: usersA
    },
    customer: {
        cart,
        orders: ordersC,
        products: productsC,
        users: usersC
    }
}