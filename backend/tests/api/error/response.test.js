"use strict";

const ErrorResponseSender = require("../../../src/api/error/ErrorResponseSender");

/**
 * Unit tests for the ErrorResponseSender class.
 * Validates that errors are properly logged and sent
 * as standardized JSON responses to the client.
 */

describe("ErrorResponseSender", () => {

  /** @type {ErrorResponseSender} */
  let handler;

  /** @type {Object} Mock Express app */
  let app;

  /** @type {Object} Mock response object */
  let res;

  beforeEach(() => {
    handler = new ErrorResponseSender();

    app = { use: jest.fn() };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      headersSent: false,
    };

    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * Test that the registerHandler adds error-handling middleware
   * and sends error responses with 500 status.
   */
  test("registerHandler sends error response", () => {
    handler.registerHandler(app);

    expect(app.use).toHaveBeenCalledWith(handler.path, expect.any(Function));
    const middleware = app.use.mock.calls[0][1];

    const err = new Error("Something failed");
    const req = {};
    const next = jest.fn();

    middleware(err, req, res, next);

    expect(console.error).toHaveBeenCalledWith(err);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ error: "Something failed" });
  });

  /**
   * Test that jse_shortmsg takes precedence over err.message
   */
  test("registerHandler uses jse_shortmsg if present", () => {
    handler.registerHandler(app);
    const middleware = app.use.mock.calls[0][1];

    const err = new Error("Original message");
    err.jse_shortmsg = "Short message";

    middleware(err, {}, res, jest.fn());

    expect(res.send).toHaveBeenCalledWith({ error: "Short message" });
  });

  /**
   * Test that middleware calls next(err) if headers are already sent
   */
  test("registerHandler calls next if headersSent", () => {
    handler.registerHandler(app);
    const middleware = app.use.mock.calls[0][1];

    res.headersSent = true;
    const next = jest.fn();
    const err = new Error("Any error");

    middleware(err, {}, res, next);

    expect(next).toHaveBeenCalledWith(err);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});