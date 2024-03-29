const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "78sx41",
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        baseUrl: "http://localhost:8000",
        specPattern: "src/tests/e2e/**/*.cy.{js,jsx,ts,tsx}",
        experimentalStudio: true,
        video: false
    },
});