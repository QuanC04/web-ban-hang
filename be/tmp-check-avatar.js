require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

(async () => {
  const total = await prisma.user.count();
  const withAvatar = await prisma.user.count({
    where: { avatar_url: { not: null } },
  });
  const sample = await prisma.user.findMany({
    where: { avatar_url: { not: null } },
    select: { id: true, username: true, avatar_url: true },
    take: 5,
  });

  console.log(JSON.stringify({ totalUsers: total, usersWithAvatar: withAvatar, sample }, null, 2));
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
