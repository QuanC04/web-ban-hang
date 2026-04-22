import prisma from "../../lib/prisma";
import { ProductPayload } from "../../models";
import { deleteFileFromR2 } from "../upload/upload.service";

export const addProduct = async (userId:string, productData:ProductPayload, ) => {
    const authUser = await prisma.user.findUnique({
        where: { id: userId },
    });
    if(!authUser){
        throw new Error("Unauthorized");
    }
 const {id, name, description, category_id,base_price,stock_quantity,image_url,image_key} = productData;
 const newProduct=await prisma.product.create({
    data:{
        id,
        name,
        description,
        category_id,
        image_url,
        image_key,
        base_price,
        stock_quantity,
        user_id:userId
    }
 })
 return newProduct;
}

export const updateProduct = async (productId:string, userId:string, productData:any) => {
    const {name, description, category_id,base_price,stock_quantity,image_url,image_key} = productData;

    const existingProduct = await prisma.product.findFirst({
        where: {
            id: productId,
            user_id: userId,
        },
        select: {
            image_key: true,
        },
    });

    if(!existingProduct){
        throw new Error("Unauthorized");
    }

    const previousImageKey = existingProduct.image_key?.trim();
    const nextImageKey = typeof image_key === "string" ? image_key.trim() : undefined;

    const updateProduct=await prisma.product.update({
        where:{
            id:productId,
            user_id:userId,
        },
        data: {
            name,
            description,
            category_id,
            image_url,
            image_key,
            base_price,
            stock_quantity,
        },
    });

    if (previousImageKey && nextImageKey && previousImageKey !== nextImageKey) {
        await deleteFileFromR2(previousImageKey).catch(() => undefined);
    }

    return updateProduct;
}

export const getCategories = async () => {
    const categories = await prisma.category.findMany();
    return categories;
}

export const getProductsByUserId = async (userId:string) => {
    const products = await prisma.product.findMany({
        where: { user_id: userId },
    });
    return products;
}

export const getProductById = async (productId:string) => {
    const product = await prisma.product.findUnique({
        where: { id: productId },
    });
    return product;
}

export const deleteProduct = async (productId:string, userId:string) => {
    const deletedProduct = await prisma.product.delete({
        where: {
            id: productId,
            user_id: userId,
        },
    });
    if(!deletedProduct){
        throw new Error("Unauthorized");
    }
    return deletedProduct;

}
