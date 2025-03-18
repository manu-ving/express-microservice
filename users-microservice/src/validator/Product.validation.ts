import Joi from 'Joi';
import mongoose from 'mongoose';
import {IProduct} from "../models/Product.model";


export const ProductionvalidateProduct = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    price: Joi.number().required(),
    discount: Joi.number().min(0),
    currency: Joi.string().default('INR'),
    stock: Joi.number().required().min(0),
    sku: Joi.string().required(),
    category: Joi.string().required(),
    brand: Joi.string().allow(''),
    tags: Joi.array().items(Joi.string()),
    images: Joi.array().items(Joi.string()).required(),
    videos: Joi.array().items(Joi.string()),
    sellingPrice: Joi.number(),
    sellerId: Joi.string().required(),
    isAvailable: Joi.boolean(),
    isFeatured: Joi.boolean(),
    slug: Joi.string().required(),
    platformCommissionPercentage: Joi.number().min(0),
});





export const validateProduct = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    price: Joi.number().required().min(0),
    discount: Joi.number().optional().min(0).max(100),
    focusedCustomer: Joi.string().valid('MEN' , 'WOMEN','BOTH' , 'BOY' , 'GIRL' ,'BABY' , 'ALL' ).required(),
    currency: Joi.string().required(),
    stock: Joi.number().required().min(0),
    incomingStock: Joi.number().optional().min(0),
    reservedStock: Joi.number().optional().min(0),
    restockDate: Joi.date().optional(),
    sku: Joi.string().required(),
    category: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    brand: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    images: Joi.array().items(Joi.string().uri()).min(1).required(),
    videos: Joi.array().items(Joi.string().uri()).optional(),
    variants: Joi.array().items(
        Joi.object({
            variantName: Joi.string().required(),
            variantValue: Joi.string().required(),
        })
    ).optional(),
    isFeatured: Joi.boolean().optional(),
    isAvailable: Joi.boolean().optional(),
    views: Joi.number().min(0).default(0),
    clicks: Joi.number().min(0).default(0),
    wishlistCount: Joi.number().min(0).default(0),
    totalSales: Joi.number().min(0).default(0),
    totalRevenue: Joi.number().min(0).default(0),
    averageRating: Joi.number().min(0).max(5).optional(),
    ratingDistribution: Joi.object().pattern(Joi.string(), Joi.number().min(0)).optional(),
    totalReviews: Joi.number().min(0).optional(),
    lowStockThreshold: Joi.number().optional(),
    stockHistory: Joi.array().items(
        Joi.object({
            date: Joi.date().required(),
            stockChange: Joi.number().required(),
        })
    ).optional(),
    platformCommissionPercentage: Joi.number().min(0).max(100).optional(),
    sellingPrice: Joi.number().min(0).required(),
    sellerId: Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    sellerName: Joi.string().optional(),
    isVerifiedSeller: Joi.boolean().optional(),
    commissionType: Joi.string().valid('percentage', 'fixed').optional(),
    discountStartDate: Joi.date().optional(),
    discountEndDate: Joi.date().optional(),
    specialOfferPrice: Joi.number().min(0).optional(),
    priceHistory: Joi.array().items(
        Joi.object({
            price: Joi.number().required(),
            date: Joi.date().required(),
        })
    ).optional(),
    seoTitle: Joi.string().optional(),
    seoDescription: Joi.string().optional(),
    slug: Joi.string().required(),
    launchDate: Joi.date().optional(),
    expiryDate: Joi.date().optional(),
    isDiscontinued: Joi.boolean().optional(),
    conversionRate: Joi.number().min(0).optional(),
    abandonmentRate: Joi.number().min(0).optional(),
    lastPurchasedAt: Joi.date().optional(),
    likesCount: Joi.number().min(0).optional(),
    sharesCount: Joi.number().min(0).optional(),
    lastViewedAt: Joi.date().optional(),
    hsnCode: Joi.string().optional(),
    gstPercentage: Joi.number().min(0).max(100).optional(),
    isTaxable: Joi.boolean().optional(),
    weight: Joi.number().optional(),
    dimensions: Joi.object({
        length: Joi.number().optional(),
        width: Joi.number().optional(),
        height: Joi.number().optional(),
    }).optional(),
    shippingClass: Joi.string().optional(),
    isFreeShipping: Joi.boolean().optional(),
    customAttributes: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
    languages: Joi.array().items(Joi.string()).optional(),
    localizedDescriptions: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
});
