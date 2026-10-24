import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';
import { CartItemPayload } from '../../models';

export const createCartItem = async (userId: string, cartItem: CartItemPayload) => {
    const { quantity, productId } = cartItem;
    const product = await prisma.product.findUnique({
        where: { id: productId },
    });
    if (quantity <= 0) {
        throw new AppError('Số lượng phải lớn hơn 0', 400, 'INVALID_QUANTITY');
    }
    if (!product) {
        throw new AppError('Sản phẩm không tồn tại', 404, 'PRODUCT_NOT_FOUND');
    }

    if (product.status !== 'active') {
        throw new AppError('Sản phẩm không khả dụng', 400, 'PRODUCT_NOT_AVAILABLE');
    }
    const existingCartItem = await prisma.cartItem.findFirst({
        where: {
            user_id: userId,
            product_id: productId,
        },
    });
    const nextQuantity = existingCartItem ? existingCartItem.quantity + quantity : quantity;
    if (nextQuantity > product?.stock_quantity) {
        throw new AppError('Sản phẩm không đủ hàng', 409, 'INSUFFICIENT_STOCK');
    }
    if (existingCartItem) {
        const updated = await prisma.cartItem.update({
            where: { id: existingCartItem.id },
            data: { quantity: nextQuantity },
        });
        return updated;
    }
    const created = await prisma.cartItem.create({
        data: {
            user_id: userId,
            quantity,
            product_id: productId,
        },
    });
    return created;
};

export const updateCartItem = async (
    cartItemId: string,
    userId: string,
    payload: { quantity?: number; delta?: number },
) => {
    const hasQuantity = typeof payload.quantity === 'number';
    const hasDelta = typeof payload.delta === 'number';
    const existingCartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId, user_id: userId },
    });
    if (!existingCartItem) {
        throw new AppError('Không tìm thấy sản phẩm trong giỏ hàng', 404, 'CART_ITEM_NOT_FOUND');
    }
    const product = await prisma.product.findUnique({
        where: { id: existingCartItem.product_id },
    });
    if (!product) {
        throw new AppError('Sản phẩm không tồn tại', 404, 'PRODUCT_NOT_FOUND');
    }
    const nextQuantity = hasQuantity
        ? payload.quantity!
        : existingCartItem.quantity + (hasDelta ? payload.delta! : 0);

    if (nextQuantity > product.stock_quantity) {
        throw new AppError('Sản phẩm không đủ hàng', 409, 'INSUFFICIENT_STOCK');
    }
    const updated = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity: nextQuantity },
    });
    return updated;
};

export const deleteCartItem = async (cartItemId: string, userId: string) => {
    const existingCartItem = await prisma.cartItem.findFirst({
        where: { id: cartItemId, user_id: userId },
    });
    if (!existingCartItem) {
        throw new AppError('Không tìm thấy sản phẩm trong giỏ hàng', 404, 'CART_ITEM_NOT_FOUND');
    }
    await prisma.cartItem.delete({
        where: { id: cartItemId },
    });
};

export const getCartItemsByUserId = async (userId: string) => {
    const cartItems = await prisma.cartItem.findMany({
        where: { user_id: userId },
        include: {
            product: {
                include: {
                    user: {
                        select: {
                            full_name: true,
                        },
                    },
                },
            },
        },
    });
    return cartItems;
};
