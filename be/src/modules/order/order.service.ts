import prisma from '../../lib/prisma';
import { OrderPayload } from '../../models';

export const createOrder = async (userId: string, orderData: OrderPayload) => {
    const { cartItemsIds, shipping_address, coupon_id } = orderData;
    const cartItems = await prisma.cartItem.findMany({
        where: {
            id: {
                in: cartItemsIds,
            },
            user_id: userId,
        },
        include: {
            product: true,
        },
    });
    if (cartItems.length === 0) {
        throw new Error('Giỏ hàng trống');
    }
    const totalbeforeDiscount = cartItems.reduce(
        (total, item) => total + item.product.base_price * item.quantity,
        0,
    );
    const totalAmount = totalbeforeDiscount;
    return prisma.$transaction(async (tx) => {
        for (const item of cartItems) {
            if (item.quantity > item.product.stock_quantity) {
                throw new Error(`Sản phẩm ${item.product.name} không đủ hàng`);
            }
            if (item.product.status !== 'active') {
                throw new Error(`Sản phẩm ${item.product.name} không khả dụng`);
            }
        }
        const order = await tx.order.create({
            data: {
                user_id: userId,
                shipping_address: JSON.stringify(shipping_address),
                total_before_discount: totalbeforeDiscount,
                total_amount: totalAmount,
                coupon_id: coupon_id || null,
                status: 'pending',
                items: {
                    create: cartItems.map((item) => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price_at_purchase: item.product.base_price,
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        for (const item of cartItems) {
            await tx.product.update({
                where: { id: item.product_id },
                data: {
                    stock_quantity: item.product.stock_quantity - item.quantity,
                },
            });
        }
        await tx.cartItem.deleteMany({
            where: {
                id: {
                    in: cartItemsIds,
                },
                user_id: userId,
            },
        });
        return order;
    });
};
