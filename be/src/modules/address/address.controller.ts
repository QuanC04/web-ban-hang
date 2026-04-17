import { asyncHandler } from "../../middleware/errorHandler";
import { successResponse } from "../../utils/response";
import { createAddress, deleteAddress, getAddressByUserId, updateAddress } from "./address.service";
import { Request, Response } from 'express';

export const createAddressController = asyncHandler(async (req:Request,res:Response)=>{
const userId = req.user?.userId;
const address = req.body;
const result = await createAddress(userId, address);
successResponse(res, result, "Tạo địa chỉ thành công", 201);
})

export const getAddressController = asyncHandler(async (req:Request,res:Response)=>{
    const userId = req.user?.userId;
    const result = await getAddressByUserId(userId);
    successResponse(res, result, "Lấy địa chỉ thành công", 200);
})

export const deleteAddressController = asyncHandler(async (req:Request,res:Response)=>{
    const userId = req.user?.userId;
    const addressId = req.params.addressId as string;
    const result = await deleteAddress(addressId,userId);
    successResponse(res, result, "Xóa địa chỉ thành công", 200);
})
export const updateAddressController = asyncHandler(async (req:Request,res:Response)=>{
    const userId = req.user?.userId;
    const addressId = req.params.addressId as string;
    const address = req.body;
    const result = await updateAddress(addressId,userId,address);
    successResponse(res, result, "Cập nhật địa chỉ thành công", 200);
})
