const { defineConfig } = require("cypress");
const { execSync } = require("child_process");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.js",
    setupNodeEvents(on) {
      on("task", {
        "db:reset": () => {
          execSync("npx cross-env NODE_ENV=test node backend/src/util/seed.js", { stdio: "inherit" });
          return null;
        },
      });
    },
  },
});