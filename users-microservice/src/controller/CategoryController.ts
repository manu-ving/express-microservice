import { NextFunction, Request, Response } from "express";
import CreateHttpError from "http-errors";
import mongoose from "mongoose";
import { Category, ICategory } from "../models/category.model";
import { SwipeImage } from "../models/ImageCard.model";
import { SubCategory } from "../models/subcategory.model";
import { categoryValidationSchema } from "../validator/Category.Validation";
import { swipeImageValidation } from "../validator/ImageCardValidator";
import { subCategoryValidationSchema } from "../validator/SubCatagory.validation";


export default class CategoryController {


    static async getHeaderImage(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {

        try{
            const {type} = request.query;
            if(!type){
              next(CreateHttpError.BadRequest("Must include a query"));
              return    
            }

            const result = await SwipeImage.find({
                categories : type
            });

            if(!result){
                response.status(404).json(
                    {
                        message : "No Header images found on this type",
                        data : [],
                        sucess  : false,
                    }
                )
            }
        

            response.status(200).json(
                {
                    message : "Header images found ",
                    data :  result,
                    sucess : true,
                }
            )


        }catch(error : any){
            next(error.message)
        }
        
    }


    static async createHeaderImage(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const result = await swipeImageValidation.validateAsync(request.body)
            if (!result) {
                next(CreateHttpError.BadRequest("Please include data for creating header image "))
                return
            }

            const savedHeader = await SwipeImage.create(result)
            response.status(201).json(
                {
                    status: "success",
                    data: savedHeader
                }
            )

        } catch (error: any) {
            if (error.isJoi){
                next(CreateHttpError.BadRequest(error.message));
            }
            next(error)
        }

    }


    /**
     * Handles the creation of a new category.
     *
     * This function validates the request body using a Joi validation schema.
     * If successful, it creates a new category in the database and returns it
     * as part of the response.
     *
     * @param request - The Express request object containing the category data in the body.
     * @param response - The Express response object used to send back the response.
     * @param next - The next middleware function to handle errors or pass execution.
     *
     * @throws Will call `next` with a validation error if the provided data does not meet the validation schema.
     * @throws Will call `next` with other errors if an error occurs during category creation.
     */


    /**
     * Handles the creation of a new category in the database.
     * Includes validation using Joi for robust error checking.
     */
    static async createCategories(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            // Extract and validate request body using Joi schema
            const validatedCategory = await categoryValidationSchema.validateAsync(request.body);

            const categoryExists = await Category.findOne({name: validatedCategory.name, slug: validatedCategory.slug});
            if (categoryExists) {
                return next(CreateHttpError.Conflict("Category already exists"));
            }

            // Create a new category in the database
            const createdCategory = await Category.create(validatedCategory);

            // Respond with the created category
            response.status(201).json({
                success: true,
                message: "New category created successfully.",
                data: createdCategory,
            });
        } catch (error: any) {
            // Handle validation errors explicitly
            if (error.isJoi) {
                return next(CreateHttpError.BadRequest(`Validation error: ${error.message}`));
            }

            // Pass other errors to the next middleware
            return next(error);
        }
    }


    static async getAllCategories(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {

        try {
            const categories = await Category.find({});
            if (!categories) {
                next(CreateHttpError.NotFound("No category found"));
                return
            }
            response.status(200).json({
                success: true,
                data: categories,
            });
        } catch (error: any) {
            next(error);
        }

    }


    /**
     * Retrieves all categories along with their associated subcategories.
     *
     * This function fetches all categories stored in the database and populates
     * their `subCategories` field to include detailed information about the
     * related subcategories.
     *
     * The results are then returned in the response as a JSON object, including
     * a `success` flag and the retrieved data. If an error occurs during the
     * fetching process, it is passed to the next middleware for handling.
     *
     * Example response:
     * {
     *   "success": true,
     *   "data": [
     *     {
     *       "_id": "categoryId1",
     *       "name": "Category 1",
     *       "slug": "category-1",
     *       "subCategories": [
     *         { "_id": "subCategoryId1", "name": "SubCategory 1", "slug": "sub-category-1" },
     *         { "_id": "subCategoryId2", "name": "SubCategory 2", "slug": "sub-category-2" }
     *       ]
     *     },
     *     {
     *       "_id": "categoryId2",
     *       "name": "Category 2",
     *       "slug": "category-2",
     *       "subCategories": []
     *     }
     *   ]
     * }
     *
     * @param request - The Express request object, which may contain query parameters.
     * @param response - The Express response object used to send back the list of categories with subcategories.
     * @param next - The next middleware function to call in case of an error.
     *
     * @throws Will call `next` with an error object if fetching categories fails (e.g., database errors).
     */



    static async getAllCategoriesWithSubCategories(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            //todo try getting sub categories with categories
            const categories = await Category.find({})
                .populate({
                    path: 'subCategories',
                    model: 'SubCategory',
                });

            console.log(categories);


            if (!categories.length) {
                response.status(404).json({
                    success: false,
                    message: "No categories found.",
                });
                return;

            }

            response.status(200).json({
                success: true,
                data: categories,
            });

        } catch (error: any) {
            console.error("Error fetching categories:", error);
            next({
                status: 500,
                message: "An error occurred while fetching categories.",
                error,
            });
        }
    }

    static async getSubCategoryBySlug(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const slug = request.params.slug;
            if (!slug) {
                return next(CreateHttpError.BadRequest("Invalid or missing slug."));
            }

            const subCategory = await Category.findOne({slug: slug}).populate('subcategories');
            if (!subCategory) {
                return next(CreateHttpError.NotFound("No sub category found with this slug."));
            }
            response.status(200).json({
                success: true,
                data: subCategory,
            });
        } catch (error: any) {
            next(error);
        }
    }


    static async createSubCategory(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const resultSubCategory = await subCategoryValidationSchema.validateAsync(request.body);
            if (!resultSubCategory) {
                next(CreateHttpError.BadRequest("Invalid or missing subCategory data."));
                return
            }

            // Check if SubCategory with the same name and slug already exists
            const subCategoryExists = await SubCategory.findOne({
                name: resultSubCategory.name,
                slug: resultSubCategory.slug,
            }).session(session);

            if (subCategoryExists) {
                next(CreateHttpError.Conflict("SubCategory already exists"));
                return
            }

            // Create the SubCategory
            const createdSubCategory = await SubCategory.create([resultSubCategory], {session});

            // Update the main Category with the new subcategory
            const updatedCategory = await Category.findOneAndUpdate<ICategory>(
                {_id: createdSubCategory[0].category},
                {$addToSet: {subCategories: createdSubCategory[0]._id}},
                {new: true, session}
            );

            if (!updatedCategory) {
                next(CreateHttpError.NotFound("Parent Category not found."));
                return
            }

            // Commit the transaction
            await session.commitTransaction();
            await session.endSession();

            // Send response
            response.status(201).json({
                success: true,
                data: createdSubCategory[0],
            });

        } catch (error: any) {
            await session.abortTransaction();
            await session.endSession();

            if (error.isJoi) {
                return next(CreateHttpError.BadRequest(`Validation error: ${error.message}`));
            }
            next(error);
        }
    }

}

