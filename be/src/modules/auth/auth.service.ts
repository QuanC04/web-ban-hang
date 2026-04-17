import { Request, Response } from 'express';
import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorResponse } from '../../utils/response';

// ==================== CONSTANTS ====================

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret_fallback';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret_fallback';
const ACCESS_TOKEN_EXPIRES = '15m';
const REFRESH_TOKEN_EXPIRES = '7d';

// ==================== HELPERS ====================

const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign(
    { userId, role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES }
  );
  const refreshToken = jwt.sign(
    { userId },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES }
  );
  return { accessToken, refreshToken };
};

// ==================== SERVICE METHODS ====================

export const register = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    errorResponse(res, 'Username, email và password là bắt buộc', 400);
    return;
  }

  // Kiểm tra email hoặc username đã tồn tại chưa
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });
  if (existingUser) {
    const field = existingUser.email === email ? 'Email' : 'Username';
    errorResponse(res, `${field} đã được sử dụng`, 409);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role: role || 'customer',
    },
    select: {
      id: true,
      username: true,
      email: true,
      phone_number: true,
      role: true,
      created_at: true,
    },
  });

  return { user: newUser };
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    errorResponse(res, 'Username và password là bắt buộc', 400);
    return;
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    errorResponse(res, 'Tài khoản không tồn tại', 401);
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    errorResponse(res, 'Mật khẩu không chính xác', 401);
    return;
  }

  const { accessToken, refreshToken } = generateTokens(user.id, user.role);

  // Lưu refresh token vào DB
  await prisma.user.update({
    where: { id: user.id },
    data: { refresh_token: refreshToken },
  });

  const { password: _, refresh_token: __, access_token: ___, ...userWithoutSensitive } = user;

  return {
    user: userWithoutSensitive,
    accessToken,
    refreshToken,
  };
};

export const logout = async (req: Request) => {
  // userId được gắn bởi middleware authenticate
  const userId = (req as any).user?.userId;

  if (userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { refresh_token: null },
    });
  }
};
