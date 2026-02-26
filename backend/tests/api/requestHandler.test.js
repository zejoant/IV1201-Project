"use strict";

const RequestHandler = require("../../src/api/RequestHandler");

/**
 * Test suite for the RequestHandler base class.
 * 
 * Covers the sendResponse() method to ensure proper HTTP response
 * formatting for success, error, empty, and validation array cases.
 */
describe("RequestHandler", () => {

  /** @type {RequestHandler} */
  let handler;

  /** @type {{status: jest.Mock, json: jest.Mock, end: jest.Mock}} */
  let res;

  /**
   * Set up a new RequestHandler instance and mock Express response
   * object before each test.
   */
  beforeEach(() => {
    handler = new RequestHandler();

    res = {status: jest.fn().mockReturnThis(), json: jest.fn(), end: jest.fn()};
  });

  /**
   * Test that sendResponse ends the response when body is empty.
   */
  test("ends response when body is empty", () => {
    handler.sendResponse(res, 204);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  /**
   * Test that sendResponse wraps successful responses in a `success` key.
   */
  test("wraps success responses", () => {
    handler.sendResponse(res, 200, "ok");

    expect(res.json).toHaveBeenCalledWith({success: "ok"});
  });

  /**
   * Test that sendResponse wraps error responses in an `error` key.
   */
  test("wraps error responses", () => {
    handler.sendResponse(res, 400, "bad");

    expect(res.json).toHaveBeenCalledWith({error: "bad"});
  });

  /**
   * Test that sendResponse extracts the first message from a validation error array.
   */
  test("extracts validation error message from array", () => {
    handler.sendResponse(res, 400, [{ msg: "invalid input" }]);

    expect(res.json).toHaveBeenCalledWith({error: "invalid input"});
  });
});