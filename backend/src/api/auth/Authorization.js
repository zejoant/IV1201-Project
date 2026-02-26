'use strict'

const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");


class Authorization{

    static sendCookie(person, res){
        const token = jwt.sign({id: person.person_id, username: person.username}, process.env.JWT_SECRET, {expiresIn: "1h"})
        const options = {httpOnly: true, maxAge: 60 * 60 * 1000};
        res.cookie("auth", token, options)
        logger.info(`A cookie was sent for username=${person.username}, id=${person.person_id}`);
    }

    static async checkLogin(req, res) {
        const authCookie = req.cookies.auth;

        if (!authCookie) {
            res.status(401).json({ message: "cookie not found" });
            logger.info(`authCookie not found for request=${req}`);
            return false;
        }
        try {
            const decoded = jwt.verify(authCookie, process.env.JWT_SECRET);

            // decoded = { id, username, iat, exp }
            req.user = decoded;
            logger.info(`Token successfully verified for request=${req}`);

            return true;
        } catch (err) {
            res.status(401).json({ message: "Invalid token" });
            logger.error(`An error occured when checking login cookie: error=${err}`);
            return false;
        }
    }
}

module.exports = Authorization