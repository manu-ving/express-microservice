import mongoose from 'mongoose';
import { Product } from '../models/Product.model';
import {NextFunction, Request, Response} from 'express';


export default class ProductFilterController {
    static async getProductsMasterfillter(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const {
                minPrice,
                maxPrice,
                brand,
                discountStartDate,
                discountEndDate,
                isFeatured,
                isAvailable,
                focusedCustomer,
                category,
                tags,
                isFreeShipping,
                sellerId,
                isVerifiedSeller,
                minRating,
                maxRating,
                minStock,
                maxStock,
                launchDate,
                expiryDate,
                isDiscontinued,
                minTotalSales,
                maxTotalSales,
                customAttributes,
                languages,
                minWishlistCount,
                maxWishlistCount,
                slug,
                page = 1,
                limit = 10,
            } = request.query;

            const filters: any = {};

            if (minPrice || maxPrice) {
                filters.price = {};
                if (minPrice) filters.price.$gte = Number(minPrice);
                if (maxPrice) filters.price.$lte = Number(maxPrice);
            }

            if (brand) filters.brand = brand;
            if (discountStartDate) filters.discountStartDate = {$gte: new Date(discountStartDate as string)};
            if (discountEndDate) filters.discountEndDate = {$lte: new Date(discountEndDate as string)};
            if (isFeatured !== undefined) filters.isFeatured = isFeatured === 'true';
            if (isAvailable !== undefined) filters.isAvailable = isAvailable === 'true';
            if (focusedCustomer) filters.focusedCustomer = focusedCustomer;
            if (category) filters.category = new mongoose.Types.ObjectId(category as string);
            if (tags) filters.tags = {$in: (tags as string).split(',')};
            if (isFreeShipping !== undefined) filters.isFreeShipping = isFreeShipping === 'true';
            if (sellerId) filters.sellerId = new mongoose.Types.ObjectId(sellerId as string);
            if (isVerifiedSeller !== undefined) filters.isVerifiedSeller = isVerifiedSeller === 'true';

            if (minRating || maxRating) {
                filters.averageRating = {};
                if (minRating) filters.averageRating.$gte = Number(minRating);
                if (maxRating) filters.averageRating.$lte = Number(maxRating);
            }

            if (minStock || maxStock) {
                filters.stock = {};
                if (minStock) filters.stock.$gte = Number(minStock);
                if (maxStock) filters.stock.$lte = Number(maxStock);
            }

            if (launchDate) filters.launchDate = {$gte: new Date(launchDate as string)};
            if (expiryDate) filters.expiryDate = {$lte: new Date(expiryDate as string)};
            if (isDiscontinued !== undefined) filters.isDiscontinued = isDiscontinued === 'true';

            if (minTotalSales || maxTotalSales) {
                filters.totalSales = {};
                if (minTotalSales) filters.totalSales.$gte = Number(minTotalSales);
                if (maxTotalSales) filters.totalSales.$lte = Number(maxTotalSales);
            }

            if (minWishlistCount || maxWishlistCount) {
                filters.wishlistCount = {};
                if (minWishlistCount) filters.wishlistCount.$gte = Number(minWishlistCount);
                if (maxWishlistCount) filters.wishlistCount.$lte = Number(maxWishlistCount);
            }

            if (customAttributes) {
                Object.entries(customAttributes).forEach(([key, value]) => {
                    filters[`customAttributes.${key}`] = value;
                });
            }

            if (languages) filters.languages = {$in: (languages as string).split(',')};
            if (slug) filters.slug = slug;

            const skip = (Number(page) - 1) * Number(limit);

            const [products, total] = await Promise.all([
                Product.find(filters).skip(skip).limit(Number(limit)),
                Product.countDocuments(filters)
            ]);

            response.json({
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                products,
            });
        } catch (error) {
            console.error(error);
            response.status(500).json({error: 'Server Error'});
        }
    };

}