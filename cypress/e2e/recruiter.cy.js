/**
 * @file Recruiter Acceptance Tests
 * @description End-to-end tests for recruiter functionality, including login and application status updates.
 */
describe("Recruiter Acceptance Tests", () => {

    /**
     * Runs once before all tests in this suite.
     * Resets the database to a clean state using a Cypress task.
     */
    before(() => {
        cy.task("db:reset");
    });

    /**
     * Runs before each individual test.
     * Visits the home page and sets the language to 'cimode' for testing translations/localization.
     */
    beforeEach(() => {
        cy.visit("/", {
            onBeforeLoad(win) {
                win.localStorage.setItem("language", "cimode");
            },
        });
    });

    /**
     * Tests that a recruiter can log in and change the status of a job application.
     *
     * Steps:
     * 1. Log in as recruiter (testPersonA).
     * 2. Verify recruiter dashboard loads and unhandled applications exist.
     * 3. Click on a job application to view its details.
     * 4. Change application status to accepted.
     * 5. Verify that status is updated in both detail view and dashboard.
     */
    it("should login as recruiter and change status of application", () => {
        //login as recruiter
        cy.get('input[name="username"]').type("testPersonA");
        cy.get('input[name="password"]').type("password123");
        cy.get('button[type="submit"]').click();

        cy.contains(`recruiterDashboard.title`).should("exist");
        cy.contains("recruiterDashboard.status.unhandled").should("exist");

        //click job application
        cy.get('#root td:nth-child(2)').click();
        cy.contains("applicationDetail.title").should("exist");

        //change status
        cy.get('#root button.accept').click().then(() => {
            cy.contains("applicationDetail.status.accepted", { matchCase: false }).should("exist");

            //go back out and check status
            cy.get('#root button.recruiter-detail-back-button').click();
            cy.contains("recruiterDashboard.status.accepted").should("exist");
        });
    });
});