"use strict";

jest.mock("../../src/api/AccountApi");
jest.mock("../../src/api/ApplicationApi");
jest.mock("../../src/api/error/ErrorResponseSender");

const AccountApi = require("../../src/api/AccountApi");
const ApplicationApi = require("../../src/api/ApplicationApi");
const ErrorResponseSender = require("../../src/api/error/ErrorResponseSender");
const loader = require("../../src/api");

/**
 * Test suite for RequestHandlerLoader.
 * This suite verifies that request and error handlers
 * are correctly added, loaded, and integrated with an Express app.
 */
describe("RequestHandlerLoader", () => {
  /** @type {Object} Mock Express app */
  let app;

  /** @type {Object} Mock Account API handler instance */
  let mockAccountApi;

  /** @type {Object} Mock Application API handler instance */
  let mockApplicationApi;

  /** @type {Object} Mock Error handler instance */
  let mockErrorHandler;

  /**
   * Reset mocks and prepare mock instances before each test.
   * Mocks AccountApi, ApplicationApi, and ErrorResponseSender.
   */
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Express app with a `use` method
    app = {use: jest.fn()};

    // Mock Account API handler
    mockAccountApi = {registerHandler: jest.fn(), path: "/account", router: "accountRouter"};
    AccountApi.mockImplementation(() => mockAccountApi);

    // Mock Application API handler
    mockApplicationApi = {registerHandler: jest.fn(), path: "/application", router: "applicationRouter"};
    ApplicationApi.mockImplementation(() => mockApplicationApi);

    // Mock Error handler
    mockErrorHandler = { registerHandler: jest.fn() };
    ErrorResponseSender.mockImplementation(() => mockErrorHandler);
  });

  /**
   * Test that addRequestHandler adds a request handler
   * to the loader's internal collection.
   */
  test("addRequestHandler adds handler to collection", () => {
    loader.addRequestHandler(mockAccountApi);

    expect(loader.reqHandlers).toContain(mockAccountApi);
  });

  /**
   * Test that addErrorHandler adds an error handler
   * to the loader's internal collection.
   */
  test("addErrorHandler adds handler to collection", () => {
    loader.addErrorHandler(mockErrorHandler);

    expect(loader.errorHandlers).toContain(mockErrorHandler);
  });

  /**
   * Test that loadHandlers:
   * 1. Calls registerHandler on each request handler.
   * 2. Mounts the handler routers on the Express app.
   */
  test("loadHandlers registers all request handlers and mounts routers", () => {
    loader.addRequestHandler(mockAccountApi);
    loader.addRequestHandler(mockApplicationApi);
    loader.loadHandlers(app);

    // Ensure each handler's registerHandler was called
    expect(mockAccountApi.registerHandler).toHaveBeenCalled();
    expect(mockApplicationApi.registerHandler).toHaveBeenCalled();

    // Ensure routers are mounted on Express app
    expect(app.use).toHaveBeenCalledWith("/account", "accountRouter");
    expect(app.use).toHaveBeenCalledWith("/application", "applicationRouter");
  });

  /**
   * Test that loadErrorHandlers registers all error handlers
   * on the Express app.
   */
  test("loadErrorHandlers registers all error handlers", () => {
    loader.addErrorHandler(mockErrorHandler);
    loader.loadErrorHandlers(app);

    expect(mockErrorHandler.registerHandler).toHaveBeenCalledWith(app);
  });

  /**
   * Integration test: verifies that the loader creates
   * instances of all request and error handlers correctly.
   */
  test("integration: loader creates instances correctly", () => {
    const loaderModule = require("../../src/api");

    // Check that loader collections contain instances of the correct classes
    expect(loaderModule.reqHandlers[0]).toBeInstanceOf(AccountApi);
    expect(loaderModule.reqHandlers[1]).toBeInstanceOf(ApplicationApi);
    expect(loaderModule.errorHandlers[0]).toBeInstanceOf(ErrorResponseSender);
  });
});