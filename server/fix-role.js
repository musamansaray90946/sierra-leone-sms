const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: { email: 'admin@sierraleone-sms.com' },
    data: { role: 'SUPER_ADMIN' }
  });
  console.log('Updated role to:', user.role);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());