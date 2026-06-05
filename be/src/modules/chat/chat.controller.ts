import { asyncHandler } from '../../middleware/errorHandler';
import { Request, Response } from 'express';
import { listConversations, startConversation } from './chat.service';
import { successResponse } from '../../utils/response';

export const startConversationController = asyncHandler(async (req: Request, res: Response) => {
    const user_id = req.user?.userId as string | undefined;
    const shop_id = req.body.shopId as string | undefined;
    const conversation = await startConversation(user_id!, shop_id!);
    successResponse(res, conversation, 'Tạo hội thoại thành công', 201);
});

export const listConversationsController = asyncHandler(async (req: Request, res: Response) => {
    const user_id = req.user?.userId as string | undefined;
    const conversations = await listConversations(user_id!);
    successResponse(res, conversations, 'Lấy danh sách hội thoại thành công');
});
