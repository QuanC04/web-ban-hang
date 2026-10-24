import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';
import { BuyNowPayload, OrderPayload } from '../../models';
import { validateCouponData } from '../coupon/coupon.service';

export const createOrder = async (userId: string, orderData: OrderPayload) => {
    const { cartItemsIds, shipping_address, coupon_code, payment_method } = orderData;
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
        throw new AppError('Giỏ hàng trống', 400, 'CART_EMPTY');
    }
    if (payment_method !== 'cod' && payment_method !== 'bank') {
        throw new AppError('Phương thức thanh toán không hợp lệ', 400, 'INVALID_PAYMENT_METHOD');
    }
    const totalbeforeDiscount = cartItems.reduce(
        (total, item) => total + item.product.base_price * item.quantity,
        0,
    );
    let coupon_id: string | null = null;
    let shippingFee = 22000;
    let discountAmount = 0;
    let totalAmount = totalbeforeDiscount + shippingFee;
    if (coupon_code) {
        const result = await validateCouponData(coupon_code, userId, totalbeforeDiscount);
        coupon_id = result.coupon.id;
        discountAmount = result.discountAmount;
        totalAmount = totalbeforeDiscount - discountAmount + shippingFee;
    }
    return prisma.$transaction(async (tx) => {
        for (const item of cartItems) {
            if (item.quantity > item.product.stock_quantity) {
                throw new AppError(
                    `Sản phẩm ${item.product.name} không đủ hàng`,
                    409,
                    'INSUFFICIENT_STOCK',
                );
            }
            if (item.product.status !== 'active') {
                throw new AppError(
                    `Sản phẩm ${item.product.name} không khả dụng`,
                    400,
                    'PRODUCT_NOT_AVAILABLE',
                );
            }
        }
        const order = await tx.order.create({
            data: {
                user_id: userId,
                shipping_address: JSON.stringify(shipping_address),
                total_before_discount: totalbeforeDiscount,
                total_amount: totalAmount,
                discount_amount: discountAmount,
                shipping_fee: shippingFee,
                coupon_id: coupon_id || null,
                status: 'pending',
                items: {
                    create: cartItems.map((item) => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price_at_purchase: item.product.base_price,
                    })),
                },
                payments: {
                    create: {
                        payment_method: payment_method,
                        status: 'pending',
                    },
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

export const buyNowOrder = async (userId: string, orderData: BuyNowPayload) => {
    const { productId, quantity, shipping_address, coupon_code, payment_method } = orderData;
    if (quantity <= 0) {
        throw new AppError('Số lượng sản phẩm phải lớn hơn 0', 400, 'INVALID_QUANTITY');
    }
    const product = await prisma.product.findUnique({
        where: { id: productId },
    });

    if (!product) {
        throw new AppError('Sản phẩm không tồn tại', 404, 'PRODUCT_NOT_FOUND');
    }

    if (payment_method !== 'cod' && payment_method !== 'bank') {
        throw new AppError('Phương thức thanh toán không hợp lệ', 400, 'INVALID_PAYMENT_METHOD');
    }

    if (product.status !== 'active') {
        throw new AppError('Sản phẩm không khả dụng', 400, 'PRODUCT_NOT_AVAILABLE');
    }

    if (quantity > product.stock_quantity) {
        throw new AppError('Sản phẩm không đủ hàng', 409, 'INSUFFICIENT_STOCK');
    }

    const totalbeforeDiscount = product.base_price * quantity;
    const shippingFee = 22000;
    let coupon_id: string | null = null;
    let discountAmount = 0;
    let totalAmount = totalbeforeDiscount + shippingFee;

    if (coupon_code) {
        const result = await validateCouponData(coupon_code, userId, totalbeforeDiscount);
        coupon_id = result.coupon.id;
        discountAmount = result.discountAmount;
        totalAmount = totalbeforeDiscount - discountAmount + shippingFee;
    }

    return prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                user_id: userId,
                shipping_address: JSON.stringify(shipping_address),
                total_before_discount: totalbeforeDiscount,
                total_amount: totalAmount,
                coupon_id: coupon_id || null,
                discount_amount: discountAmount,
                shipping_fee: shippingFee,
                status: 'pending',
                items: {
                    create: {
                        product_id: productId,
                        quantity: quantity,
                        price_at_purchase: product.base_price,
                    },
                },
                payments: {
                    create: {
                        payment_method: payment_method,
                        status: 'pending',
                    },
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
            },
        });

        await tx.product.update({
            where: { id: productId },
            data: {
                stock_quantity: product.stock_quantity - quantity,
            },
        });

        return order;
    });
};

export const getMyOrders = async (
    userId: string,
    page: number = 1,
    limit: number = 10,
    status?: string,
) => {
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { user_id: userId };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            skip,
            take: limit,
            orderBy: { created_at: 'desc' },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                image_url: true,
                                base_price: true,
                            },
                        },
                    },
                },
                payments: {
                    orderBy: { created_at: 'desc' },
                    take: 1,
                },
            },
        }),
        prisma.order.count({ where }),
    ]);

    return {
        orders,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
