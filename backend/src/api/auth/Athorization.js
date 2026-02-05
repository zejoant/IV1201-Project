'use strict'

const jwt = require("jsonwebtoken");

class Authorization{

    static sendCookie(person, res){
        const token = jwt.sign({id: person.person_id, username: person.username}, process.env.JWT_SECRET, {expiresIn: "30 minutes"})
        const options = ({httpOnly: true}, {expires: 0});
        res.cookie("auth", token, options)
    }
}

module.exports = Authorization