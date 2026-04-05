const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Sierra Leone SMS database...');

  const hashedPassword = await bcrypt.hash('admin123', 12);

  const adminUser = await prisma.user.upsert({
  where: { email: 'admin@sierraleone-sms.com' },
  update: { role: 'SUPER_ADMIN' },
  create: { email: 'admin@sierraleone-sms.com', password: hashedPassword, role: 'SUPER_ADMIN' }
  });

  const school = await prisma.school.upsert({
    where: { id: 'school-001' },
    update: {},
    create: {
      id: 'school-001',
      name: 'Bo Government Secondary School',
      address: 'Damballa Road, Bo',
      district: 'Bo',
      chiefdom: 'Kakua',
      phone: '+232 76 000001',
      email: 'bo.gov.sec@education.gov.sl',
      principal: 'Mr. Ibrahim Koroma'
    }
  });

  const academicYear = await prisma.academicYear.upsert({
    where: { year: '2025/2026' },
    update: {},
    create: {
      year: '2025/2026',
      isCurrent: true,
      startDate: new Date('2025-09-01'),
      endDate: new Date('2026-07-31')
    }
  });

  const jss1 = await prisma.class.create({
    data: {
      name: 'JSS 1A',
      level: 'JSS1',
      stream: 'A',
      schoolId: school.id,
      academicYearId: academicYear.id
    }
  });

  console.log('✅ Seed complete!');
  console.log('Admin login: admin@sierraleone-sms.com / admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());