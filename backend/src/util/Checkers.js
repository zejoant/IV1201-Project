'use strict'

const assert = require("assert");
const validator = require("validator")

/**
 * Utility class for input validation.
 *
 * Provides static methods to validate strings, numbers, arrays, dates,
 * and other common types. Throws an AssertionError if validation fails.
 *
 * @class Checker
 */
class Checker{

     /**
     * Validates that a string's length is within the given range.
     * @param {string} value - The string to check.
     * @param {number} min - Minimum allowed length.
     * @param {number} max - Maximum allowed length.
     * @param {string} name - Name of the variable (for error messages).
     * @throws {AssertionError} If length is not in [min, max].
     */
    static isLength(value, min, max, name){
        assert(value.length >= min && value.length <= max, `${name} must be between ${min} and ${max}`)
    }

    /**
     * Validates that a value is numeric.
     * @param {*} value - The value to check.
     * @param {string} name - Name of the variable (for error messages).
     * @throws {AssertionError} If value is not a number.
     */
    static isNumeric(value, name){
        assert.equal(typeof value, 'number', `${name} must be numerical`)
    }

    /**
     * Validates that a value is an integer.
     * @param {*} value - The value to check.
     * @param {string} name - Name of the variable (for error messages).
     * @throws {AssertionError} If value is not an integer.
     */
    static isInteger(value, name){
        Checker.isNumeric(value, name);
        assert(!Number.isNaN(value) && Number.isInteger(value), `${name} must be integer`)
    }

     /**
     * Validates that a value is a positive integer (>= 0).
     * @param {*} value - The value to check.
     * @param {string} name - Name of the variable (for error messages).
     * @throws {AssertionError} If value is not a positive integer.
     */
    static isPositiveInteger(value, name){
        Checker.isInteger(value, name);
        assert(value >= 0, `${name} must be positive integer`);
    }

    /**
     * Validates that a value is a string.
     * @param {*} value - The value to check.
     * @param {string} name - Name of the variable (for error messages).
     * @throws {AssertionError} If value is not a string.
     */
    static isString(value, name){
        assert.equal(typeof value, 'string', `${name} must be a string`)
    }

    /**
     * Validates that a string contains only alphanumeric characters.
     * @param {string} value - The string to check.
     * @param {string} name - Name of the variable (for error messages).
     * @throws {AssertionError} If value is not alphanumeric.
     */
    static isAlphaNumeric(value, name){
        Checker.isString(value, name); 
        assert(validator.isAlphanumeric(value), `${name} must be alphanumeric`)
    }

    /**
     * Validates that a string is not empty.
     * @param {string} value - The string to check.
     * @param {string} name - Name of the variable (for error messages).
     * @throws {AssertionError} If string is empty.
     */
    static notEmptyString(value, name){
        Checker.isString(value, name);
        assert(!validator.isEmpty(value), `${name} must be non-empty string`)
    }

     /**
     * Validates that a string is a valid email address.
     * @param {string} value - The string to check.
     * @param {string} name - Name of the variable (for error messages).
     * @throws {AssertionError} If string is not a valid email.
     */
    static isEmailString(value, name){
        Checker.isString(value, name);
        assert(validator.isEmail(validator.normalizeEmail(value)), `${name} must be a email string`)
    }

    /**
     * Validates that a value is an array.
     * @param {*} value - The value to check.
     * @param {string} name - Name of the variable (for error messages).
     * @throws {AssertionError} If value is not an array.
     */
    static isArray(value, name){
        assert(Array.isArray(value), `${name} must be an array`)
    }

    /**
     * Validates that a string is a valid ISO 8601 date.
     * @param {string} value - The string to check.
     * @param {string} name - Name of the variable (for error messages).
     * @throws {AssertionError} If string is not a valid date.
     */
    static isDateString(value, name){
        Checker.isString(value, name);
        assert(validator.isISO8601(value), `${name} must be a valid date format XXXX-XX-XX`)
    }

    /**
     * Validates that a string matches a regular expression.
     * @param {string} value - The string to check.
     * @param {RegExp} regex - The regular expression to match.
     * @param {string} name - Name of the variable (for error messages).
     * @throws {AssertionError} If string does not match the regex.
     */
    static isMatches(value, regex, name){
        Checker.isString(value, name);
        assert(validator.matches(value, regex), `${name} must be valid status format`)
    }

    /**
     * Validates that a string contains only letters.
     * @param {string} value - The string to check.
     * @param {string} name - Name of the variable (for error messages).
     * @throws {AssertionError} If string contains non-letter characters.
     */
    static isAlpha(value, name){
        Checker.isString(value, name);
        assert(validator.isAlpha(value), `${name} must only contain letters`)
    }

    /**
     * Validates that a numeric value is between min and max (inclusive).
     * @param {number} value - The number to check.
     * @param {number} min - Minimum allowed value.
     * @param {number} max - Maximum allowed value.
     * @param {string} name - Name of the variable (for error messages).
     * @throws {AssertionError} If value is outside [min, max].
     */
    static isNumberBetween(value, min, max, name){
        assert(value >= min && value <= max, `${name} must be between ${min} and ${max}`)
    }
}

module.exports = Checker;