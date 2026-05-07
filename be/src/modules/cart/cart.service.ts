import prisma from '../../lib/prisma';
import { CartItemPayload } from '../../models';

export const createCartItem = async (userId: string, cartItem: CartItemPayload) => {
    const { quantity, productId } = cartItem;
    const product = await prisma.product.findUnique({
        where: { id: productId },
    });
    if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
    }
    if (!product) {
        throw new Error('Product not found');
    }

    if (product.status !== 'active') {
        throw new Error('Product is not available');
    }
    const existingCartItem = await prisma.cartItem.findFirst({
        where: {
            user_id: userId,
            product_id: productId,
        },
    });
    const nextQuantity = existingCartItem ? existingCartItem.quantity + quantity : quantity;
    if (nextQuantity > product?.stock_quantity) {
        throw new Error('Insufficient stock');
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
        throw new Error('Cart item not found or unauthorized');
    }
    const product = await prisma.product.findUnique({
        where: { id: existingCartItem.product_id },
    });
    if (!product) {
        throw new Error('Associated product not found');
    }
    const nextQuantity = hasQuantity
        ? payload.quantity!
        : existingCartItem.quantity + (hasDelta ? payload.delta! : 0);

    if (nextQuantity > product.stock_quantity) {
        throw new Error('Insufficient stock');
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
        throw new Error('Cart item not found or unauthorized');
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
