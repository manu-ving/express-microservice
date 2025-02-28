import dotenv from "dotenv";
import { NextFunction, Request, Response, response } from "express";
import CreateHttpError from "http-errors";

import { signAccessToken } from "../jwt/jwt_helper";
import { User } from "../models/Auth.user";
import { RegisterationValidator } from "../validator/Registeration.validator";
import UserViewModel from "../viewmodel/user.viewModel";

export default class AuthUserController {


    static async loginUser (req : Request , res: Response , next : NextFunction ){
        try{
            //validate incoming request body

        }catch(error : any) {
            next(error);
        }
    }

    static async createUser (request : Request , response : Response , next : NextFunction){
       try{
        const  registerValidationResult =  await RegisterationValidator.validateAsync(request.body)

        //CHECK IF USER ALREADY EXISTS
        const userExists = await User.findOne({email : registerValidationResult.email})
        if(userExists){
            throw CreateHttpError(400, "This Email Already Registered");
        }

        //check the mobile number if it already exists
        const phoneExists = await User.findOne({phone : registerValidationResult.phone})
        if(phoneExists){
            throw CreateHttpError(400, "This Phone Number Already Registered");
        }

        //else create the user
        const newUser = new User({
            name : registerValidationResult.name,
            email : registerValidationResult.email,
            password : registerValidationResult.password,
            phone : registerValidationResult.phone,
            profileImage : registerValidationResult.profileImage,
            country : registerValidationResult.country,
        });

        const savedUser = await UserViewModel.registerUser(newUser)
        const accessToken = await signAccessToken(savedUser._id as string);
        console.log({ uid : savedUser._id , token : accessToken})
        return response.status(201).json({ uid : savedUser._id , token : accessToken})

       }catch(error : any){
        if(error.isJoi === true){
            return response.status(400).json({message : error.details[0].message})
        }

        next(error);
       }
    }
}

dotenv.config();
