import Joi from 'Joi';

// Joi Schema for SwipeImage validation
export const swipeImageValidation = Joi.object({
    imageUrl: Joi.string().uri().required().messages({
        'string.uri': 'Image URL must be a valid URI.',
        'string.empty': 'Image URL is required.',
    }),

    categories: Joi.array()
        .items(Joi.string().min(1).required())
        .min(1)
        .required()
        .messages({
            'array.base': 'Categories must be an array of strings.',
            'array.min': 'At least one category is required.',
            'string.empty': 'Category cannot be empty.',
        }),

    isAd: Joi.boolean().required().messages({
        'boolean.base': 'isAd must be a boolean value.',
        'any.required': 'isAd is required.',
    }),

    isVisible: Joi.boolean().required().messages({
        'boolean.base': 'isVisible must be a boolean value.',
        'any.required': 'isVisible is required.',
    }),
});

// Optional: Joi schema for updates (allowing partial updates)
export const swipeImageUpdateValidation = Joi.object({
    imageUrl: Joi.string().uri().messages({
        'string.uri': 'Image URL must be a valid URI.',
    }),

    categories: Joi.array()
        .items(Joi.string().min(1))
        .messages({
            'array.base': 'Categories must be an array of strings.',
        }),

    isAd: Joi.boolean().messages({
        'boolean.base': 'isAd must be a boolean value.',
    }),

    isVisible: Joi.boolean().messages({
        'boolean.base': 'isVisible must be a boolean value.',
    }),
}).min(1).messages({
    'object.min': 'At least one field must be updated.',
});
