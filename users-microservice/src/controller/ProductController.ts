import { NextFunction, Request, Response } from "express";
import CreateHttpError from "http-errors";
import mongoose from "mongoose";
import { SwipeImage } from "../models/ImageCard.model";
import { Product } from "../models/Product.model";
import { validateProduct } from "../validator/Product.validation";


export default class ProductController {

    static async getProductByCategory(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const id = request.query.id as string;

            console.log(id);

            // Validate Category ID
            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                next(CreateHttpError.BadRequest("Invalid or missing category ID."));
                return
            }

            // Pagination setup
            const page = Math.max(1, parseInt(request.query.page as string) || 1);
            const size = Math.max(1, parseInt(request.query.size as string) || 10);
            const skip = (page - 1) * size;

            // Parallelized queries for performance
            const [productsByCategory, totalProductsByCategory, productSwipeHeaderImage] = await Promise.all([
                Product.find({ category: id }).skip(skip).limit(size).lean(),
                Product.countDocuments({ category: id }),
                SwipeImage.find({ categories: id }).lean(),
            ]);

            // No products found
            if (!productsByCategory.length) {
              next(CreateHttpError.NotFound("No Products found..."));
                return
            }

            // Successful response
            response.status(200).json({
                success: true,
                headersImage: productSwipeHeaderImage || [],
                data: productsByCategory,
                pagination: {
                    total: totalProductsByCategory,
                    page,
                    size,
                    totalPages: Math.ceil(totalProductsByCategory / size),
                },
            });

        } catch (error) {
            console.error("Error fetching products by category:", error);
            next(error);
        }
    }


    static async createProduct(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const resultProduct = await validateProduct.validateAsync(request.body)
            // Check for similar product by sellerId and possibly name or SKU
            const existingProduct = await Product.findOne({
                sellerId: resultProduct.sellerId,
                name: resultProduct.name,// Or any other unique field like 'sku'
                sku: resultProduct.sku,
            });

            if (existingProduct) {
                next(CreateHttpError.Conflict("Product already exists"));
                return
            }

            //create a new product
            const savedProduct = await Product.create(resultProduct)
            response.status(200).json({
                success: true,
                data: savedProduct,
            });

        } catch (error: any) {
            if (error.isJoi) {
                return next(CreateHttpError.UnprocessableEntity(error.message));
            }
            next(error);
        }


    }

    static async updateProductId(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        //TODO
    }
    static async getProductById(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const productId: string = request.params.id;
    
            if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
                return next(CreateHttpError.BadRequest("Invalid or missing product ID."));
            }
    
            const product = await Product.findById(productId);
    
            if (!product) {
                 next(CreateHttpError.NotFound("Requested product not found"));
                 return
            }
    
            response.status(200).json({
                success: true,
                data: product,
            });
    
        } catch (error) {
            console.error("Error fetching product by ID:", error);
            next(error);
        }
    }
    


    static async deleteProductById(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        //TODO
    }

    //TODO don't forget add otp verification for confirm the deletation
    static async deleteAllProductBySellerId(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        //TODO
    }


    static async getAllProductsBySellerId(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            // Pagination from query parameters
            const page = parseInt(request.query.page as string) || 1;
            const size = parseInt(request.query.size as string) || 10;

            if (page < 1 || size < 1) {
                return next(CreateHttpError.BadRequest("Page and size must be positive integers."));
            }

            const limit = size;
            const skip = (page - 1) * limit;

            const sellerId = request.params.id;

            if (!sellerId) {
                return next(CreateHttpError.UnprocessableEntity("Requested resource not found, it may be deleted or moved."));
            }

            const [products, totalProducts] = await Promise.all([
                Product.find({sellerId}).skip(skip).limit(limit),
                Product.countDocuments({sellerId})
            ]);

            if (!products.length) {
                return next(CreateHttpError.NotFound("No products found."));
            }

            response.status(200).json({
                success: true,
                data: products,
                pagination: {
                    total: totalProducts,
                    page,
                    size,
                    totalPages: Math.ceil(totalProducts / size),
                }
            });

        } catch (error: any) {
            next(error);
        }
    }


}