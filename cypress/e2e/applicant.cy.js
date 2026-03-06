/**
 * End-to-End (E2E) tests for applicant-related flows:
 * - Registering with invalid and valid data
 * - Logging in
 * - Filling out and submitting the application form
 * - Validating error messages for invalid inputs
 *
 * These tests simulate real user behavior in the application.
 */
describe("Applicant Acceptance Tests", () => {
    /**
      * Reset the test database before the test suite runs
      */
    before(() => {
        cy.task("db:reset");
    });

    /**
     * Runs before each test.
     * Visits the home page and sets the application language to "cimode" for testing translation keys.
     */
    beforeEach(() => {
        cy.visit("/", {
            onBeforeLoad(win) {
                win.localStorage.setItem("language", "cimode");
            },
        });
    });

    /**
     * Test case: Attempt to register a new user with an invalid password.
     * Steps:
     * 1. Navigate to the register page.
     * 2. Fill the form with valid user data but short password.
     * 3. Submit the form.
     * Expected outcome:
     * - Displays an error message for invalid password length.
     */
    it("should go to register page and fail to create a new user", () => {
        cy.contains("login.sign_up").click();

        cy.get("form").within(() => {
            cy.get('input[name="name"]').should("exist");
            cy.get('input[name="surname"]').should("exist");
        });

        cy.get('input[name="name"]').type("Berra");
        cy.get('input[name="surname"]').type("Gjertrud");
        cy.get('input[name="email"]').type("Berra@test.com");
        cy.get('input[name="pnr"]').type("199803031234");
        cy.get('input[name="username"]').type("BerraGjertrud");
        cy.get('input[name="password"]').type("pass1");

        cy.get('button[type="submit"]').click();

        cy.contains("sign_up.errors.invalid_password_length").should("exist");
    });

    /**
     * Test case: Register a new user with valid data.
     * Steps:
     * 1. Navigate to the register page.
     * 2. Fill the form with valid user information.
     * 3. Submit the form.
     * Expected outcome:
     * - Registration succeeds and displays a success alert.
     */
    it("should go to register page and create a new user", () => {
        cy.contains("login.sign_up").click();

        cy.get("form").within(() => {
            cy.get('input[name="name"]').should("exist");
            cy.get('input[name="surname"]').should("exist");
        });

        cy.get('input[name="name"]').type("Agda");
        cy.get('input[name="surname"]').type("Olsvenne");
        cy.get('input[name="email"]').type("AgdaOlsvenne@test.com");
        cy.get('input[name="pnr"]').type("199001011234");
        cy.get('input[name="username"]').type("AgdaOlsvenne");
        cy.get('input[name="password"]').type("StrongPass123!");

        cy.get('button[type="submit"]').click();

        // Success message
        cy.contains("register.alerts.success", { matchCase: false }).should("exist");
    });

    /**
     * Test case: Login and validate error handling on the application form.
     * Steps:
     * 1. Log in as an applicant.
     * 2. Navigate to the application form via "Apply Now".
     * 3. Fill invalid values (e.g., negative experience, overlapping availability periods).
     * Expected outcome:
     * - Shows appropriate validation error messages.
     */
    it("should login and check errors on apply page", () => {
        //login
        cy.get('input[name="username"]').type("testPersonB");
        cy.get('input[name="password"]').type("password123");
        cy.get('button[type="submit"]').click();
        cy.contains(`personPage.welcome_title testPersonB!`).should("exist");
        cy.contains("personPage.welcome_subtitle").should("exist");

        //go to apply page
        cy.get(".personpage-action-button").contains("personPage.actions.apply_now").click();
        cy.contains("applicationForm.title").should("exist");

        //fill competence
        cy.get("select").select(1);
        cy.get('input[type="number"]').type("-1");
        cy.get(".application-add-button").contains("applicationForm.buttons.add_competence").click();

        //check invalid years of experience
        cy.contains("applicationForm.errors.experience_positive").should("exist");

        //fill availability
        const today = new Date().toISOString().split("T")[0];
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        cy.get('input[name="fromDate"]').type(today);
        cy.get('input[name="toDate"]').type(nextWeek);
        cy.get(".application-add-button").contains("applicationForm.buttons.add_period").click();

        cy.get('input[name="fromDate"]').type(today);
        cy.get('input[name="toDate"]').type(nextWeek);
        cy.get(".application-add-button").contains("applicationForm.buttons.add_period").click();

        //check overlapp error
        cy.contains("applicationForm.errors.overlapping_period").should("exist");

    });

    /**
     * Test case: Login and successfully submit an application.
     * Steps:
     * 1. Log in as an applicant.
     * 2. Navigate to the application form.
     * 3. Fill in valid competencies and availability periods.
     * 4. Submit the form.
     * Expected outcome:
     * - Application submits successfully and success message is displayed.
     */
    it("should login and apply", () => {
        //login
        cy.get('input[name="username"]').type("testPersonB");
        cy.get('input[name="password"]').type("password123");
        cy.get('button[type="submit"]').click();
        cy.contains(`personPage.welcome_title testPersonB!`).should("exist");
        cy.contains("personPage.welcome_subtitle").should("exist");

        //go to apply page
        cy.get(".personpage-action-button").contains("personPage.actions.apply_now").click();
        cy.contains("applicationForm.title").should("exist");

        //fill competence
        cy.get("select").select(1);
        cy.get('input[type="number"]').type("3");
        cy.get(".application-add-button").contains("applicationForm.buttons.add_competence").click();

        //fill availability
        const today = new Date().toISOString().split("T")[0];
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        cy.get('input[name="fromDate"]').type(today);
        cy.get('input[name="toDate"]').type(nextWeek);
        cy.get(".application-add-button").contains("applicationForm.buttons.add_period").click();

        //submit form
        cy.get('button[type="submit"]').contains("applicationForm.buttons.submit").click();
        cy.contains("applicationForm.success.submitted").should("exist");
    });
});