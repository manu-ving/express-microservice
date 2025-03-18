import {NextFunction, Request, Response} from "express";
import {validateProduct} from "../validator/Product.validation";
import CreateHttpError from "http-errors";
import {Product} from "../models/Product.model";
import mongoose from "mongoose";
import {recommendProducts} from "../algorithm/IntrestScroreCalculation";


export default class ProductRecommendationController {
    static async getProductsForMenOnly(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const gender = request.params.type.toUpperCase();

            console.log(gender);
            if (!gender || (gender !== "MALE" && gender !== "FEMALE")) {
                response.status(400).json({message: "Invalid or missing gender parameter"});
                return;
            }
            const products = await Product.find(
                {
                    focusedCustomer: { $in: [gender, "ALL"] },
                }
            );

            if (!products) {
                response.status(404).json({message: "No products found"});
                return;
            }
            response.status(200).json({
                success: true,
                message: `Products for ${gender}`,
                data: products,
            });
        } catch (error: any) {
            next(error);
        }
    }

    static async getUsersProductRecommendation(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userIdReq = request.params.id;

            const userId = new mongoose.Types.ObjectId(userIdReq); // Example user ID
            recommendProducts(userId).then(products => {
                console.log("Recommended Products:", products);
                response.status(200).json({
                    success: true,
                    data: products,
                })
            });


        } catch (error: any) {
            next(error);
        }

    }
}