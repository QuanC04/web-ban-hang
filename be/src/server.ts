import app from './app';
import { createServer } from 'http';
import { initChatSocket } from './socket';

const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);

initChatSocket(httpServer);

httpServer.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});
