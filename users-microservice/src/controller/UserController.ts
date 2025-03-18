import dotenv from "dotenv";
import {NextFunction, Request, Response} from "express";
import CreateHttpError from "http-errors";
import bcrypt from "bcrypt";
import {generateOtpToken, signAccessToken, signRefershToken, verifyRefershToken} from "../jwt/jwt_helper";
import {IUser, User} from "../models/Auth.user";
import {ILoginUser, LoginValidaton, ResetPasswordValidator} from "../validator/Login.validation";
import {RegisterationValidator} from "../validator/Registeration.validator";
import UserViewModel from "../viewmodel/user.viewModel";
import mongoose from "mongoose";
import {generateOTP} from "../helpers/otpGenrator";
import jwt from "jsonwebtoken";
import {loginMailTemplate, otpEmailTemplate, pureTextLoginMailTemplate} from "../helpers/MailHTMLTemplates";
import {UAParser} from 'ua-parser-js';
import {emailQueue} from '../redis/bull_mq.connection'
import {myWorker} from "../worker/OrderWorker";

dotenv.config();


export default class AuthUserController {


    static async resetPasswordWithOTP(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const JWT_SECRET = process.env.REFRESH_TOKEN || "default_secret";

            // Validate request body
            const {otp, otpToken, password} = await ResetPasswordValidator.validateAsync(request.body);

            // Verify JWT token
            let decoded: { id: string; otp: string };
            try {
                decoded = jwt.verify(otpToken, JWT_SECRET) as { id: string; otp: string };
            } catch (_) {
                return next(CreateHttpError.Unauthorized("Invalid or expired OTP token."));
            }

            // Check if OTP matches
            if (decoded.otp !== otp) {
                return next(CreateHttpError.UnprocessableEntity("Invalid OTP."));
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Update the user's password
            const updatedUser = await User.findOneAndUpdate<IUser>(
                {_id: decoded.id},
                {$set: {password: hashedPassword}},
                {new: true}
            );

            // If user not found
            if (!updatedUser) {
                return next(CreateHttpError.NotFound("User not found."));
            }

            // Send success response
            response.status(200).json({message: "Password reset successfully."});

        } catch (error: any) {
            if (error.isJoi) {
                return next(CreateHttpError.BadRequest(error.message));
            }
            next(error);
        }
    }


    static async requestForOTP(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {
            const email: string = request.body.email;

            //check the email is existing or not

            const user = await User.findOne(
                {email: email}
            )

            if (!user) {
                next(CreateHttpError.NotFound("No user found on this email"))
                return
            }
            console.log(user)

            const otp = await generateOTP()
            const userId = user._id.toString();
            const otpToken = generateOtpToken(
                userId,
                otp
            );


            await emailQueue.add('email-queue', {
                toEmailAddress: user.email,
                emailSubject: "Your OTP for Password Reset!",
                emailText: "our OTP is: ${otp}",
                htmlText: otpEmailTemplate(otp)
            }, {
                attempts: 3, // Retry up to 3 times upon failure
                removeOnComplete: true, // Automatically remove job after successful processing
            });

            myWorker();

            response.status(200).json({message: `OTP sent to your email :  ${email}`, otpToken});


        } catch (error: unknown) {
            next(error)
        }


    }


