import { Router } from "express";
import { getMarketProductsController } from "./marketProduct.controller";

const marketProductRoute: Router = Router();

marketProductRoute.get('/market-product', getMarketProductsController);

export default marketProductRoute;
