import prisma from '../../lib/prisma';
import { asyncHandler } from '../../middleware/errorHandler';
import { CouponPayload } from '../../models';

export const createCoupon = async (couponData: CouponPayload, userId: string) => {
    const {
        code,
        discount_type,
        discount_value,
        max_discount_amount,
        min_order_amount,
        usage_limit,
        per_user_limit,
        end_date,
        status,
    } = couponData;
    const newCoupon = await prisma.coupon.create({
        data: {
            user_id: userId,
            code,
            discount_type,
            discount_value,
            max_discount_amount,
            min_order_amount,
            usage_limit,
            per_user_limit,
            end_date: new Date(end_date),
            status,
        },
    });
    return newCoupon;
};

export const validateCouponData = async (code: string, userId: string, subtotal: number) => {
    if (!code || typeof code !== 'string') {
        throw new Error('Mã giảm giá không hợp lệ');
    }
    const existingCoupon = await prisma.coupon.findUnique({
        where: { code },
    });
    if (!existingCoupon) {
        throw new Error('Mã giảm giá không hợp lệ');
    }
    if (existingCoupon.status !== 'active') {
        throw new Error('Mã giảm giá không hợp lệ');
    }
    const now = new Date();
    if (existingCoupon.end_date && existingCoupon.end_date < now) {
        throw new Error('Mã giảm giá đã hết hạn');
    }
    if (subtotal < existingCoupon.min_order_amount) {
        throw new Error(
            `Đơn hàng phải có giá trị tối thiểu là ${existingCoupon.min_order_amount} để sử dụng mã giảm giá này`,
        );
    }
    if (existingCoupon.usage_limit) {
        const totalUsage = await prisma.order.count({
            where: {
                coupon_id: existingCoupon.id,
            },
        });
        if (totalUsage >= existingCoupon.usage_limit) {
            throw new Error('Mã giảm giá đã đạt giới hạn sử dụng');
        }
    }
    const userUsage = await prisma.order.count({
        where: {
            coupon_id: existingCoupon.id,
            user_id: userId,
        },
    });
    if (existingCoupon.per_user_limit && userUsage >= existingCoupon.per_user_limit) {
        throw new Error('Bạn đã sử dụng mã giảm giá này quá số lần cho phép');
    }

    let discountAmount = 0;

    if (existingCoupon.discount_type === 'percent') {
        discountAmount = Math.floor((subtotal * existingCoupon.discount_value) / 100);

        if (
            existingCoupon.max_discount_amount != null &&
            discountAmount > existingCoupon.max_discount_amount
        ) {
            discountAmount = existingCoupon.max_discount_amount;
        }
    } else if (existingCoupon.discount_type === 'fixed_amount') {
        discountAmount = existingCoupon.discount_value;
    }

    discountAmount = Math.min(discountAmount, subtotal);

    return { discountAmount, coupon: existingCoupon };
};
