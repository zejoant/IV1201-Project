'use strict'

const ErrorHandler = require("./ErrorHandler");

/**
 * Global error handler that extends ErrorHandler.
 *
 * Catches all unhandled errors in the Express application,
 * logs them to the console, and sends standardized JSON
 * error responses to the client.
 *
 * @public
 * @extends ErrorHandler
 */
class ErrorResponseSender extends ErrorHandler {

    /**
     * Creates a new ErrorResponseSender instance.
     * Calls the parent ErrorHandler constructor.
     *
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * The base path for error handling middleware.
     *
     * @type {string}
     * @returns {string} Base path for error middleware ('/').
     */
    get path() {
        return '/';
    }

    /**
     * Registers the global error handling middleware on the Express app.
     *
     * Logs the error and sends a JSON response containing:
     * - error message
     * - error name
     * - stack trace
     *
     * @param {express.Application} app - Express application instance.
     * @returns {void}
     */
    registerHandler(app) {
        app.use(this.path, (err, req, res, next) => {
            console.error(err);

            if (res.headersSent) {
                return next(err);
            }

            res.status(500).send({ error: 'Operation failed' });
        });
    }
}

module.exports = ErrorResponseSender;