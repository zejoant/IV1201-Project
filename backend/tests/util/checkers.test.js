"use strict";

const Checker = require("../../src/util/Checkers");
const assert = require("assert");

describe("Checker Utility", () => {

  describe("isLength", () => {
    test("passes for valid length", () => {
      expect(() => Checker.isLength("hello", 1, 10, "test")).not.toThrow();
    });

    test("throws if too short or too long", () => {
      expect(() => Checker.isLength("", 1, 5, "test")).toThrow("test must be between 1 and 5");
      expect(() => Checker.isLength("abcdef", 1, 5, "test")).toThrow("test must be between 1 and 5");
    });
  });

  describe("isNumeric", () => {
    test("passes for numbers", () => {
      expect(() => Checker.isNumeric(42, "num")).not.toThrow();
    });

    test("throws for non-numbers", () => {
      expect(() => Checker.isNumeric("42", "num")).toThrow("num must be numerical");
    });
  });

  describe("isInteger", () => {
    test("passes for integers", () => {
      expect(() => Checker.isInteger(10, "val")).not.toThrow();
    });

    test("throws for floats or non-numbers", () => {
      expect(() => Checker.isInteger(2.5, "val")).toThrow("val must be integer");
      expect(() => Checker.isInteger("2", "val")).toThrow("val must be numerical");
    });
  });

  describe("isPositiveInteger", () => {
    test("passes for zero and positive integers", () => {
      expect(() => Checker.isPositiveInteger(0, "val")).not.toThrow();
      expect(() => Checker.isPositiveInteger(5, "val")).not.toThrow();
    });

    test("throws for negative or non-integers", () => {
      expect(() => Checker.isPositiveInteger(-1, "val")).toThrow("val must be positive integer");
      expect(() => Checker.isPositiveInteger(2.5, "val")).toThrow();
    });
  });

  describe("isString", () => {
    test("passes for strings", () => {
      expect(() => Checker.isString("abc", "val")).not.toThrow();
    });

    test("throws for non-strings", () => {
      expect(() => Checker.isString(123, "val")).toThrow("val must be a string");
    });
  });

  describe("isAlphaNumeric", () => {
    test("passes for alphanumeric strings", () => {
      expect(() => Checker.isAlphaNumeric("abc123", "val")).not.toThrow();
    });

    test("throws for non-alphanumeric", () => {
      expect(() => Checker.isAlphaNumeric("abc-123", "val")).toThrow("val must be alphanumeric");
    });
  });

  describe("notEmptyString", () => {
    test("passes for non-empty strings", () => {
      expect(() => Checker.notEmptyString("hello", "val")).not.toThrow();
    });

    test("throws for empty strings", () => {
      expect(() => Checker.notEmptyString("", "val")).toThrow("val must be non-empty string");
    });
  });

  describe("isEmailString", () => {
    test("passes for valid emails", () => {
      expect(() => Checker.isEmailString("test@example.com", "email")).not.toThrow();
    });

    test("throws for invalid emails", () => {
      expect(() => Checker.isEmailString("invalid-email", "email")).toThrow("email must be a email string");
    });
  });

  describe("isArray", () => {
    test("passes for arrays", () => {
      expect(() => Checker.isArray([], "val")).not.toThrow();
    });

    test("throws for non-arrays", () => {
      expect(() => Checker.isArray({}, "val")).toThrow("val must be an array");
    });
  });

  describe("isDateString", () => {
    test("passes for valid ISO 8601 date", () => {
      expect(() => Checker.isDateString("2026-02-26", "date")).not.toThrow();
    });

    test("throws for invalid date", () => {
      expect(() => Checker.isDateString("26-02-2026", "date")).toThrow("date must be a valid date format XXXX-XX-XX");
    });
  });

  describe("isMatches", () => {
    test("passes for matching regex", () => {
      expect(() => Checker.isMatches("accepted", /^(unhandled|rejected|accepted)$/, "status")).not.toThrow();
    });

    test("throws for non-matching", () => {
      expect(() => Checker.isMatches("pending", /^(unhandled|rejected|accepted)$/, "status")).toThrow("status must be valid status format");
    });
  });

  describe("isAlpha", () => {
    test("passes for letters only", () => {
      expect(() => Checker.isAlpha("abc", "val")).not.toThrow();
    });

    test("throws for non-letter characters", () => {
      expect(() => Checker.isAlpha("abc123", "val")).toThrow("val must only contain letters");
    });
  });

  describe("isNumberBetween", () => {
    test("passes for numbers in range", () => {
      expect(() => Checker.isNumberBetween(5, 1, 10, "val")).not.toThrow();
    });

    test("throws for numbers out of range", () => {
      expect(() => Checker.isNumberBetween(0, 1, 10, "val")).toThrow("val must be between 1 and 10");
      expect(() => Checker.isNumberBetween(11, 1, 10, "val")).toThrow("val must be between 1 and 10");
    });
  });

});