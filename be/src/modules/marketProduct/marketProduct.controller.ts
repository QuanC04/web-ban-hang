import { Request, Response } from 'express';
import { successResponse } from "../../utils/response";
import { getMarketProducts } from "./marketProduct.service";


export const getMarketProductsController = async (res:Response,req:Request) => {
    const marketProducts= await getMarketProducts();
    successResponse(res,marketProducts, 'Lấy danh sách sản phẩm thành công');
}
