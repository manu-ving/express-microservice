import cors from "cors";
import dotenv from "dotenv";
import express, { Application, ErrorRequestHandler, NextFunction, Request, Response } from "express";
import proxy from "express-http-proxy";
import rateLimit from "express-rate-limit";
import { Server } from "http";
import CreateHttpError from "http-errors";

import AuthApikeyVerification from "./helper/Auth.ApikeyVerification";

dotenv.config();

const app: Application = express();

app.use(cors())

app.use(express.json());

 // Adjust size if needed
app.use(express.urlencoded({ extended: true }));

const Admin_Api_key = process.env.ADMIN_API_KEY as string;
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5, 
    handler: (req, res) => {
        res.status(429).json({ error: "Too many requests, please try again later." });
    },
    skip: (req) => {
        const apiKey = (req.headers["admin-api-key"] as string) || "";
        console.log("funck ",apiKey)

        // Allow requests from internal services
        return Admin_Api_key === apiKey
    }
});

app.use(apiLimiter);

app.use('api/v1/register', (req, res, next) => {
    console.log(`Incoming request Register: ${req.method} ${req.hostname} ${req.originalUrl}`);
    next();
}, AuthApikeyVerification.verifyApiRegKey, proxy('http://localhost:2001/'));

app.use('/', (req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.hostname} ${req.baseUrl}`);
    next();
}, AuthApikeyVerification.verifyApiRegKey, proxy('http://localhost:2001/login'));

// 404 Handling
app.use((req: Request, res: Response, next: NextFunction) => {
    next(CreateHttpError(404, 'Not Found from'));
});

//Error Handler Middleware 
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(err.status || 500).
        json({
            error: {
                status: err.status || 500,
                message: err.message
            }
        });
};

app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
const server: Server = app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
