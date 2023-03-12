// Login helper function
const login = (email, password) => {
    cy.get("#email").clear();
    cy.get("#email").type(email);
    cy.get("#password").clear();
    cy.get("#password").type(password);
    cy.get("button").click();

    cy.wait("@login");
    cy.get(".cart").should("exist");
}

// Tests
describe("App", () => {
    before(() => {
        cy.request("/test/db/seed");
    });

    beforeEach(() => {
        // Visit home page
        cy.visit("/");

        // Go to login
        cy.get(".iconLogin").click();
        cy.intercept("POST", "/api/auth/login").as("login");
    });

    let orderId;
    describe("Customer", () => {
        it("can make an order", () => {
            // Log in user
            login("thisisan@email.com", "kibandaskiCustomer");
    
            // Add item to cart
            cy.intercept("GET", "/api/customer/account").as("getUser");
            cy.get(".iconHome").click();
            cy.wait("@getUser");

            cy.intercept("POST", "/api/customer/cart").as("addToCart");
            cy.get("#item-01075 > .item-footer > .add-to-cart").click();
            cy.wait("@addToCart");
    
            cy.get(".iconCart").click();
            cy.wait("@getUser");
            cy.findByTestId("cart-items").should("exist");
    
            // Place order
            cy.get(".iconCartCheckout").click();
            cy.intercept("POST", "/api/customer/cart/checkout").as("checkout");
            cy.findByRole("button", { name: /place order/i }).click();
    
            cy.wait("@checkout");
            cy.findByText("Order placed successfully").should("exist");

            cy.wait(3000);
            cy.get(".menu").should("exist");
    
            // Verify order has been placed
            cy.get(".primary > nav > ul > :nth-child(2) > a").click();
            cy.get(".orders ul").should("exist");

            cy.get(".order-body > .info > .id").then(id => orderId = id.text());
            cy.get(".status").should("have.text", "Pending");
        });
    });

    describe("Admin", () => {
        beforeEach(() => {
            // Log in user
            login("thisisanother@email.com", "kibandaskiAdmin");
        });

        it("can acknowledge an order", () => {
            // Go to orders page
            cy.get(".iconHome").click();
            cy.intercept("GET", "/api/admin/orders").as("getOrders");
            cy.get(":nth-child(3) > a").click();

            // Acknowledge order
            cy.wait("@getOrders");
            cy.findByText(orderId).should("exist");

            cy.get(".status").should("have.text", "Pending");
            cy.findByRole("button", { name: /acknowledge order/i }).click();

            cy.wait("@getOrders");
            cy.get(".status").should("have.text", "Acknowledged");
        });

        it("can add a product", () => {
            // Go to products page
            cy.get(".iconHome").click();
            cy.get(":nth-child(3) > a").click();
    
            cy.intercept("GET", "/api/customer/products").as("getProducts");
            cy.get(".admin > nav > ul > :nth-child(2) > a").click();
            cy.wait("@getProducts");
    
            cy.get(".sort > button").click();
    
            // Add new product
            let name = "Smocha";
            cy.get("#name").clear();
            cy.get("#name").type(name);
    
            cy.get("#price").clear();
            cy.get("#price").type("50");
    
            let description = "A smokie with kachumbari and sauces of your choice wrapped in one of our delicious chapatis.";
            cy.get("#description").clear();
            cy.get("#description").type(description);
            
            cy.get("#category").clear();
            cy.get("#category").type("Snacks");
    
            cy.intercept("POST", "/api/admin/products").as("addProduct");
            cy.get("[type=submit]").click();
            cy.wait("@addProduct");
    
            // Verify existence of new product
            cy.wait("@getProducts");
            cy.intercept("GET", "/api/customer/products/categories").as("getCategories");
            cy.wait("@getCategories");
    
            cy.get("#category").select("snacks");
            cy.findByText(name).should("exist");
            cy.findByText(description).should("exist");
        });
    });
})