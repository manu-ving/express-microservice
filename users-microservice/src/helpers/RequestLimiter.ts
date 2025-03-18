import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import rateLimit from "express-rate-limit";

dotenv.config();

const Admin_Api_key = process.env.ADMIN_API_KEY as string;





export const  verifyApiKey = (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("verifyApiLoginKey middleware called");

        const apiKey = req.headers["user-api-key"] as string ?? req.headers["admin-api-key"] as string;
        if (!apiKey) {
           res.status(401).json({ error: "Unauthorized", msg : "Nice Try! Better luck next time.."});
           return
        }

         next()
         return
    } catch (error: unknown) {
        next(error);
    }
}



export const apiLimiter = rateLimit({
    windowMs: 1*  60 * 1000,
    limit: 100,
    //if register make it 100-200
    handler: (req, res) => {
        res.status(429).json({ error: "Too many requests, please try again later." });
    },
    skip: (req) => {
        const apiKey = (req.headers["admin-api-key"] as string) || "Default User Setting up Rate-Limit";
        console.log("messgae : ",apiKey)

        console.table({"From User" : apiKey , "ENV Key": Admin_Api_key });


        // Allow requests from internal services
        return Admin_Api_key === apiKey
    }
});

