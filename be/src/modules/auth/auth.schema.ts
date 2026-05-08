import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().min(3, 'Username phải có ít nhất 3 ký tự'),
    email: z.email('Email không hợp lệ'),
    password: z.string().min(6).max(100),
});
export const loginSchema = z.object({
    username: z.string().min(1, 'Username là bắt buộc'),
    password: z.string().min(1, 'Mật khẩu là bắt buộc'),
});
