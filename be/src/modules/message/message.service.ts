import prisma from '../../lib/prisma';

const conversationSelect = {
    id: true,
    buyer_id: true,
    shop_id: true,
    status: true,
    last_message_text: true,
    last_message_at: true,
    created_at: true,
    updated_at: true,
    buyer: {
        select: {
            id: true,
            full_name: true,
            username: true,
            avatar_url: true,
        },
    },
    shop: {
        select: {
            id: true,
            full_name: true,
            username: true,
            avatar_url: true,
        },
    },
} as const;

const messageSelect = {
    id: true,
    conversation_id: true,
    sender_id: true,
    sender_type: true,
    content: true,
    is_read: true,
    created_at: true,
    sender: {
        select: {
            id: true,
            full_name: true,
            username: true,
            avatar_url: true,
        },
    },
} as const;

export const listConversations = async (userId: string) => {
    return prisma.conversation.findMany({
        where: {
            OR: [{ buyer_id: userId }, { shop_id: userId }],
        },
        select: conversationSelect,
        orderBy: [{ last_message_at: 'desc' }, { updated_at: 'desc' }],
    });
};

export const startConversation = async (buyerId: string, shopId: string) => {
    if (buyerId === shopId) {
        throw Object.assign(new Error('Không thể tự nhắn tin với chính mình'), { statusCode: 400 });
    }

    const shop = await prisma.user.findUnique({
        where: { id: shopId },
        select: { id: true },
    });

    if (!shop) {
        throw Object.assign(new Error('Shop không tồn tại'), { statusCode: 404 });
    }

    return prisma.conversation.upsert({
        where: {
            buyer_id_shop_id: {
                buyer_id: buyerId,
                shop_id: shopId,
            },
        },
        create: {
            buyer_id: buyerId,
            shop_id: shopId,
        },
        update: {},
        select: conversationSelect,
    });
};

export const getConversationForUser = async (conversationId: string, userId: string) => {
    return prisma.conversation.findFirst({
        where: {
            id: conversationId,
            OR: [{ buyer_id: userId }, { shop_id: userId }],
        },
        select: conversationSelect,
    });
};

export const listMessages = async (conversationId: string, userId: string) => {
    const conversation = await getConversationForUser(conversationId, userId);
    if (!conversation) {
        throw Object.assign(new Error('Hội thoại không tồn tại'), { statusCode: 404 });
    }

    return prisma.message.findMany({
        where: { conversation_id: conversationId },
        select: messageSelect,
        orderBy: { created_at: 'asc' },
        take: 100,
    });
};

export const sendMessage = async (conversationId: string, senderId: string, content: string) => {
    const normalizedContent = content.trim();
    if (!normalizedContent) {
        throw Object.assign(new Error('Nội dung tin nhắn là bắt buộc'), { statusCode: 400 });
    }

    const conversation = await getConversationForUser(conversationId, senderId);
    if (!conversation) {
        throw Object.assign(new Error('Hội thoại không tồn tại'), { statusCode: 404 });
    }

    const senderType = conversation.shop_id === senderId ? 'shop' : 'buyer';

    const message = await prisma.$transaction(async (tx) => {
        const createdMessage = await tx.message.create({
            data: {
                conversation_id: conversationId,
                sender_id: senderId,
                sender_type: senderType,
                content: normalizedContent,
            },
            select: messageSelect,
        });

        await tx.conversation.update({
            where: { id: conversationId },
            data: {
                last_message_text: normalizedContent,
                last_message_at: createdMessage.created_at,
            },
        });

        return createdMessage;
    });

    return {
        message,
        conversation,
        recipientIds: [conversation.buyer_id, conversation.shop_id],
    };
};
