import { Router } from 'express';
import {
    registerController,
    loginController,
    logoutController,
    refreshTokenController,
    resetPasswordController,
    otpRequestController,
    otpVerifyController,
} from './auth.controller';
import { authenticate } from '../../middleware/authicate';
import { validate } from '../../middleware/validate';
import { registerSchema } from './auth.schema';

const authRoutes: Router = Router();
/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: API Quản lý xác thực người dùng
 */
/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               name:
 *                 type: string
 *                 example: Nguyen Van A
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc Email đã tồn tại
 */
authRoutes.post('/register', validate(registerSchema), registerController);
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Sai email hoặc mật khẩu
 */
authRoutes.post('/login', loginController);
/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Đăng xuất
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *       401:
 *         description: Chưa xác thực token
 */
authRoutes.post('/logout', authenticate, logoutController);
/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     summary: Làm mới Access Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cấp token mới thành công
 */
authRoutes.post('/refresh', refreshTokenController);
authRoutes.post('/otp/request', otpRequestController);
authRoutes.post('/otp/verify', otpVerifyController);
authRoutes.post('/reset-password', resetPasswordController);

export default authRoutes;
