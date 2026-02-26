"use strict";

const jwt = require("jsonwebtoken");
const Authorization = require("../../../src/api/auth/Authorization");

// Mock environment variable for JWT secret
process.env.JWT_SECRET = "testsecret";

jest.mock("jsonwebtoken");

/**
 * Test suite for the Authorization utility.
 * 
 * This suite covers:
 * 1. Sending JWT cookies.
 * 2. Checking login sessions.
 * 3. Validating recruiter permissions.
 * 4. Deleting JWT cookies.
 */
describe("Authorization Utility", () => {
  /** @type {Object} Mock response object */
  let res;

  /** @type {Object} Mock request object */
  let req;

  /**
   * Reset mocks before each test.
   * Initializes a fresh request and response object.
   */
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock response object with chainable methods
    res = {cookie: jest.fn(), clearCookie: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn()};

    // Mock request object with cookies
    req = {cookies: {}};
  });

  /**
   * Test suite for Authorization.sendCookie method.
   */
  describe("sendCookie", () => {
    /**
     * Should generate a JWT token using the provided user
     * data and set it as a cookie in the response.
     */
    test("should call jwt.sign and set cookie", () => {
      jwt.sign.mockReturnValue("mockToken");

      const person = {person_id: 1, username: "testuser"};

      Authorization.sendCookie(person, res);

      expect(jwt.sign).toHaveBeenCalledWith({id: 1, username: "testuser"}, process.env.JWT_SECRET, {expiresIn: "1h"});
      expect(res.cookie).toHaveBeenCalledWith("auth", "mockToken", {httpOnly: true, maxAge: 3600 * 1000});
    });
  });

  /**
   * Test suite for Authorization.checkLogin method.
   */
  describe("checkLogin", () => {
    /**
     * Returns false and sends 403 if no auth cookie is present.
     */
    test("should return false if no auth cookie", async () => {
      const result = await Authorization.checkLogin(req, res);

      expect(result).toBe(false);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: "auth.login_session_invalid" });
    });

    /**
     * Returns true and sets req.user if JWT token is valid.
     */
    test("should return true and set req.user if valid token", async () => {
      req.cookies.auth = "validToken";
      jwt.verify.mockReturnValue({ id: 1, username: "user" });

      const result = await Authorization.checkLogin(req, res);

      expect(result).toBe(true);
      expect(req.user).toEqual({ id: 1, username: "user" });
    });

    /**
     * Returns false, clears cookie, and sends 403 if JWT verification fails.
     */
    test("should return false and clear cookie if jwt.verify throws", async () => {
      req.cookies.auth = "invalidToken";
      jwt.verify.mockImplementation(() => {
        throw new Error("invalid");
      });

      const result = await Authorization.checkLogin(req, res);

      expect(result).toBe(false);
      expect(res.clearCookie).toHaveBeenCalledWith("auth");
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: "auth.user_login_expired" });
    });
  });

  /**
   * Test suite for Authorization.checkRecruiter method.
   */
  describe("checkRecruiter", () => {
    /** @type {Object} Mock controller with findUserById */
    let mockController;

    beforeEach(() => {
      mockController = {findUserById: jest.fn()};
    });

    /**
     * Returns false if no auth cookie is present.
     */
    test("should return false if no auth cookie", async () => {
      const result = await Authorization.checkRecruiter(mockController, req, res);

      expect(result).toBe(false);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({error: "auth.login_session_invalid"});
    });

    /**
     * Returns true if the user has a valid recruiter role.
     */
    test("should return true if valid recruiter", async () => {
      req.cookies.auth = "validToken";
      jwt.verify.mockReturnValue({id: 1, username: "user"});

      // role_id != 2 (2 = normal user, 1 = recruiter)
      mockController.findUserById.mockResolvedValue({role_id: 1});

      const result = await Authorization.checkRecruiter(mockController, req, res);

      await expect(result).toBe(true);
      expect(req.user).toEqual({id: 1, username: "user"});
    });

    /**
     * Returns false and clears cookie if role_id is 2 (permission denied).
     */
    test("should return false and clear cookie if role_id == 2 (permission denied)", async () => {
      req.cookies.auth = "validToken";
      jwt.verify.mockReturnValue({id: 1, username: "user"});

      mockController.findUserById.mockResolvedValue({role_id: 2});

      const result = await Authorization.checkRecruiter(mockController, req, res);

      await expect(result).toBe(false);
      expect(res.clearCookie).toHaveBeenCalledWith("auth");
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({error: "auth.permission_denied"});
    });

    /**
     * Returns false and clears cookie if JWT verification fails.
     */
    test("should return false and clear cookie if jwt.verify throws", async () => {
      req.cookies.auth = "invalidToken";
      jwt.verify.mockImplementation(() => { throw new Error("invalid"); });

      const result = await Authorization.checkRecruiter(mockController, req, res);

      await expect(result).toBe(false);
      expect(res.clearCookie).toHaveBeenCalledWith("auth");
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: "auth.user_login_expired" });
    });
  });

  /**
   * Test suite for Authorization.deleteCookie method.
   */
  describe("deleteCookie", () => {
    /**
     * Clears the auth cookie from the response.
     */
    test("should clear auth cookie", () => {
      Authorization.deleteCookie(res);

      expect(res.clearCookie).toHaveBeenCalledWith("auth");
    });
  });
});