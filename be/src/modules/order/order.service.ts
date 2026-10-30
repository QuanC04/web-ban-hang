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


export const updateOrderStatus = async (orderId: string, status: string) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: true,
            payments: true,
        },
    });
    if (!order) {
        throw new AppError('Đơn hàng không tồn tại', 404, 'ORDER_NOT_FOUND');
    }
    if (order.status == status) {
        return order;
    }
    if (order.status === 'cancelled' || order.status === 'delivered') {
        throw new AppError(
            'Đơn hàng đã bị hủy, không thể thay đổi trạng thái',
            400,
            'ORDER_ALREADY_CANCELLED',
        );
    }

    return prisma.$transaction(async (tx) => {
        if (status === 'cancelled') {
            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.product_id },
                    data: {
                        stock_quantity: {
                            increment: item.quantity,
                        },
                    },
                });
            }
        }
        if (status === 'delivered') {
            await tx.payment.updateMany({
                where: { order_id: orderId, status: 'pending' },
                data: {
                    status: 'completed',
                    paid_at: new Date(),
                },
            });
        }
        const updatedOrder = await tx.order.update({
            where: { id: orderId },
            data: { status, ...(status === 'delivered' ? { payment_status: 'paid' } : {}) },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
            },
        });
        return updatedOrder;
    });
};

export const confirmDelivery = async (orderId: string, userId: string) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            payments: true,
            items: {
                include: {
                    product: true,
                },
            },
        },
    });

    if (!order) {
        throw new AppError('Đơn hàng không tồn tại', 404, 'ORDER_NOT_FOUND');
    }
    if (order.user_id !== userId) {
        throw new AppError('Bạn không có quyền xác nhận đơn hàng này', 403, 'FORBIDDEN');
    }
    if (order.status === 'delivered') {
        throw new AppError('Đơn hàng đã được xác nhận', 400, 'ORDER_ALREADY_CONFIRMED');
    }
    if (order.status === 'cancelled') {
        throw new AppError(
            'Đơn hàng đã bị hủy, không thể xác nhận',
            400,
            'ORDER_ALREADY_CANCELLED',
        );
    }
    if (order.status !== 'shipping' && order.status !== 'paid') {
        throw new AppError(
            'Đơn hàng chưa ở trạng thái đang giao hàng, bạn chưa thể xác nhận nhận hàng lúc này.',
            400,
            'ORDER_NOT_IN_DELIVERY',
        );
    }
    const hasPendingCod = order.payments.some(
        (p) => p.payment_method === 'cod' && p.status === 'pending',
    );
    return prisma.$transaction(async (tx) => {
        if (hasPendingCod) {
            await tx.payment.updateMany({
                where: { order_id: orderId, payment_method: 'cod', status: 'pending' },
                data: {
                    status: 'completed',
                    paid_at: new Date(),
                },
            });
        }
        const updatedOrder = await tx.order.update({
            where: { id: orderId },
            data: { status: 'delivered', payment_status: 'paid' },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
            },
        });
        return updatedOrder;
    });
};

export const getShopOrders = async (page: number = 1, limit: number = 10, status?: string) => {
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.max(1, limit);
    const skip = (pageNumber - 1) * limitNumber;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            skip,
            take: limitNumber,
            orderBy: { created_at: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        full_name: true,
                        email: true,
                        phone_number: true,
                    },
                },
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
                },
            },
        }),
        prisma.order.count({ where }),
    ]);

    return {
        orders,
        pagination: {
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
        },
    };
};
