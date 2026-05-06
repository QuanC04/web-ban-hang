import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { errorHandler } from './middleware/errorHandler';
import { successResponse } from './utils/response';
import authRoutes from './modules/auth/auth.route';
import userRoutes from './modules/user/user.route';
import addressRoutes from './modules/address/address.route';
import productsRoute from './modules/products/products.route';
import uploadRoute from './modules/upload/upload.route';
import marketProductRoute from './modules/marketProduct/marketProduct.route';
import cartRouter from './modules/cart/cart.route';
import orderRouter from './modules/order/order.route';

const app: Application = express();

// ==================== MIDDLEWARES ====================
app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== ROUTES ====================
app.get('/api/health', (req, res) => {
    successResponse(
        res,
        { status: 'OK', timestamp: new Date().toISOString() },
        'Server is running',
    );
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/products', productsRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/market', marketProductRoute);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// ==================== ERROR HANDLER ====================
app.use(errorHandler);

export default app;
