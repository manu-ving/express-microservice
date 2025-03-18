import Joi from 'Joi';

export interface ILoginUser {
    email: string,
    phone: string,
    password: string,
}

interface IResetPasswordValidator {
    otp: string;
    otpToken: string;
    password: string;
}


export const ResetPasswordValidator = Joi.object<IResetPasswordValidator>({
    otp: Joi.string()
        .length(6) // Ensures OTP is exactly 6 characters
        .pattern(/^\d+$/) // Ensures OTP is numeric
        .required()
        .messages({
            "string.base": "OTP must be a string.",
            "string.length": "OTP must be exactly 6 digits.",
            "string.pattern.base": "OTP must contain only digits.",
            "any.required": "OTP is required.",
        }),

    otpToken: Joi.string()
        .required()
        .messages({
            "string.base": "OTP token must be a string.",
            "any.required": "OTP token is required.",
        }),

    password: Joi.string()
        .min(6) // Minimum length of 8
        .max(32) // Optional: Maximum length of 32
        .required()
        .messages({
            "string.base": "Password must be a string.",
            "string.min": "Password must be at least 6 characters long.",
            "string.max": "Password must be at most 32 characters long.",
            "any.required": "Password is required.",
        }),
});


export const LoginValidaton = Joi.object<ILoginUser>({
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(6) // Minimum length of 8
        .max(32) // Optional: Maximum length of 32
        .required(),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/) // Ensures the number starts with 6-9 and has 10 digits

});

