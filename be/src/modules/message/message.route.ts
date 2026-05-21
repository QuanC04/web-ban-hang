import { Router } from 'express';
import { authenticate } from '../../middleware/authicate';
import {
    listConversationsController,
    listMessagesController,
    sendMessageController,
    startConversationController,
} from './message.controller';

const messageRouter: Router = Router();

messageRouter.use(authenticate);
messageRouter.get('/conversations', listConversationsController);
messageRouter.post('/conversations', startConversationController);
messageRouter.get('/conversations/:conversationId/messages', listMessagesController);
messageRouter.post('/conversations/:conversationId/messages', sendMessageController);

export default messageRouter;
