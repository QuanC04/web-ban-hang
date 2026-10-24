import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../../middleware/errorHandler';
import { LoginPayload, RegisterPayload } from '../../models';
import { createHmac, randomInt, randomUUID, timingSafeEqual } from 'node:crypto';
import { sendOtpEmail } from '../../lib/nodemailer';

// ==================== CONSTANTS ====================

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'secret';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'secret';
const ACCESS_TOKEN_EXPIRES = '15m';
const REFRESH_TOKEN_EXPIRES = '7d';

// ==================== HELPERS ====================

const generateTokens = (userId: string, role: string) => {
    const accessToken = jwt.sign({ userId, role }, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES,
    });
    const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES,
    });
    return { accessToken, refreshToken };
};
const otpPepper = process.env.OTP_PEPPER;

if (!otpPepper) {
    throw new Error('OTP_PEPPER is required');
}
function generateOtp(): string {
    return randomInt(0, 1_000_000).toString().padStart(6, '0');
}
function hashOtp(challengeId: string, code: string): string {
    return createHmac('sha256', otpPepper!).update(`${challengeId}:${code}`).digest('hex');
}
function isOtpValid(challengeId: string, code: string, hash: string): boolean {
    const submittedHash = hashOtp(challengeId, code);
    return submittedHash === hash;
}

// ==================== SERVICE METHODS ====================

export const register = async (payload: RegisterPayload) => {
    const { username, email, password } = payload;

    if (!username || !email || !password) {
        throw new AppError('Username, email và password là bắt buộc', 400, 'AUTH_REQUIRED_FIELDS');
    }

    // Kiểm tra email hoặc username đã tồn tại chưa
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ email }, { username }],
        },
    });
    if (existingUser) {
        const field = existingUser.email === email ? 'Email' : 'Username';
        throw new AppError(`${field} đã được sử dụng`, 409, 'AUTH_ACCOUNT_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            role: 'customer',
        },
        select: {
            id: true,
            username: true,
            email: true,
            phone_number: true,
            created_at: true,
        },
    });

    return { user: newUser };
};

export const login = async (payload: LoginPayload) => {
    const { username, password } = payload;

    if (!username || !password) {
        throw new AppError('Username và password là bắt buộc', 400, 'AUTH_REQUIRED_FIELDS');
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
        throw new AppError('Tài khoản không tồn tại', 401, 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError('Mật khẩu không chính xác', 401, 'INVALID_CREDENTIALS');
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

export const logout = async (userId?: string) => {
    if (userId) {
        await prisma.user.update({
            where: { id: userId },
            data: { refresh_token: null },
        });
    }
};

export const refreshToken = async (refreshToken: string) => {
    if (!refreshToken) {
        throw new AppError('Refresh token là bắt buộc', 400, 'REFRESH_TOKEN_REQUIRED');
    }

    let decoded: any;

    try {
        decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new AppError(
            'Refresh token không hợp lệ hoặc đã hết hạn',
            401,
            'INVALID_REFRESH_TOKEN',
        );
    }

    const userId = decoded.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.refresh_token !== refreshToken) {
        throw new AppError(
            'Refresh token không hợp lệ hoặc đã hết hạn',
            401,
            'INVALID_REFRESH_TOKEN',
        );
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id, user.role);

    // Cập nhật refresh token mới vào DB
    await prisma.user.update({
        where: { id: userId },
        data: { refresh_token: newRefreshToken },
    });

    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
};

export const otpRequest = async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!email) {
        throw new AppError('Email là bắt buộc', 400, 'AUTH_REQUIRED_FIELDS');
    }

    const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: {
            id: true,
            email: true,
        },
    });
    if (!user) {
        throw new AppError('Tài khoản không tồn tại', 404, 'AUTH_ACCOUNT_NOT_FOUND');
    }
    const lastOtp = await prisma.otp.findFirst({
        where: { user_id: user.id },
        orderBy: { created_at: 'desc' },
    });
    if (lastOtp && Date.now() - new Date(lastOtp.created_at).getTime() < 60 * 1000) {
        const remainingSeconds = Math.ceil(
            (60 * 1000 - (Date.now() - new Date(lastOtp.created_at).getTime())) / 1000,
        );
        throw new AppError(
            `Vui lòng đợi ${remainingSeconds} giây trước khi yêu cầu mã mới`,
            429,
            'OTP_RATE_LIMITED',
        );
    }
    const otpCode = generateOtp();
    await prisma.otp.updateMany({
        where: { user_id: user.id, consumed_at: null },
        data: {
            consumed_at: new Date(),
        },
    });
    const otpId = randomUUID();

    await prisma.otp.create({
        data: {
            id: otpId,
            user_id: user.id,
            code_hash: hashOtp(otpId, otpCode),
            expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 phút
        },
    });

    await sendOtpEmail(user.email, otpCode);

    return { message: 'OTP đã được gửi đến email của bạn' };
};

export const otpVerify = async (email: string, code: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: {
            id: true,
            email: true,
        },
    });
    if (!user) {
        throw new AppError('Tài khoản không tồn tại', 404, 'AUTH_ACCOUNT_NOT_FOUND');
    }
    const otpRecord = await prisma.otp.findFirst({
        where: {
            user_id: user.id,
            consumed_at: null,
        },
        orderBy: { created_at: 'desc' },
    });
    if (!otpRecord) {
        throw new AppError('Không tìm thấy OTP hợp lệ', 404, 'OTP_NOT_FOUND');
    }
    if (otpRecord.expires_at < new Date()) {
        throw new AppError('OTP đã hết hạn', 400, 'OTP_EXPIRED');
    }
    if (!isOtpValid(otpRecord.id, code, otpRecord.code_hash)) {
        const newAttempts = otpRecord.attempts + 1;
        await prisma.otp.update({
            where: { id: otpRecord.id },
            data: { attempts: newAttempts },
        });
        if (newAttempts >= 5) {
            await prisma.otp.update({
                where: { id: otpRecord.id },
                data: { consumed_at: new Date() },
            });
            throw new AppError(
                'Bạn đã nhập sai OTP quá nhiều lần. Vui lòng yêu cầu OTP mới.',
                400,
                'OTP_TOO_MANY_ATTEMPTS',
            );
        }
        throw new AppError(
            `Mã OTP không chính xác. Bạn còn ${5 - newAttempts} lần thử.`,
            400,
            'OTP_INVALID',
        );
    }
    const resetToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
        expiresIn: '15m',
    });
    await prisma.otp.update({
        where: { id: otpRecord.id },
        data: { consumed_at: new Date() },
    });
    return { resetToken };
};

export const resetPassword = async (resetToken: string, newPassword: string) => {
    if (!resetToken || !newPassword) {
        throw new AppError('Reset token và mật khẩu mới là bắt buộc', 400, 'AUTH_REQUIRED_FIELDS');
    }

    let decoded: any;

    try {
        decoded = jwt.verify(resetToken, REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new AppError('Reset token không hợp lệ hoặc đã hết hạn', 401, 'INVALID_RESET_TOKEN');
    }

    const userId = decoded.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new AppError('Tài khoản không tồn tại', 404, 'AUTH_ACCOUNT_NOT_FOUND');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword, refresh_token: null },
    });

    return { message: 'Mật khẩu đã được đặt lại thành công' };
};
