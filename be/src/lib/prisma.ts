import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
    throw new Error('Missing DATABASE_URL in environment variables');
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const adapterUrl = process.env.DATABASE_URL.startsWith('mysql://')
    ? process.env.DATABASE_URL.replace('mysql://', 'mariadb://')
    : process.env.DATABASE_URL;

const adapter = new PrismaMariaDb(adapterUrl);

const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
