import prisma from "../../lib/prisma";


export const getMarketProducts = async () => {
    const marketProducts = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            base_price: true,
            description: true,
            image_url: true,
            create_at: true,
            user: {
                select: {
                    full_name: true,
                },
            },
        },
    });
    return marketProducts;
};
