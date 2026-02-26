"use strict";

/**
 * @file ApplicationApi route tests
 *
 * Integration-style tests for Application API routes using Express and Supertest.
 *
 * The tests verify:
 *  - Authentication behavior
 *  - Request validation
 *  - Controller interaction
 *  - HTTP status responses
 *
 * External dependencies such as Authorization and controllers are mocked
 * to isolate route-layer behavior.
 *
 * Frameworks:
 *  - Jest (testing & mocking)
 *  - Supertest (HTTP assertions)
 *  - Express (test server)
 */
const request = require("supertest");
const express = require("express");
const ApplicationApi = require("../../src/api/ApplicationApi");

/**
 * Mock Authorization middleware.
 *
 * checkLogin:
 *   Simulates user authentication.
 *
 * checkRecruiter:
 *   Simulates recruiter authorization checks.
 */
jest.mock("../../src/api/auth/Authorization", () => ({
  checkLogin: jest.fn(),
  checkRecruiter: jest.fn(),
}));

const Authorization = require("../../src/api/auth/Authorization");

/**
 * Creates a mocked Application controller.
 *
 * Each method represents database logic normally handled
 * by the controller layer. All functions are mocked so
 * behavior can be controlled inside tests.
 *
 * @returns {Object} mocked controller
 */
function createMockController() {
  return {
    createApplication: jest.fn(),
    getCompetence: jest.fn(),
    listApplications: jest.fn(),
    getApplication: jest.fn(),
    updateApplication: jest.fn(),
  };
}

/**
 * Creates an Express test application and registers routes.
 *
 * The real controller and DB initialization are bypassed.
 *
 * @param {Object} mockController mocked controller instance
 * @returns {Express.Application} configured test app
 */
function setupApp(mockController) {
  const app = express();
  app.use(express.json());

  const api = new ApplicationApi();

  // inject mocked controller
  api.contr = mockController;

  // avoid DB initialization
  api.getController = jest.fn();

  api.registerHandler();

  app.use("/application", api.router);

  return app;
}

/**
 * Test suite for ApplicationApi routes.
 */
describe("ApplicationApi Routes", () => {

  let app;
  let mockController;

  /**
   * Reset mocks and recreate application before each test.
   * Default authentication succeeds.
   */
  beforeEach(() => {
    jest.clearAllMocks();

    mockController = createMockController();
    app = setupApp(mockController);

    // default auth success
    Authorization.checkLogin.mockResolvedValue(true);
    Authorization.checkRecruiter.mockResolvedValue(true);
  });

  /**
   * POST /application/apply
   * Tests application submission flow.
   */
  describe("POST /application/apply", () => {

     /**
     * Should submit an application successfully when user is authenticated.
     *
     * Expected:
     *  - HTTP 200 response
     *  - createApplication controller called
     */
    test("200 - submit application successfully", async () => {
      Authorization.checkLogin.mockImplementation((req, res) => {
        req.user = { id: 10 }; // simulate logged-in user
        return true;
      });

      mockController.createApplication.mockResolvedValue({ id: 10 });

      const res = await request(app)
        .post("/application/apply")
        .send({
          expertise: [{ competence_id: 1, yoe: 2 }],
          availability: [{
            from_date: "2026-01-01",
            to_date: "2026-01-10"
          }]
        });

      expect(res.status).toBe(200);

      expect(mockController.createApplication)
        .toHaveBeenCalledWith(
          expect.any(Array),
          expect.any(Array),
          10
        );
    });

    /**
     * Should return 400 when validation fails.
     */
    test("400 - validation fails", async () => {
      const res = await request(app)
        .post("/application/apply")
        .send({}); // missing fields

      expect(res.status).toBe(400);
    });

    /**
     * Should return 401 when user is not logged in.
     */
    test("401 - not logged in", async () => {
      Authorization.checkLogin.mockImplementation((req, res) => {
        res.status(401).json("unauthorized");
        return false;
      });

      const res = await request(app)
        .post("/application/apply")
        .send({
          expertise: [{ competence_id: 1, yoe: 2 }],
          availability: [{ from_date: "2026-01-01", to_date: "2026-01-10" }]
        });

      expect(res.status).toBe(401);
    });
  });

  /**
   * GET /application/list_competences
   * Tests competence retrieval.
   */
  describe("GET /application/list_competences", () => {

    /**
     * Should return competences successfully.
     */
    test("200 - returns competences", async () => {
      mockController.getCompetence.mockResolvedValue([{ id: 1, name: "ticket sales" }]);

      const res = await request(app).get("/application/list_competences");

      expect(res.status).toBe(200);
      expect(mockController.getCompetence).toHaveBeenCalled();
    });

    /**
     * Should return 404 if no competences exist.
     */
    test("404 - no competences found", async () => {
      mockController.getCompetence.mockResolvedValue(null);

      const res = await request(app).get("/application/list_competences");

      expect(res.status).toBe(404);
    });
  });

  /**
   * GET /application/list_applications
   * Recruiter-only endpoint tests.
   */
  describe("GET /application/list_applications", () => {

    /**
     * Recruiter successfully retrieves applications.
     */
    test("200 - recruiter gets applications", async () => {

      mockController.listApplications.mockResolvedValue([{ id: 1, status: "unhandled" }]);

      const res = await request(app).get("/application/list_applications");

      expect(res.status).toBe(200);
      expect(mockController.listApplications).toHaveBeenCalled();
    });

    /**
     * Should return 401 if recruiter authorization fails.
     */
    test("401 - recruiter auth fails", async () => {
      Authorization.checkRecruiter.mockImplementation((c, req, res) => {
        res.status(401).json("unauthorized");
        return false;
      });

      const res = await request(app).get("/application/list_applications");

      expect(res.status).toBe(401);
    });
  });

  /**
   * POST /application/get_application
   * Tests fetching a single application.
   */
  describe("POST /application/get_application", () => {

    /**
     * Should return application when valid request is sent.
     */
    test("200 - returns application", async () => {
      mockController.getApplication.mockResolvedValue({id: 1,status: "unhandled"});

      const res = await request(app)
        .post("/application/get_application")
        .send({job_application_id: 1, person_id: 1, status: "unhandled", name: "John", surname: "Doe"});

      expect(res.status).toBe(200);
      expect(mockController.getApplication).toHaveBeenCalled();
    });

    /**
     * Should return 400 on validation failure.
     */
    test("400 - validation fails", async () => {
      const res = await request(app)
        .post("/application/get_application")
        .send({});

      expect(res.status).toBe(400);
    });
  });

  /**
   * PATCH /application/update_application
   * Tests updating application status.
   */
  describe("PATCH /application/update_application", () => {

    /**
     * Should update application status successfully.
     */
    test("200 - updates status", async () => {
      mockController.updateApplication.mockResolvedValue(1);

      const res = await request(app)
        .patch("/application/update_application")
        .send({job_application_id: 1, status: "accepted"});

      expect(res.status).toBe(200);
      expect(mockController.updateApplication)
        .toHaveBeenCalledWith({job_application_id: 1, status: "accepted"});
    });

    /**
     * Should return 400 when validation fails.
     */
    test("400 - validation error", async () => {
      const res = await request(app)
        .patch("/application/update_application")
        .send({job_application_id: "bad"});

      expect(res.status).toBe(400);
    });

    /**
     * Should return 404 when application does not exist.
     */
    test("404 - application not found", async () => {
      mockController.updateApplication.mockResolvedValue(null);

      const res = await request(app)
        .patch("/application/update_application")
        .send({job_application_id: 1,status: "accepted"});

      expect(res.status).toBe(404);
    });
  });
});