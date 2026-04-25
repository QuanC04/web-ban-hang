import { Request, Response } from 'express';
import { errorResponse, successResponse } from "../../utils/response";
import { getMarketProductById, getMarketProducts } from "./marketProduct.service";


export const getMarketProductsController = async (req:Request,res:Response) => {
    const marketProducts= await getMarketProducts();
    successResponse(res,marketProducts, 'Lấy danh sách sản phẩm thành công');
}

export const getMarketProductByIdController = async (req:Request,res:Response) => {
    const {productId} = req.params as {productId:string};
    const marketProduct = await getMarketProductById(productId);
    if(!marketProduct){
        errorResponse(res, 'Sản phẩm không tồn tại', 404);
        return;
    }
    successResponse(res, marketProduct, 'Lấy thông tin sản phẩm thành công');
}
