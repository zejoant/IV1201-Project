'use strict'

/**
 * Data Transfer Object (DTO) representing a person (user).
 *
 * Used to transfer person data between the database layer and
 * other parts of the application without exposing the full model.
 *
 * @class PersonDTO
 */
class PersonDTO{

    /**
     * Creates a PersonDTO instance.
     *
     * @param {string} name - First name of the person.
     * @param {string} surname - Last name of the person.
     * @param {string} email - Email address of the person.
     * @param {number} role_id - Role type of the user (e.g., admin, regular user).
     * @param {string} username - Unique username for login.
     * @param {string} password - Unique password for login.
     * @param {string} person_id - id for user.
     * @param {string} pnr - person number for user.
     */
    constructor(name, surname, email, role_id, username, password, person_id, pnr){
        this.name = name;
        this.surname = surname;
        this.role_id = role_id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.person_id = person_id;
        this.pnr = pnr;
    }
}

module.exports = PersonDTO;