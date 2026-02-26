"use strict";

const request = require("supertest");
const express = require("express");
const bcrypt = require("bcrypt");
const AccountApi = require("../../src/api/AccountApi");

// Mock bcrypt
jest.mock("bcrypt");

// Mock Authorization
jest.mock("../../src/api/auth/Authorization", () => ({
  sendCookie: jest.fn(),
  deleteCookie: jest.fn(),
  checkLogin: jest.fn()
}));

const Authorization = require("../../src/api/auth/Authorization");

/**
 * Creates a mock controller object with stubbed methods.
 * @returns {Object} Mock controller with jest.fn() methods for login, createAccount, and findUserById.
 */
function createMockController() {
  return {
    login: jest.fn(),
    createAccount: jest.fn(),
    findUserById: jest.fn()
  };
}

/**
 * Sets up an Express app instance with the AccountApi routes.
 * @param {Object} mockController - The mocked controller to inject into the API.
 * @returns {Object} Express app instance.
 */
function setupApp(mockController) {
  const app = express();
  app.use(express.json());

  const api = new AccountApi();

  // Inject mocked controller
  api.contr = mockController;

  // Fake getController to avoid DB init
  api.getController = jest.fn();

  api.registerHandler();
  app.use("/account", api.router);
  return app;
}

describe("AccountApi Routes", () => {
  let app;
  let mockController;

  beforeEach(() => {
    jest.clearAllMocks();
    mockController = createMockController();
    app = setupApp(mockController);
  });

  /**
   * Tests for POST /account/sign_in route
   */
  describe("POST /account/sign_in", () => {
    /**
     * Successful login scenario.
     * Expects 200 status, bcrypt comparison, and sendCookie to be called.
     */
    test("200 - successful login", async () => {
      const fakeUser = {id: 1, username: "testuser", password: "hashed"};

      mockController.login.mockResolvedValue(fakeUser);
      bcrypt.compare.mockResolvedValue(true);

      const res = await request(app)
        .post("/account/sign_in")
        .send({username: "testuser", password: "password123"});

      expect(res.status).toBe(200);
      expect(mockController.login).toHaveBeenCalledWith("testuser");
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(Authorization.sendCookie).toHaveBeenCalled();
    });

    /**
     * Validation error scenario for short username/password.
     * Expects 400 status.
     */
    test("400 - validation error", async () => {
      const res = await request(app)
        .post("/account/sign_in")
        .send({username: "a", password: "123"});
      
      expect(res.status).toBe(400);
    });

    /**
     * User not found scenario.
     * Expects 401 status when controller returns null.
     */
    test("401 - user not found", async () => {
      mockController.login.mockResolvedValue(null);

      const res = await request(app)
        .post("/account/sign_in")
        .send({username: "testuser", password: "password123"});
      
      expect(res.status).toBe(401);
    });

    /**
     * Wrong password scenario.
     * Expects 401 status when bcrypt comparison fails.
     */
    test("401 - wrong password", async () => {
      mockController.login.mockResolvedValue({password: "hashed"});
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app)
        .post("/account/sign_in")
        .send({username: "testuser", password: "wrongpass"});
      
      expect(res.status).toBe(401);
    });
  });

  /**
   * Tests for POST /account/sign_up route
   */
  describe("POST /account/sign_up", () => {
    /**
     * Successful account creation scenario.
     * Expects 200 status, bcrypt hash, and createAccount call.
     */
    test("200 - successful signup", async () => {
      mockController.createAccount.mockResolvedValue({id: 1});

      bcrypt.hash.mockResolvedValue("hashedpass");

      const res = await request(app)
        .post("/account/sign_up")
        .send({name: "John", surname: "Doe", pnr: "199001011234", email: "john@test.com", username: "johndoe", password: "password123"});

      expect(res.status).toBe(200);
      expect(mockController.createAccount).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalled();
    });

    /**
     * Invalid input scenario.
     * Expects 400 status for invalid fields like short username or bad email.
     */
    test("400 - invalid input", async () => {
      const res = await request(app)
        .post("/account/sign_up")
        .send({name: "", surname: "", pnr: "123", email: "badmail", username: "a", password: "123"});

      expect(res.status).toBe(400);
    });

    /**
     * Account creation failure scenario.
     * Expects 401 status when controller returns null.
     */
    test("401 - account creation failed", async () => {
      mockController.createAccount.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hash");

      const res = await request(app)
        .post("/account/sign_up")
        .send({name: "John", surname: "Doe", pnr: "199001011234", email: "john@test.com", username: "johndoe", password: "password123"});

      expect(res.status).toBe(401);
    });
  });

  /**
   * Tests for POST /account/sign_out route
   */
  describe("POST /account/sign_out", () => {
    /**
     * Successful logout scenario.
     * Expects 200 status and deleteCookie to be called.
     */
    test("200 - successful logout", async () => {
      const res = await request(app).post("/account/sign_out");

      expect(res.status).toBe(200);
      expect(Authorization.deleteCookie).toHaveBeenCalled();
    });
  });

  /**
   * Tests for GET /account/id route
   */
  describe("GET /account/id", () => {
    /**
     * Successfully get logged-in user.
     * Expects 201 status and findUserById to be called with user id.
     */
    test("201 - get logged in user", async () => {
      Authorization.checkLogin.mockImplementation((req, res) => {
        req.user = {id: 1};
        return true;
      });

      mockController.findUserById.mockResolvedValue({id: 1, username: "testuser"});

      const res = await request(app).get("/account/id");

      expect(res.status).toBe(201);
      expect(mockController.findUserById).toHaveBeenCalledWith(1);
    });

    /**
     * User not logged in scenario.
     * Expects status other than 201.
     */
    test("401 - not logged in", async () => {
      Authorization.checkLogin.mockImplementation((req, res) => {
        res.status(401).json({ error: "unauthorized" });
        return false;
      });
      const res = await request(app).get("/account/id");
      expect(res.status).not.toBe(201);
    });

    /**
     * User not found scenario.
     * Expects 404 status when controller returns null.
     */
    test("404 - user not found", async () => {
      Authorization.checkLogin.mockImplementation((req, res) => {
        req.user = {id: 1};
        return true;
      });

      mockController.findUserById.mockResolvedValue(null);

      const res = await request(app).get("/account/id");

      expect(res.status).toBe(404);
    });
  });
});