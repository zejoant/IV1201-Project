'use strict'

const ErrorHandler = require("./ErrorHandler");

class ErrorResponseSender extends ErrorHandler{

    constructor(){
        super();
    }
    
    get path(){
        return '/';
    }

    registerHandler(app){
        
        app.use(this.path, (err, req, res, next) => {
            if(res.headerSent){
                return next(err);
            }
            this.sendResponse(res, 500, {error: "Operation failed"});
        });
    }
}

module.exports = ErrorResponseSender;