const ApplicationApi = require("../../src/api/ApplicationApi");
const Authorization = require("../../src/api/auth/Authorization");
const { validationResult } = require("express-validator");

jest.mock("../../src/api/auth/Authorization");
jest.mock("express-validator");

describe("ApplicationApi", () => {
  let api;
  let mockController;
  let mockSendResponse;

  beforeEach(async () => {
    api = new ApplicationApi();

    // Mock controller with dummy functions
    mockController = {
      createApplication: jest.fn(),
      getCompetence: jest.fn(),
      listApplications: jest.fn(),
      getApplication: jest.fn(),
      updateApplication: jest.fn(),
    };
    api.contr = mockController;

    // Mock sendResponse
    mockSendResponse = jest.fn();
    api.sendResponse = mockSendResponse;

    // Default authorization: always true
    Authorization.checkLogin.mockResolvedValue(true);
    Authorization.checkRecruiter.mockResolvedValue(true);

    // Default validationResult
    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
    await api.registerHandler();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /apply", () => {
    it("submits a new application successfully", async () => {
      const req = {
        body: {
          expertise: [{ competence_id: 1, yoe: 2 }],
          availability: [{ from_date: "2026-01-01", to_date: "2026-01-10" }],
        },
        user: { id: 5 },
      };
      const res = {};

      mockController.createApplication.mockResolvedValue("fake_app");

      // Extract the handler
      const handler = api.router.stack.find(l => l.route?.path === "/apply").route.stack[0].handle;

      await handler(req, res);

      expect(mockController.createApplication).toHaveBeenCalledWith(
        req.body.expertise,
        req.body.availability,
        req.user.id
      );
      expect(mockSendResponse).toHaveBeenCalledWith(res, 200, "sent application");
    });

    it("returns 400 when validation fails", async () => {
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: "error" }],
      });

      const req = { body: {} };
      const res = {};

      const handler = api.router.stack.find(l => l.route?.path === "/apply").route.stack[0].handle;

      await handler(req, res);

      expect(mockSendResponse).toHaveBeenCalledWith(res, 400, [{ msg: "error" }]);
    });
  });

  /*describe("GET /list_competences", () => {
    it("returns competences", async () => {
      const req = {};
      const res = {};
      mockController.getCompetence.mockResolvedValue([{ name: "JavaScript" }]);

      const handler = api.router.stack.find(l => l.route?.path === "/list_competences").route.stack[0].handle;

      await handler(req, res);

      expect(mockController.getCompetence).toHaveBeenCalled();
      expect(mockSendResponse).toHaveBeenCalledWith(res, 200, [{ name: "JavaScript" }]);
    });
  });

  describe("GET /list_applications", () => {
    it("returns applications", async () => {
      const req = {};
      const res = {};
      mockController.listApplications.mockResolvedValue([{ person_id: 1, name: "Alice" }]);

      const handler = api.router.stack.find(l => l.route?.path === "/list_applications").route.stack[0].handle;

      await handler(req, res);

      expect(mockController.listApplications).toHaveBeenCalled();
      expect(mockSendResponse).toHaveBeenCalledWith(res, 200, [{ person_id: 1, name: "Alice" }]);
    });
  });

  describe("POST /get_application", () => {
    it("returns a specific application", async () => {
      const req = { body: { job_application_id: 1, person_id: 1, status: "unhandled", name: "Bob", surname: "Smith" } };
      const res = {};
      mockController.getApplication.mockResolvedValue({ id: 1, name: "Bob" });

      const handler = api.router.stack.find(l => l.route?.path === "/get_application").route.stack[0].handle;

      await handler(req, res);

      expect(mockController.getApplication).toHaveBeenCalledWith(req.body);
      expect(mockSendResponse).toHaveBeenCalledWith(res, 200, { id: 1, name: "Bob" });
    });
  });

  describe("PATCH /update_application", () => {
    it("updates application status", async () => {
      const req = { body: { job_application_id: 1, status: "accepted" } };
      const res = {};
      mockController.updateApplication.mockResolvedValue([1]);

      const handler = api.router.stack.find(l => l.route?.path === "/update_application").route.stack[0].handle;

      await handler(req, res);

      expect(mockController.updateApplication).toHaveBeenCalledWith(req.body);
      expect(mockSendResponse).toHaveBeenCalledWith(res, 200, [1]);
    });
  });*/
});