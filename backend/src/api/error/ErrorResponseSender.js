'use strict'

const ErrorHandler = require("./ErrorHandler");

class ErrorResponseSender extends ErrorHandler{

    constructor(){
        super();
    }
    
    get path(){
        return '/';
    }

    registerHandler(app) {
        app.use(this.path, (err, req, res, next) => {
            console.error(err);

            if (res.headersSent) {
                return next(err);
            }

            this.sendResponse(res, err.status || 500, {
                error: err.message,
                name: err.name,
                stack: err.stack,
            });
        });
    }
}

module.exports = ErrorResponseSender;