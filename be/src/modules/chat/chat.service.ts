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

export const startConversation = async (buyer_id: string, shop_id: string) => {
    if (buyer_id === shop_id) {
        throw Object.assign(new Error('Không thể tự nhắn tin với chính mình'), { statusCode: 400 });
    }
    const shop = await prisma.user.findUnique({
        where: { id: shop_id },
        select: { id: true },
    });
    if (!shop) {
        throw Object.assign(new Error('Shop không tồn tại'), { statusCode: 404 });
    }
    return prisma.conversation.upsert({
        where: { buyer_id_shop_id: { buyer_id, shop_id } },
        update: {},
        create: { buyer_id, shop_id },
        select: conversationSelect,
    });
};

export const listConversations = async (userId: string) => {
    return prisma.conversation.findMany({
        where: {
            OR: [{ buyer_id: userId }, { shop_id: userId }],
        },
        select: conversationSelect,
        orderBy: [{ last_message_at: 'desc' }, { updated_at: 'desc' }],
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

export const sendMessage = async (conversationId: string, senderId: string, content: string) => {
    const normalizedContent = content.trim();
    if (!normalizedContent) {
        throw Object.assign(new Error('Nội dung tin nhắn là bắt buộc'), { statusCode: 400 });
    }
    const conversation = await getConversationForUser(conversationId, senderId);
    if (!conversation) {
        throw Object.assign(
            new Error('Cuộc trò chuyện không tồn tại hoặc bạn không có quyền gửi tin nhắn'),
            { statusCode: 404 },
        );
    }
    const senderType = conversation.buyer_id === senderId ? 'buyer' : 'shop';
    const message = await prisma.$transaction(async (tx) => {
        const newMessage = await tx.message.create({
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
                last_message_at: newMessage.created_at,
            },
        });
        return newMessage;
    });
    return { message, conversation };
};
