import express, { Router } from "express";
import CategoryController from "../controller/CategoryController";
import ProductController from "../controller/ProductController";
import ProductFilterController from "../controller/ProductFilterController";
import ProductRecommendationController from "../controller/ProductRecomendation";

const productRouter: Router = express.Router();




productRouter.post("/create", ProductController.createProduct);
productRouter.post("/create/headerImage",CategoryController.createHeaderImage);


productRouter.get('/header/images',CategoryController.getHeaderImage)


productRouter.get("/seller/:id", ProductController.getAllProductsBySellerId);
productRouter.get("/productsByID/:id", ProductController.getProductById);
//TODO Rename the route
productRouter.get('/filter-by-category', ProductController.getProductByCategory);




productRouter.post('/category/create',CategoryController.createCategories);
productRouter.post('/sub-category/create',CategoryController.createSubCategory);


productRouter.get('/category/get/all',CategoryController.getAllCategoriesWithSubCategories);
productRouter.get('/category/main/get',CategoryController.getAllCategories);


productRouter.get('/filter/gender/:type',ProductRecommendationController.getProductsForMenOnly)
productRouter.get('/recommends/products/:Id',ProductRecommendationController.getUsersProductRecommendation);



productRouter.get('/master/filters',ProductFilterController.getProductsMasterfillter);


export default productRouter