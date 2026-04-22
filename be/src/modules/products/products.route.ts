import { Router } from "express";
import { authenticate } from "../../middleware/authicate";
import { addProductController, deleteProductController, getCategoriesController, getProductByIdController, getProductsByUserIdController, updateProductController } from "./products.controller";


const productsRoute:Router=Router();

productsRoute.post('/create',authenticate,addProductController);
productsRoute.get('/categories',authenticate,getCategoriesController);
productsRoute.get('/get-product',authenticate,getProductsByUserIdController);
productsRoute.put('/update/:id',authenticate,updateProductController);
productsRoute.get('/:id',authenticate,getProductByIdController);
productsRoute.delete('/delete/:id',authenticate,deleteProductController);


export default productsRoute;
