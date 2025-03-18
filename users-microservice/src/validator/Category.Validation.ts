import Joi from 'Joi';

export const categoryValidationSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.base': `"name" should be a type of 'text'`,
            'string.empty': `"name" cannot be an empty field`,
            'string.min': `"name" should have a minimum length of {#limit}`,
            'any.required': `"name" is a required field`,
        }),

    slug: Joi.string()
        .lowercase()
        .pattern(new RegExp('^[a-z0-9-]+$')) // Only allow lowercase letters, numbers, and hyphens
        .required()
        .messages({
            'string.pattern.base': `"slug" can only contain lowercase letters, numbers, and hyphens`,
            'any.required': `"slug" is a required field`,
        }),

    description: Joi.string()
        .allow('')
        .max(500)
        .optional()
        .messages({
            'string.max': `"description" should not exceed {#limit} characters`,
        }),

    image: Joi.string()
        .uri()
        .required()
        .messages({
            'string.uri': `"image" should be a valid URI`,
        }),

    isActive: Joi.boolean()
        .default(true)
        .messages({
            'boolean.base': `"isActive" should be a boolean`,
        }),

    createdAt: Joi.date()
        .default(() => new Date())
        .messages({
            'date.base': `"createdAt" should be a valid date`,
        }),

    updatedAt: Joi.date()
        .default(() => new Date())
        .messages({
            'date.base': `"updatedAt" should be a valid date`,
        }),
});
