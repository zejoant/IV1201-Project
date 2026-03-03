import i18n from '../../frontend/src/i18n';

describe("Login Acceptance Tests", () => {
  before(() => {
    // Force i18n into "cimode" so translation keys are shown
    i18n.init({
      lng: "cimode",
    });
  });
  
  beforeEach(() => {
    // Reset and seed the test database before each test
    cy.task("db:reset");
  });

  it("should allow a valid employer to log in", () => {
    // Visit login page
    cy.visit("/");

    // Type username and password
    cy.get('input[name="username"]').type("testPersonA");
    cy.get('input[name="password"]').type("password123");
    //cy.get('input[name="username"]').type("HashMan");
    //cy.get('input[name="password"]').type("HashMan123");

    // Submit form
    cy.get('button[type="submit"]').click();

    //cy.get("main").within(() => {
    //  cy.contains("Recruiter Dashboard").should("exist");
  //});

    // Check welcome text appears
    cy.contains("Applications Dashboard").should("exist");
  });

  it("should allow a valid applicant to log in and view profile", () => {
    cy.visit("/");

    cy.get('input[name="username"]').type("testPersonB");
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    // Applicants don’t go to /recruiter, so should see profile
    //cy.contains(/Applicant|Sökande/).should("exist"); // adjust selector to match PersonPage header
    cy.contains('Manage your profile and applications from here.').should("exist");
  });

  it("should show error for invalid credentials", () => {
    cy.visit("/");

    cy.get('input[name="username"]').type("wronguser");
    cy.get('input[name="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();

    // Check error alert
    cy.contains("Invalid username or password").should("exist");
  });

  it("should switch to register view when clicking sign up", () => {
    cy.visit("/");

    cy.contains("Sign up").click();

    // Register form should appear
    cy.get("form").within(() => {
      cy.get('input[name="name"]').should("exist");
      cy.get('input[name="surname"]').should("exist");
    });
  });
});