    static async getUserByID(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const uid = request.params.uid;
            //uid is mongoose object id every object id at least have 5 char
            if (!uid || uid.length < 5) {
                next(new CreateHttpError.BadRequest("No such user found "));
                return;

            }

            // Convert to ObjectId
            const objectUserId = new mongoose.Types.ObjectId(uid);
            //check the id is valid or not
            if (mongoose.Types.ObjectId.isValid(objectUserId)) {
                const objectUserId = new mongoose.Types.ObjectId(uid);
                const user = await User.findById({_id: objectUserId});
                if (!user) {
                    next(new CreateHttpError.BadRequest("No such user found "));
                    return
                }


                //if user exist send the user object
                //before sending the password filed need to remove
                const {password: _password, ...safeUser} = user.toObject();
                response.status(200).json(safeUser);

            } else {
                next(new CreateHttpError.BadRequest("No such user found "));
                return;
            }
        } catch (error: any) {
            next(error)
        }


    }


    static async refreshToken(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const {refreshToken} = request.body
            if (!refreshToken) {
                next(CreateHttpError.Unauthorized("You are not logged in. Please log in to continue."));
                return
            }


            //check the refresh token is same as in the db, or  it is an invalid token

            const checkRef = await UserViewModel.getSavedRefershToken(refreshToken);

            if (refreshToken === checkRef || checkRef === null) {
                next(CreateHttpError.Unauthorized("Invalid Token or May be expired please login again..."));
                return
            }

            const userId = await verifyRefershToken(refreshToken);
            const newAccessToken = await signAccessToken(userId);
            const newRefreshToken = await signRefershToken(userId);


            //need to store the refresh token in to db


            //await UserViewModel.finOneAndUpdate(newRefreshToken, refreshToken);

               await User.findOneAndUpdate(
                {refreshToken: refreshToken}, // Find condition
                {$set: {refreshToken: newRefreshToken}}, // Update operation
            )


            response.status(200).json({
                userID: userId,
                "accessToken": newAccessToken,
                "refreshToken": newRefreshToken,
            });


        } catch (err) {
            next(err)
        }
    }


    static async createUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            console.log("Request Confirmed ")
            const registerValidationResult = await RegisterationValidator.validateAsync(request.body)

            console.table({
                name: registerValidationResult.name,
                email: registerValidationResult.email,
                password: registerValidationResult.password
            })

            //CHECK IF USER ALREADY EXISTS
            const userExists = await User.findOne({email: registerValidationResult.email})
            if (userExists) {
                console.log("Request User Exist ")
                next(CreateHttpError.Conflict("This Email Already Registered , Please login "));
                return
            }


            //check the mobile number if it already exists only if the email is not provided
            const phoneExists = await User.findOne({phone: registerValidationResult.phone})
            if (phoneExists) {
                console.log("Request Phone Exit ")
                next(CreateHttpError.Conflict("This Phone Number Already Registered,Please login"));
                return
            }


            //else create the user
            const newUser = new User({
                name: registerValidationResult.name,
                email: registerValidationResult.email,
                password: registerValidationResult.password,
                phone: registerValidationResult.phone,
                profileImage: registerValidationResult.profileImage,
                country: registerValidationResult.country,
            });

            const savedUser = await UserViewModel.registerUser(newUser)

            const accessToken = await signAccessToken(savedUser._id as string);
            const refreshToken = await signRefershToken(savedUser._id as string);

            await newUser.updateOne(
                {refreshToken: refreshToken}
            )


            console.log({uid: savedUser._id, token: accessToken, refreshToken: refreshToken})

            response.status(201).json({
                userId: savedUser._id,
                accessToken: accessToken,
                refreshToken: refreshToken,
                status: "Account created successfully",
                userName: savedUser.name,
                email: savedUser.email,
            });

        } catch (error: any) {
            if (error.isJoi) {
                console.log("Request Confirmed :Error JOI", error)
                return next(CreateHttpError.BadRequest(error.details[0].message))
            }

            next(error);
        }
    }

    //Use View model instead directly accessing schema
    public static async loginUser(req: Request, res: Response, next: NextFunction) {
        try {


            const ua = req.headers['user-agent'] || '';
            const parser = UAParser(ua);  // ✅ Directly call the function
            // Get current date and time in ISO format

            const deviceModel = parser.device.model || "unknown"
            const requestTime = new Date().toISOString();
            const platform = parser.os.name || "unknown"


            //validate incoming request body

            console.table({"email": req.body.email, "pass": req.body.password})

            const loginResult: ILoginUser = await LoginValidaton.validateAsync(req.body)

            const user = await UserViewModel.getUserByEmailOrPhone(loginResult.email, loginResult.phone)

            if (!user) {
                next(CreateHttpError.NotFound("Invalid Username/Password"));
                return
            }

            //check password match or not 
            const isMatch = await user.isValidPassword(loginResult.password);

            if (!isMatch) {
                next(CreateHttpError.BadRequest("Invalid Username/Password"))
                return
            }

            const accessToken = await signAccessToken(user._id as string);
            const refreshToken = await signRefershToken(user._id as string);
            await UserViewModel.updateCreateRefToken(refreshToken);


            console.log("Login Successfully" + user.email);


            await emailQueue.add('email-queue', {
                toEmailAddress: user.email,
                emailSubject: "Successful Login: Explore New Arrivals and Exclusive Offers!",
                emailText: pureTextLoginMailTemplate(user.name, deviceModel, requestTime, platform),
                htmlText: loginMailTemplate(user.email, user.name, deviceModel, requestTime, platform)
            }, {
                attempts: 3, // Retry up to 3 times upon failure
                removeOnComplete: true, // Automatically remove job after successful processing
            });

            myWorker();

            res.status(200).json({
                userId: user._id,
                accessToken: accessToken,
                refreshToken: refreshToken,
                status: "login in successfully",
                userName: user.name,
                email: user.email,

            });


        } catch (error: any) {
            if (error.isJoi) return next(CreateHttpError.BadRequest("Invalid Username/Password"))
            next(error);
        }
    }
}





