import { Router } from "express";
import { getCartItemsByUserIdController, createCartItemController, updateCartItemController, deleteCartItemController } from "./cart.controller";
import { authenticate } from "../../middleware/authicate";


const cartRouter: Router = Router();

cartRouter.get('/get-cartItems', authenticate,getCartItemsByUserIdController);
cartRouter.post('/add-to-cart', authenticate,createCartItemController);
cartRouter.patch('/update',authenticate, updateCartItemController);
cartRouter.delete('/delete/:itemId', authenticate,deleteCartItemController);

export default cartRouter;
