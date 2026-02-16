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
     * @param {number} person_id - Unique ID of the person.
     * @param {string} name - First name of the person.
     * @param {string} surname - Last name of the person.
     * @param {string} pnr - Personal number / identifier.
     * @param {string} email - Email address of the person.
     * @param {string} password - Hashed password for authentication.
     * @param {number} role_id - Role type of the user (e.g., admin, regular user).
     * @param {string} username - Unique username for login.
     */
    constructor(person_id, name, surname, pnr, email, password, role_id, username ){
        this.person_id = person_id;
        this.name = name;
        this.surname = surname;
        this.pnr = pnr;
        this.email = email;
        this.password = password;
        this.role_id = role_id;
        this.username = username;
    }
}

module.exports = PersonDTO;