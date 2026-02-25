"use strict";

const Controller = require("../../src/controller/Controller");

// Mock Checker (validation layer)
jest.mock("../../src/util/Checkers", () => ({
  isLength: jest.fn(),
  isAlphaNumeric: jest.fn(),
  notEmptyString: jest.fn(),
  isAlpha: jest.fn(),
  isPositiveInteger: jest.fn(),
  isEmailString: jest.fn(),
  isInteger: jest.fn(),
  isNumberBetween: jest.fn(),
  isArray: jest.fn(),
  isMatches: jest.fn(),
}));

const Checker = require("../../src/util/Checkers");

describe("Controller Unit Tests (mockDAO)", () => {

  let controller;
  let mockDAO;
  let fakeTransactionManager;

  beforeEach(() => {

    // Fake transaction manager
    fakeTransactionManager = {
      transaction: jest.fn(async (callback) => {
        // simulate sequelize transaction
        return await callback({});
      }),
    };

    // Mock DAO = fake database
    mockDAO = {
      getTransactionManager: jest.fn(() => fakeTransactionManager),

      findUser: jest.fn(),
      createPerson: jest.fn(),
      findUserById: jest.fn(),
      addExpertise: jest.fn(),
      addAvailability: jest.fn(),
      submitApplication: jest.fn(),
      listApplications: jest.fn(),
      updateApplication: jest.fn(),
      getCompetence: jest.fn(),
      findAvaByUserId: jest.fn(),
      findCompByUserId: jest.fn(),
      findCompProfileByUserId: jest.fn(),
    };

    controller = new Controller(mockDAO);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });


  describe("login()", () => {

    it("returns user when login succeeds", async () => {

      const fakeUser = { person_id: 1, username: "john123" };

      mockDAO.findUser.mockResolvedValue(fakeUser);

      const result = await controller.login("john123");

      expect(Checker.isLength).toHaveBeenCalled();
      expect(Checker.isAlphaNumeric).toHaveBeenCalled();

      expect(mockDAO.findUser).toHaveBeenCalledWith("john123");
      expect(result).toEqual(fakeUser);

      expect(fakeTransactionManager.transaction)
        .toHaveBeenCalledTimes(1);
    });

    it("throws when validation fails", async () => {

      Checker.isLength.mockImplementation(() => {
        throw new Error("Invalid username");
      });

      await expect(controller.login("x"))
        .rejects
        .toThrow("Invalid username");

      expect(mockDAO.findUser).not.toHaveBeenCalled();
    });
  });

  describe("createAccount()", () => {

    it("creates a new user", async () => {

      const input = {
        name: "John",
        surname: "Doe",
        pnr: "199901011234",
        email: "john@test.com",
        username: "johnny",
        password: "password123",
        role_id: 2,
      };

      const fakeCreatedUser = { person_id: 10, ...input };

      mockDAO.createPerson.mockResolvedValue(fakeCreatedUser);

      const result = await controller.createAccount(input);

      expect(Checker.notEmptyString).toHaveBeenCalled();
      expect(Checker.isEmailString).toHaveBeenCalled();

      expect(mockDAO.createPerson)
        .toHaveBeenCalledWith(input);

      expect(result).toEqual(fakeCreatedUser);
    });
  });

  describe("findUserById()", () => {

    it("returns user from DAO", async () => {

      const fakeUser = { person_id: 5, name: "Alice" };

      mockDAO.findUserById.mockResolvedValue(fakeUser);

      const result = await controller.findUserById(fakeUser.person_id);

      expect(Checker.isPositiveInteger).toHaveBeenCalledWith(fakeUser.person_id, "person id");

      expect(mockDAO.findUserById).toHaveBeenCalledWith(fakeUser.person_id);

      expect(result).toEqual(fakeUser);
    });
  });

  describe("createApplication()", () => {
    it("create applications", async () => {

      const fakeExpertise = [{id: 1, exp: {competence_id: 1, yoe:1}}];
      const fakeAvailability = [{id: 1, availability: {from_date: "0000-00-00", to_date: "0000-00-00"}}];
      const fakeApplication = {job_application_id: 10, id: 1, status:"unhandled" }

      mockDAO.addExpertise.mockResolvedValue(fakeExpertise[0]);
      mockDAO.addAvailability.mockResolvedValue(fakeAvailability[0]);
      mockDAO.submitApplication.mockResolvedValue(fakeApplication);

      const result = await controller.createApplication(fakeExpertise, fakeAvailability, 1);

      expect(Checker.isArray).toHaveBeenCalledWith(fakeExpertise, 'expertise');
      expect(Checker.isLength).toHaveBeenCalledWith(fakeExpertise, 1, Number.MAX_SAFE_INTEGER, 'expertise');
      expect(Checker.isArray).toHaveBeenCalledWith(fakeAvailability, 'availability');
      expect(Checker.isLength).toHaveBeenCalledWith(fakeAvailability, 1, Number.MAX_SAFE_INTEGER, 'availability');
      expect(Checker.isPositiveInteger).toHaveBeenCalledWith(1, 'id');

      expect(mockDAO.addExpertise).toHaveBeenCalledWith(1, fakeExpertise[0]);
      expect(mockDAO.addAvailability).toHaveBeenCalledWith(1, fakeAvailability[0]);
      expect(mockDAO.submitApplication).toHaveBeenCalledWith(1, "unhandled");

      expect(result).toEqual(fakeApplication);
    })
  })

  describe("getApplication()", () => {
    it("retrieve application", async () => {

      const fakeExpertise = {competence_id: 1, person_id: 10, years_of_experience: 1};
      const fakeAvailability = {availability_id: 1, person_id: 10, from_date: "0000-00-00", to_date: "0000-00-00"};
      const fakeComp = {competence_id: 1, name: "ticket sales"};
      
      const fakeApplication = {job_application_id: 1, person_id: 10, status:"unhandled", name: "Bob", surname: "Bobber"};

      //create mock components
      mockDAO.findCompProfileByUserId.mockResolvedValue([fakeExpertise]);
      mockDAO.findAvaByUserId.mockResolvedValue([fakeAvailability]);
      mockDAO.findCompByUserId.mockResolvedValue(fakeComp);

      //tests getApplication in controller
      const result = await controller.getApplication(fakeApplication);

      //check that the Checker functions were called with the expected values
      expect(Checker.isPositiveInteger).toHaveBeenCalledWith(fakeApplication.job_application_id, 'job app id');
      expect(Checker.isPositiveInteger).toHaveBeenCalledWith(fakeApplication.person_id, 'person id');
      expect(Checker.isMatches).toHaveBeenCalledWith(fakeApplication.status, /^(unhandled|rejected|accepted)$/, 'status');
      expect(Checker.notEmptyString).toHaveBeenCalledWith(fakeApplication.name, 'name');
      expect(Checker.isAlpha).toHaveBeenCalledWith(fakeApplication.name, 'name');
      expect(Checker.notEmptyString).toHaveBeenCalledWith(fakeApplication.surname, 'surname');
      expect(Checker.isAlpha).toHaveBeenCalledWith(fakeApplication.surname, 'surname');

      //check if DAO functions were called with the expected values
      expect(mockDAO.findCompProfileByUserId).toHaveBeenCalledWith(fakeExpertise.person_id);
      expect(mockDAO.findAvaByUserId).toHaveBeenCalledWith(fakeAvailability.person_id);
      expect(mockDAO.findCompByUserId).toHaveBeenCalledWith(fakeComp.competence_id);

      expect(result).toEqual(fakeApplication);
    })
  })

  describe("updateApplication()", () => {
    it("updates the status of application", async () => {

      const fakeApplication = {job_application_id: 1, status: "unhandled"};

      //create mock components
      mockDAO.updateApplication.mockResolvedValue([1]);

      //tests updateApplication in controller
      const result = await controller.updateApplication(fakeApplication);

      //check that the Checker functions were called with the expected values
      expect(Checker.isMatches).toHaveBeenCalledWith(fakeApplication.status, /^(unhandled|rejected|accepted)$/, 'status');
      expect(Checker.isPositiveInteger).toHaveBeenCalledWith(fakeApplication.job_application_id, 'job app id');

      //check if DAO functions were called with the expected values
      expect(mockDAO.updateApplication).toHaveBeenCalledWith(fakeApplication);

      expect(result).toEqual([1]);
    })
  })

  describe("listApplications()", () => {

    it("list all applications", async () => {

      const fakeUser = {name: "John", surname: "Doe"};
      const fakeApplication = [{ person_id: 1, job_application_id: 100 }];

      mockDAO.listApplications.mockResolvedValue(fakeApplication);
      mockDAO.findUserById.mockResolvedValue(fakeUser);

      const result = await controller.listApplications();

      expect(result[0]).toMatchObject({person_id: 1, ...fakeUser});
      expect(mockDAO.findUserById).toHaveBeenCalledWith(1)});
  });

  describe("getCompetence()", () => {

    it("returns competence list", async () => {

      const fakeCompetences = [{ id: 1, name: "ticket sales" }];

      mockDAO.getCompetence.mockResolvedValue(fakeCompetences);

      const result = await controller.getCompetence();

      expect(result).toEqual(fakeCompetences);
      expect(mockDAO.getCompetence).toHaveBeenCalled();
    });
  });

});