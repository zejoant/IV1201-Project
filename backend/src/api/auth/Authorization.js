'use strict'

const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");


/**
 * Utility class for handling user authentication and authorization.
 *
 * Provides methods for sending authentication cookies and
 * verifying logged-in users via JWT.
 *
 * @public
 */
class Authorization {

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
    static sendCookie(person, res) {
        const token = jwt.sign({ id: person.person_id, username: person.username }, process.env.JWT_SECRET, { expiresIn: "1h" })
        const options = { httpOnly: true, maxAge: 60 * 60 * 1000 };
        res.cookie("auth", token, options)
        logger.info(`A cookie was sent for username: ${person.username}, id: ${person.person_id}`);
    }

    /**
   * Checks whether the user is logged in by verifying the auth cookie.
   * If valid, attaches decoded user information to `req.user`.
   *
   * Sends an HTTP error response if:
   * - the auth cookie is missing (403),
   * - the user does not have permissions (403),
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
            res.status(403).json({ error: "auth.login_session_invalid" });
            logger.info(`authCookie not found for request: ${req}`);
            return false;
        }
        try {
            const decoded = jwt.verify(authCookie, process.env.JWT_SECRET);

            // decoded = { id, username, iat, exp }
            req.user = decoded;
            logger.info(`Token successfully verified for username: ${req.user.username}`);

            return true;
        } catch (err) {
            res.clearCookie("auth");
            res.status(403).json({ error: "auth.user_login_expired" });
            logger.error(`An error occured when checking login cookie: ${err}`);
            return false;
        }
    }

    /**
     * Checks whether the authenticated user has recruiter privileges by
     * verifying the JWT stored in the auth cookie.
     *
     * Sends an HTTP error response if:
     * - the auth cookie is missing (403),
     * - the token is invalid or expired (403),
     * - the user does not have recruiter permissions (403),
     *
     * @static
     * @async
     * @param {express.Request} req - Express request object containing cookies.
     * @param {express.Response} res - Express response object used to send error responses.
     * @param {Controller} contr - Controller instance.
     * @returns {Promise<boolean>} Resolves to true if the user is a valid recruiter,
     * otherwise false.
     */
    static async checkRecruiter(contr, req, res) {
        const authCookie = req.cookies.auth;

        if (!authCookie) {
            res.status(403).json({ error: "auth.login_session_invalid" });
            return false;
        }
        try {
            const decoded = jwt.verify(authCookie, process.env.JWT_SECRET);

            const person = await contr.findUserById(decoded.id);

            if (person.role_id == 2) {
                res.clearCookie("auth");
                res.status(403).json({ error: "auth.permission_denied" });
                return false;
            }


            // decoded = { id, username, iat, exp }
            req.user = decoded;
            return true;

        } catch (err) {
            res.clearCookie("auth");
            res.status(403).json({ error: "auth.user_login_expired" });
            return false;
        }
    }

    /**
     * deletes the users cookie
     *
     * @static
     * @param {express.Response} res - Express response object used to send error responses.
     */
    static deleteCookie(res){
        res.clearCookie("auth");
    }
}

module.exports = Authorization