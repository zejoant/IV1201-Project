'use strict'

const jwt = require("jsonwebtoken");

/**
 * Utility class for handling user authentication and authorization.
 *
 * Provides methods for sending authentication cookies and
 * verifying logged-in users via JWT.
 *
 * @public
 */
class Authorization{

    /**
   * Generates a JWT for the given user and sends it as an HTTP-only cookie.
   *
   * @static
   * @param {Object} person - The user object.
   * @param {number} person.person_id - The user's ID.
   * @param {string} person.username - The user's username.
   * @param {express.Response} res - Express response object.
   * @returns {void}
   */
    static sendCookie(person, res){
        const token = jwt.sign({id: person.person_id, username: person.username}, process.env.JWT_SECRET, {expiresIn: "1h"})
        const options = {httpOnly: true, maxAge: 60 * 60 * 1000};
        res.cookie("auth", token, options)
    }

    /**
   * Checks whether the user is logged in by verifying the auth cookie.
   * If valid, attaches decoded user information to `req.user`.
   *
   * @static
   * @async
   * @param {express.Request} req - Express request object.
   * @param {express.Response} res - Express response object.
   * @returns {Promise<boolean>} True if user is authenticated, false otherwise.
   */
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