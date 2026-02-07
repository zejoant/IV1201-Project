'use strict'

const jwt = require("jsonwebtoken");

class Authorization{

    static sendCookie(person, res){
        const token = jwt.sign({id: person.person_id, username: person.username}, process.env.JWT_SECRET, {expiresIn: "1h"})
        const options = {httpOnly: true, maxAge: 60 * 60 * 1000};
        res.cookie("auth", token, options)
    }

    static async checkLogin(req, res) {
        const authCookie = req.cookies.auth;

        if (!authCookie) {
            res.status(401).json({ message: "cookie not found" });
            return false;
        }
        try {
            const decoded = jwt.verify(authCookie, process.env.JWT_SECRET);

            // decoded = { id, username, iat, exp }
            req.user = decoded;

            return true;
        } catch (err) {
            res.status(401).json({ message: "Invalid token" });
            return false;
        }
    }
}

module.exports = Authorization