'use strict'

const jwt = require("jsonwebtoken");

class Authorization{

    static sendCookie(person, res){
        const token = jwt.sign({id: person.person_id, username: person.username}, process.env.JWT_SECRET, {expiresIn: "1h"})
        const options = {httpOnly: true, maxAge: 60 * 60 * 1000};
        res.cookie("auth", token, options)
    }
}

module.exports = Authorization