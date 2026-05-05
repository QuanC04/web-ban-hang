import prisma from '../../lib/prisma';

export const getMarketProducts = async () => {
    const marketProducts = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            base_price: true,
            description: true,
            image_url: true,
            created_at: true,
            user: {
                select: {
                    full_name: true,
                },
            },
        },
    });
    return marketProducts;
};

export const getMarketProductById = async (productId: string) => {
    const marketProduct = await prisma.product.findUnique({
        where: { id: productId },
        select: {
            id: true,
            name: true,
            base_price: true,
            description: true,
            image_url: true,
            created_at: true,
            user: {
                select: {
                    id: true,
                    full_name: true,
                    addresses: {
                        select: {
                            province_name: true,
                            province_id: true,
                        },
                    },
                },
            },
            category: {
                select: {
                    name: true,
                },
            },
        },
    });
    return marketProduct;
};
