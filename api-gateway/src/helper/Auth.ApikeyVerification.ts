import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

export default class AuthApikeyVerification {
    // Verify API Key for Login
    static verifyApiLoginKey(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("verifyApiLoginKey middleware called");

            const apiKey = req.headers["user-api-key"] as string;
            if (apiKey && apiKey === process.env.API_KEY_LOGIN) {
                return next();
            }

            return res.status(401).json({ error: "Unauthorized" });
        } catch (error: any) {
            next(error);
        }
    }

    // Verify API Key for Registration
    public static verifyApiRegKey(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("verifyApiRegKey middleware called");

            const apiKey = req.headers["user-api-key"] as string;
            const adminApiKey = req.header('admin-api-key') as string

            console.log(apiKey);  
            console.log(adminApiKey);  
            console.log(process.env.API_KEY_REG);
            if (apiKey && apiKey === process.env.API_KEY_REG as string || adminApiKey && adminApiKey === process.env.ADMIN_API_KEY) {
                return next();
            }

            throw createHttpError.Unauthorized("Nice Try! Better luck next time..");
        } catch (error: any) {
            next(error);
        }
    }
}

// Load environment variables (should be in index.ts or server.ts)
dotenv.config();
