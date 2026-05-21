import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { getConversationForUser, sendMessage } from './modules/message/message.service';

interface SocketUser {
    userId: string;
    role?: string;
}

interface ClientToServerEvents {
    'conversation:join': (conversationId: string) => void;
    'message:send': (
        payload: { conversationId: string; content: string },
        ack?: (response: { success: boolean; message?: unknown; error?: string }) => void,
    ) => void;
}

interface ServerToClientEvents {
    'message:new': (message: unknown) => void;
}

const getTokenFromHandshake = (authToken?: unknown, authorization?: string) => {
    if (typeof authToken === 'string' && authToken) return authToken;
    if (authorization?.startsWith('Bearer ')) return authorization.split(' ')[1];
    return null;
};

export const initChatSocket = (httpServer: HttpServer) => {
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            credentials: true,
        },
    });

    io.use((socket, next) => {
        const token = getTokenFromHandshake(
            socket.handshake.auth?.token,
            socket.handshake.headers.authorization,
        );

        if (!token) {
            return next(new Error('Unauthorized'));
        }

        try {
            socket.data.user = jwt.verify(
                token,
                process.env.JWT_ACCESS_SECRET || 'secret',
            ) as SocketUser;
            return next();
        } catch {
            return next(new Error('Unauthorized'));
        }
    });

    io.on('connection', (socket) => {
        const user = socket.data.user as SocketUser;
        socket.join(`user:${user.userId}`);

        socket.on('conversation:join', async (conversationId) => {
            const conversation = await getConversationForUser(conversationId, user.userId);
            if (conversation) {
                socket.join(`conversation:${conversationId}`);
            }
        });

        socket.on('message:send', async (payload, ack) => {
            try {
                const result = await sendMessage(payload.conversationId, user.userId, payload.content);
                result.recipientIds.forEach((recipientId) => {
                    io.to(`user:${recipientId}`).emit('message:new', result.message);
                });
                ack?.({ success: true, message: result.message });
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Không thể gửi tin nhắn';
                ack?.({ success: false, error: message });
            }
        });
    });

    return io;
};
