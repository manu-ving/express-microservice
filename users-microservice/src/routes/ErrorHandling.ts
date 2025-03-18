import { ErrorRequestHandler } from "express";

//Error Handler Middleware 
export const errorHandler : ErrorRequestHandler = (err, req, res, next) => {   
    res.status(err.status || 500).
    json({
        error: {
            status: err.status || 500,
            message: err.message
        }
    }); 
};
