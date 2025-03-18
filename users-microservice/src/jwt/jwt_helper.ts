import dotenv from "dotenv";
import {NextFunction, Request, Response} from "express";
import createError from "http-errors";
// Ensure this package is installed or replace with custom error handling
import jwt, {SignOptions} from "jsonwebtoken";

dotenv.config();



export const generateOtpToken = (userId: string, otp: string) => {
    const JWT_SECRET: string = process.env.REFRESH_TOKEN || "default_secret";

    return jwt.sign({id: userId, otp}, JWT_SECRET, {expiresIn: "10m"}); // Token valid for 10 minutes
}

export const verifyRefershToken = (refreshToken: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const secret: string = process.env.REFRESH_TOKEN || "default_secret";

        console.log(secret)

        jwt.verify(refreshToken, secret, (err, payload) => {
            console.log(err)
            if (err) return reject(createError.Unauthorized("Sorry from 1"));

            if (!payload) return reject(createError.Unauthorized("Sorry from 2"));

            const userID: string = (payload as any).aud as string;

            resolve(userID)
        })
    })
}

export const signRefershToken = (userId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        console.log(userId)
        if (!userId) {
            return reject(new Error("User ID is required for token generation"));
        }

        const secret: string = process.env.REFRESH_TOKEN || "default_secret";

        const payload = {userId};


        // Correctly define options with type safety
        const options: SignOptions = {
            expiresIn: "1y",
            issuer: "www.vingLop.com",
            algorithm: "HS256",
            audience: String(userId)
        };

        jwt.sign(payload, secret, options, (error, token) => {
            if (error) {
                reject(error);
            } else {
                resolve(token as string);
            }
        });
    });
};


export const signAccessToken = (userId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        console.log(userId)
        if (!userId) {
            return reject(new Error("User ID is required for token generation"));
        }

        const payload = {userId};
        const secret: string = process.env.ACCESS_TOKEN_SECRET || "default_secret";

        console.log("From Sigin AccessToken", secret)

        // Correctly define options with type safety
        const options: SignOptions = {
            expiresIn: "1h",
            issuer: "www.vingLop.com",
            algorithm: "HS256", // Ensure it's a valid `Algorithm` type
            audience: String(userId)
        };

        jwt.sign(payload, secret, options, (error, token) => {
            if (error) {
                reject(error);
            } else {
                resolve(token as string);
            }
        });
    });
};
export const verifyJwtToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"] as string | undefined;

    if (!authHeader) {
        return next(createError.Unauthorized("Access denied. No token provided."));
    }


    const secret: string = process.env.ACCESS_TOKEN_SECRET || "default_secret";

    const token = authHeader.split(" ")[1]; // Extract the token after "Bearer"

    if (!token) {
        return next(createError.Unauthorized("Invalid token format."));
    }

    try {
        const decoded = jwt.verify(token, secret);
        (req as any).payload = decoded; // Attach decoded user info to request
        next();
    } catch (error) {
        return next(createError.Unauthorized("Invalid or expired token."));
    }
};

