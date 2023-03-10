const { defineConfig } = require("cypress");

module.exports = defineConfig({
    env: {
        apiUrl: "http://localhost:8000",
    },
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        baseUrl: "http://localhost:8000",
        specPattern: "src/tests/e2e/**/*.cy.{js,jsx,ts,tsx}",
        experimentalStudio: true
    },
});