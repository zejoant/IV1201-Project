'use strict'

const Controller = require("../../controller/Controller");

class ErrorHandler{

    constructor(){}

    async retrieveController(){
        this.contr = await Controller.makeController();
    }

    sendResponse(res, status, body){
    if(!body){
      res.status(status).end();
    }
    else{
      if(status < 400){
        res.status(status).json({["success"]: body});
      }
      else{
        res.status(status).json({["error"]: body});
      }
    }
  }
}

module.exports = ErrorHandler;