FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
COPY prisma.config.ts tsconfig.json ./

RUN pnpm install --frozen-lockfile

COPY src ./src

RUN pnpm build

EXPOSE 3000

CMD ["sh", "-c", "pnpm db:migrate && pnpm start"]
