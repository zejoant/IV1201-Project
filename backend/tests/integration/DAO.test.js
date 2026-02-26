"use strict";

const DAO = require("../../src/integration/DAO");
const WError = require("verror").WError;

// Mock all Sequelize models
jest.mock("../../src/models/Person");
jest.mock("../../src/models/JobApplication");
jest.mock("../../src/models/CompetenceProfile");
jest.mock("../../src/models/Availability");
jest.mock("../../src/models/Competence");

const Person = require("../../src/models/Person");
const JobApplication = require("../../src/models/JobApplication");
const CompetenceProfile = require("../../src/models/CompetenceProfile");
const Availability = require("../../src/models/Availability");
const Competence = require("../../src/models/Competence");

/**
 * Unit test suite for the DAO (Data Access Object).
 *
 * This suite validates that the DAO:
 * - Interacts correctly with Sequelize models
 * - Handles errors properly using WError
 * - Returns valid DTOs
 * - Enforces input validation rules
 *
 * All database models are mocked to isolate DAO behavior.
 */
describe("DAO Unit Tests", () => {
  /** @type {DAO} DAO instance under test */
  let dao;

  /**
   * Reset mocks and initialize a fresh DAO instance
   * before each test.
   */
  beforeEach(() => {
    jest.clearAllMocks();
    dao = new DAO();
  });

  /**
   * Test suite for DAO.findUser().
   */
  describe("findUser", () => {
    /**
     * Returns a PersonDTO when the user exists.
     */
    test("should return PersonDTO if user exists", async () => {
      const mockPerson = {person_id: 1, name: "Britta", surname: "Ann Marie", pnr: "123456789012", email: "Britta@gmail.com", password: "password123", role_id: 1, username: "BrittaAnn"};

      Person.findOne.mockResolvedValue(mockPerson);

      const result = await dao.findUser("BrittaAnn");

      expect(result).toHaveProperty("person_id", 1);
      expect(Person.findOne).toHaveBeenCalledWith({ where: { username: "BrittaAnn" } });
    });

    /**
     * Returns null when no matching user is found.
     */
    test("should return null if user does not exist", async () => {
      Person.findOne.mockResolvedValue(null);

      const result = await dao.findUser("nonexistent");

      expect(result).toBeNull();
    });
  });

  /**
   * Test suite for DAO.createPerson().
   */
  describe("createPerson", () => {
    /**
     * Creates a new user and returns a PersonDTO
     * when the username is not already taken.
     */
    test("should create and return a PersonDTO", async () => {
      const mockInput = {name: "Berra", surname: "Olsvenne", pnr: "123456789012", email: "Berra@gmail.com", username: "BerraOlsvenne", password: "password123", role_id: 1};

      Person.findOne.mockResolvedValue(null);
      Person.create.mockResolvedValue({ ...mockInput, person_id: 1 });

      const result = await dao.createPerson(mockInput);

      expect(result).toHaveProperty("person_id", 1);
      expect(Person.create).toHaveBeenCalledWith(expect.objectContaining(mockInput));
    });

    /**
     * Throws a WError when attempting to create
     * a user that already exists.
     */
    test("should throw WError if user exists", async () => {
      const mockInput = {name: "Berra", surname: "Olsvenne", pnr: "123456789012", email: "Berra@gmail.com", username: "BerraOlsvenne", password: "pass", role_id: 1};

      Person.findOne.mockResolvedValue(mockInput);

      await expect(dao.createPerson(mockInput)).rejects.toThrow(WError);
    });
  });

  /**
   * Test suite for DAO.findUserById().
   */
  describe("findUserById", () => {
    /**
     * Returns a user when a valid ID is provided.
     */
    test("should return a user if found", async () => {
      const mockPerson = {person_id: 1};

      Person.findByPk.mockResolvedValue(mockPerson);

      const result = await dao.findUserById(1);

      expect(result).toEqual(mockPerson);
      expect(Person.findByPk).toHaveBeenCalledWith(1);
    });

    /**
     * Throws a WError for invalid IDs.
     */
    test("should throw WError on invalid input", async () => {
      await expect(dao.findUserById(-1)).rejects.toThrow(WError);
    });
  });

  /**
   * Test suite for DAO.submitApplication().
   */
  describe("submitApplication", () => {
    /**
     * Creates and returns a JobApplication record.
     */
    test("should create a JobApplication", async () => {
      const mockApp = {job_application_id: 1, person_id: 1, status: "unhandled"};

      JobApplication.create.mockResolvedValue(mockApp);

      const result = await dao.submitApplication(1, "unhandled");

      expect(result).toEqual(mockApp);
      expect(JobApplication.create).toHaveBeenCalledWith({person_id: 1, status: "unhandled"});
    });

    /**
     * Throws a WError if application status is invalid.
     */
    test("should throw WError if status invalid", async () => {
      await expect(dao.submitApplication(1, "invalid")).rejects.toThrow(WError);
    });
  });

  /**
   * Test suite for DAO.addExpertise().
   */
  describe("addExpertise", () => {
    /**
     * Creates and returns a CompetenceProfileDTO.
     */
    test("should create CompetenceProfileDTO", async () => {
      const mockExpertise = { competence_id: 1, yoe: 5 };
      const mockProfile = {competence_profile_id: 1, person_id: 1, competence_id: 1, years_of_experience: 5};

      CompetenceProfile.create.mockResolvedValue(mockProfile);

      const result = await dao.addExpertise(1, mockExpertise);

      expect(result).toHaveProperty("competence_profile_id", 1);
      expect(CompetenceProfile.create).toHaveBeenCalledWith({person_id: 1, competence_id: 1, years_of_experience: 5});
    });
  });

  /**
   * Test suite for DAO.addAvailability().
   */
  describe("addAvailability", () => {
    /**
     * Creates and returns an AvailabilityDTO.
     */
    test("should create AvailabilityDTO", async () => {
      const mockAvail = {from_date: "2026-01-01", to_date: "2026-01-31"};
      const mockAvaRecord = {availability_id: 1, person_id: 1, from_date: new Date(mockAvail.from_date), to_date: new Date(mockAvail.to_date)};

      Availability.create.mockResolvedValue(mockAvaRecord);

      const result = await dao.addAvailability(1, mockAvail);

      expect(result).toHaveProperty("availability_id", 1);
      expect(Availability.create).toHaveBeenCalled();
    });
  });

  /**
   * Test suite for DAO.getCompetence().
   */
  describe("getCompetence", () => {
    /**
     * Returns an array of CompetenceDTO objects.
     */
    test("should return array of CompetenceDTO", async () => {
      const comps = [{competence_id: 1, name: "ticket sales"}, {competence_id: 2, name: "lotteries"}];

      Competence.findAll.mockResolvedValue(comps);

      const result = await dao.getCompetence();

      expect(result.length).toBe(2);
      expect(Competence.findAll).toHaveBeenCalled();
    });
  });

  /**
   * Test suite for DAO.listApplications().
   */
  describe("listApplications", () => {
    /**
     * Returns an array of JobApplicationDTO objects.
     */
    test("should return array of JobApplicationDTO", async () => {
      const apps = [{job_application_id: 1, person_id: 1, status: "unhandled"}];

      JobApplication.findAll.mockResolvedValue(apps);

      const result = await dao.listApplications();

      expect(result.length).toBe(1);
      expect(JobApplication.findAll).toHaveBeenCalled();
    });
  });

  /**
   * Test suite for DAO.updateApplication().
   */
  describe("updateApplication", () => {
    /**
     * Updates application status and returns
     * the number of affected rows.
     */
    test("should call JobApplication.update", async () => {
      JobApplication.update.mockResolvedValue([1]); // affected rows

      const result = await dao.updateApplication({job_application_id: 1, status: "accepted"});

      expect(result).toEqual([1]);
      expect(JobApplication.update).toHaveBeenCalledWith({status: "accepted"}, {where: {job_application_id: 1}});
    });
  });
});