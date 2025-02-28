import { User } from '../models/Auth.user';
import Joi from 'Joi';



interface IjoiUser {

    name : string,
    email : string ,
    password: string,
    phone : string,
    profileImage : string,
    country : string,
    
}


export const RegisterationValidator = Joi.object<IjoiUser>({
    name : Joi.string().required(),
    email : Joi.string().email().required(),
    password : Joi.string()
    .min(6) // Minimum length of 8
    .max(32) // Optional: Maximum length of 32
    .required(),
    phone : Joi.string()  .pattern(/^[6-9]\d{9}$/) // Ensures the number starts with 6-9 and has 10 digits
    .required()
    .messages({
      "string.pattern.base": "Mobile number must be a valid 10-digit number starting with 6-9.",
      "any.required": "Mobile number is required."
    }),
    profileImage : Joi.string(),
    country : Joi.string().required(),
})