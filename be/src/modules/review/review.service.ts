import { AppError } from '../../middleware/errorHandler';
import { GetProductReviewsQuery, ReviewPayload } from '../../models';
import prisma from '../../lib/prisma';

export const createReview = async (userId: string, reviewData: ReviewPayload) => {
    const { order_item_id, rating, comment } = reviewData;
    if (!rating || !Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new AppError('Số sao đánh giá phải là số nguyên từ 1 đến 5', 400, 'INVALID_RATING');
    }
    const orderItem = await prisma.orderItem.findUnique({
        where: { id: order_item_id },
        include: {
            order: true,
            review: true,
        },
    });
    if (!orderItem) {
        throw new AppError('Sản phẩm không tồn tại', 404, 'PRODUCT_NOT_FOUND');
    }
    if (orderItem.order.user_id !== userId) {
        throw new AppError('Bạn không có quyền đánh giá sản phẩm này', 403, 'FORBIDDEN');
    }
    if (orderItem.review) {
        throw new AppError('Bạn đã đánh giá sản phẩm này rồi', 400, 'REVIEW_ALREADY_EXISTS');
    }
    if (orderItem.order.status !== 'delivered') {
        throw new AppError(
            'Bạn chỉ có thể đánh giá sản phẩm sau khi nhận hàng',
            400,
            'ORDER_NOT_DELIVERED',
        );
    }
    const cleanComment = comment && typeof comment === 'string' ? comment.trim() : null;
    const newReview = await prisma.review.create({
        data: {
            order_item_id,
            rating,
            comment: cleanComment,
            product_id: orderItem.product_id,
            user_id: userId,
        },
    });
    return newReview;
};

export const getReviewsByProductId = async (productId: string, query: GetProductReviewsQuery) => {
    if (!productId) {
        throw new AppError('Product ID là bắt buộc', 400, 'PRODUCT_ID_REQUIRED');
    }
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);
    const skip = (page - 1) * limit;

    const where: any = { product_id: productId };
    if (query.rating && Number.isInteger(query.rating) && query.rating >= 1 && query.rating <= 5) {
        where.rating = query.rating;
    }
    const [reviews, filterTotal, ratingGroup] = await Promise.all([
        prisma.review.findMany({
            where,
            skip,
            take: limit,
            orderBy: { created_at: 'desc' },
            include: { user: { select: { id: true, full_name: true, avatar_url: true } } },
        }),
        prisma.review.count({ where }),
        prisma.review.groupBy({
            by: ['rating'],
            where: { product_id: productId },
            _count: { rating: true },
        }),
    ]);
    const breakdown: Record<number, { count: number; percentage: number }> = {
        5: { count: 0, percentage: 0 },
        4: { count: 0, percentage: 0 },
        3: { count: 0, percentage: 0 },
        2: { count: 0, percentage: 0 },
        1: { count: 0, percentage: 0 },
    };
    let totalReviews = 0;
    let totalRating = 0;
    for (const group of ratingGroup) {
        const count = group._count.rating;
        breakdown[group.rating] = { count, percentage: 0 };
        totalReviews += count;
        totalRating += group.rating * count;
    }
    if (totalReviews > 0) {
        for (let star = 1; star <= 5; star++) {
            breakdown[star].percentage = Math.round((breakdown[star].count / totalReviews) * 100);
        }
    }
    const averageRating = totalReviews > 0 ? Number((totalRating / totalReviews).toFixed(1)) : 0;

    return {
        sumary: {
            totalReviews,
            averageRating,
            breakdown,
        },
        reviews,
        pagination: {
            page,
            limit,
            totalPages: Math.ceil(filterTotal / limit),
            totalItems: filterTotal,
        },
    };
};
