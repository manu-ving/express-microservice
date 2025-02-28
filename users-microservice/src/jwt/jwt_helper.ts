import jwt,{SignOptions} from 'jsonwebtoken'
import createError from 'http-errors'
import dotenv from "dotenv";

dotenv.config();

export const signAccessToken = (userId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const payload = { userId };
    const secret: string = process.env.JWT_SECRET || "default_secret";

    // Correctly define options with type safety
    const options: SignOptions = {
      expiresIn: "1h",
      issuer : "www.vingLop.com",
      audience : userId,
      algorithm: "HS256", // Ensure it's a valid `Algorithm` type
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

export const verifiyJsonWebToken  = (token : string) => {
    
}
