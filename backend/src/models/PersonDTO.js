'use strict'

class PersonDTO{

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