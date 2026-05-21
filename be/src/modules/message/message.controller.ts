import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { successResponse } from '../../utils/response';
import {
    listConversations,
    listMessages,
    sendMessage,
    startConversation,
} from './message.service';

const getAuthUserId = (req: Request) => req.user?.userId as string | undefined;

export const listConversationsController = asyncHandler(async (req: Request, res: Response) => {
    const userId = getAuthUserId(req);
    const conversations = await listConversations(userId!);
    successResponse(res, conversations, 'Lấy danh sách hội thoại thành công');
});

export const startConversationController = asyncHandler(async (req: Request, res: Response) => {
    const userId = getAuthUserId(req);
    const { shopId } = req.body as { shopId?: string };

    if (!shopId) {
        return res.status(400).json({ success: false, message: 'shopId là bắt buộc' });
    }

    const conversation = await startConversation(userId!, shopId);
    successResponse(res, conversation, 'Tạo hội thoại thành công', 201);
});

export const listMessagesController = asyncHandler(async (req: Request, res: Response) => {
    const userId = getAuthUserId(req);
    const { conversationId } = req.params as { conversationId: string };
    const messages = await listMessages(conversationId, userId!);
    successResponse(res, messages, 'Lấy danh sách tin nhắn thành công');
});

export const sendMessageController = asyncHandler(async (req: Request, res: Response) => {
    const userId = getAuthUserId(req);
    const { conversationId } = req.params as { conversationId: string };
    const { content } = req.body as { content?: string };
    const result = await sendMessage(conversationId, userId!, content ?? '');
    successResponse(res, result.message, 'Gửi tin nhắn thành công', 201);
});
