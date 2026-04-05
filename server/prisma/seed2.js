const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding school data...');

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
      subscriptionPlan: 'STANDARD',
      subscriptionStatus: 'ACTIVE',
      maxStudents: 500
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

  const cls = await prisma.class.create({
    data: {
      name: 'JSS 1A',
      level: 'JSS1',
      stream: 'A',
      schoolId: school.id,
      academicYearId: academicYear.id
    }
  }).catch(() => console.log('Class already exists'));

  console.log('✅ School data seeded!');
  console.log('School:', school.name);
  console.log('Academic Year:', academicYear.year);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());