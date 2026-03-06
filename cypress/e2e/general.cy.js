/**
 * End-to-End (E2E) tests for general application functionality:
 * - Logging in with invalid credentials
 * - Changing the application language
 * - Logging out of the application
 *
 * These tests simulate common user behaviors and validate expected outcomes.
 */

describe("General Acceptance Tests", () => {
    /**
     * Reset the test database before running the test suite.
     */
    before(() => {
        cy.task("db:reset");
    });

    /**
     * Runs before each test.
     * Visits the home page and sets the application language to "cimode"
     * to test translation keys.
     */
    beforeEach(() => {
        cy.visit("/", {
            onBeforeLoad(win) {
                win.localStorage.setItem("language", "cimode");
            },
        });
    });

    /**
     * Test case: Attempt to log in with invalid account credentials.
     * Steps:
     * 1. Fill in username and password with an invalid user.
     * 2. Submit the login form.
     * Expected outcome:
     * - Displays an error message indicating invalid credentials.
     */
    it("should not allow invalid account to login", () => {
        cy.get('input[name="username"]').type("testPersonD");
        cy.get('input[name="password"]').type("password123");
        // Submit form
        cy.get('button[type="submit"]').click();

        // Check welcome text appears
        cy.contains("sign_in.errors.invalid_credentials").should("exist")
    });

    /**
     * Test case: Change the application language.
     * Steps:
     * 1. Visit the home page with a specific language set in localStorage.
     * 2. Click the English language button and verify page content.
     * 3. Click the Swedish language button and verify page content.
     * Expected outcome:
     * - Text content changes according to the selected language.
     */
    it("should change language", () => {
        cy.visit("/", {
            onBeforeLoad(win) {
                win.localStorage.setItem("language", "en-US");
            },
        });

        cy.get(".lang-btn").contains("English").click();
        cy.contains("Välkommen tillbaka").should("exist")

        cy.get(".lang-btn").contains("Svenska").click();
        cy.contains("Welcome Back").should("exist")
    });

    /**
     * Test case: Log out of the application.
     * Steps:
     * 1. Log in with a valid applicant account.
     * 2. Verify welcome message is displayed.
     * 3. Click the logout button in the header.
     * Expected outcome:
     * - The login page is displayed after logout.
     */
    it("should log out", () => {
        //login
        cy.get('input[name="username"]').type("testPersonB");
        cy.get('input[name="password"]').type("password123");
        cy.get('button[type="submit"]').click();
        cy.contains(`personPage.welcome_title testPersonB!`).should("exist");
        cy.contains("personPage.welcome_subtitle").should("exist");

        //logout
        cy.get(".header-logout-button").contains("header.logout").click();
        cy.contains("login.title").should("exist")
    });
});