"use strict";

const ErrorHandler = require("../../../src/api/error/ErrorHandler");
const Controller = require("../../../src/controller/Controller");

/**
 * Unit tests for the ErrorHandler class.
 * Ensures that the controller instance is correctly initialized
 * when `retrieveController` is called.
 */

/**
 * Test suite for the ErrorHandler class.
 *
 * @test {ErrorHandler}
 */
describe("ErrorHandler", () => {

  /** @type {ErrorHandler} */
  let handler;

  beforeEach(() => {handler = new ErrorHandler();
});

  /**
   * Test that retrieveController assigns a Controller instance to the handler.
   */
  test("retrieveController assigns Controller instance", async () => {

    const fakeController = { dummy: true };
    jest.spyOn(Controller, "makeController").mockResolvedValue(fakeController);

    await handler.retrieveController();

    expect(handler.contr).toBe(fakeController);

    Controller.makeController.mockRestore();
  });
});