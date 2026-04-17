import prisma from "../../lib/prisma";

export const addProduct = async (userId:string, productData:any) => {
    const authUser = await prisma.user.findUnique({
        where: { id: userId },
    });
    if(!authUser){
        throw new Error("Unauthorized");
    }
 const {id, name, description, category_id,image_url,base_price,stock_quantity,user_id} = productData;
 const newProduct=await prisma.product.create({
    data:{
        id,
        name,
        description,
        category_id,
        image_url,
        base_price,
        stock_quantity,
        user_id:userId
    }
 })
 return newProduct;
}

export const updateProduct = async (productId:string, userId:string, productData:any) => {
    const {name, description, category_id,image_url,base_price,stock_quantity} = productData;
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
            base_price,
            stock_quantity,
        },
    });
    if(!updateProduct){
        throw new Error("Unauthorized");
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
