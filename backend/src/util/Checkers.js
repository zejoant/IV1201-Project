'use strict'

const assert = require("assert");
const validator = require("validator")

class Checker{

    static isLength(value, min, max, name){
        assert(value.length >= min && value.length <= max, `${name} must be between ${min} and ${max}`)
    }

    static isNumeric(value, name){
        assert.equal(typeof value, 'number', `${name} must be numerical`)
    }

    static isInteger(value, name){
        Checker.isNumeric(value, name);
        assert(!Number.isNaN(value) && Number.isInteger(value), `${name} must be integer`)
    }

    static isPositiveInteger(value, name){
        Checker.isInteger(value, name);
        assert(value >= 0, `${name} must be positive integer`);
    }

    static isString(value, name){
        assert.equal(typeof value, 'string', `${name} must be a string`)
    }

    static isAlphaNumeric(value, name){
        Checker.isString(value, name); 
        assert(validator.isAlphanumeric(value), `${name} must be alphanumeric`)
    }

    static notEmptyString(value, name){
        Checker.isString(value, name);
        assert(!validator.isEmpty(value), `${name} must be non-empty string`)
    }

    static isEmailString(value, name){
        Checker.isString(value, name);
        assert(validator.isEmail(validator.normalizeEmail(value)), `${name} must be a email string`)
    }

    static isArray(value, name){
        assert(Array.isArray(value), `${name} must be an array`)
    }

    static isDateString(value, name){
        Checker.isString(value, name);
        assert(validator.isISO8601(value), `${name} must be a valid date format XXXX-XX-XX`)
    }

    static isMatches(value, regex, name){
        Checker.isString(value, name);
        assert(validator.matches(value, regex), `${name} must be valid status format`)
    }

    static isAlpha(value, name){
        Checker.isString(value, name);
        assert(validator.isAlpha(value), `${name} must only contain letters`)
    }

    static isNumberBetween(value, min, max, name){
        assert(value >= min && value <= max, `${name} must be between ${min} and ${max}`)
    }
}

module.exports = Checker;