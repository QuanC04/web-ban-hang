import prisma from '../../lib/prisma';
import { Request } from 'express';

export const getMe = async (req: Request) => {
    const userId = (req as any).user?.userId;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            full_name: true,
            avatar_url: true,
            username: true,
            email: true,
            phone_number: true,
            role: true,
            created_at: true,
        },
    });

    return user;
};

export const updateProfile = async (req: Request) => {
    const userId = req.user?.userId;
    const { phone_number, full_name, avatar_url, avatar_key } = req.body;
    const user = await prisma.user.update({
        where: { id: userId },
        data: { phone_number, full_name, avatar_url, avatar_key },
        select: {
            id: true,
            username: true,
            full_name: true,
            avatar_url: true,
            avatar_key: true,
            email: true,
            phone_number: true,
            role: true,
            created_at: true,
        },
    });
    return user;
};

export const getAllUser = async (req: Request) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            full_name: true,
            avatar_url: true,
            username: true,
            email: true,
            phone_number: true,
            role: true,
            created_at: true,
        },
    });
    return users;
};
