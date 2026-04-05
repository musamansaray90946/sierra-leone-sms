const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const getStudents = async (req, res, next) => {
  try {
    const { classId, schoolId, search } = req.query;
    const where = {};
    if (classId) where.classId = classId;
    if (schoolId) where.schoolId = schoolId;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { admissionNo: { contains: search, mode: 'insensitive' } }
      ];
    }
    const students = await prisma.student.findMany({
      where,
      include: {
        class: true,
        school: { select: { name: true } },
        parent: true
      },
      orderBy: { lastName: 'asc' }
    });
    res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    next(error);
  }
};

const getStudent = async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.id },
      include: {
        class: true,
        school: true,
        parent: true,
        attendances: { orderBy: { date: 'desc' }, take: 30 },
        fees: true
      }
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, gender, dateOfBirth, address, district, phone, classId, schoolId, parentId } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const year = new Date().getFullYear().toString().slice(-2);
    const count = await prisma.student.count();
    const admissionNo = `SL${year}${String(count + 1).padStart(4, '0')}`;
    const hashedPassword = await bcrypt.hash(password || 'student123', 12);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, password: hashedPassword, role: 'STUDENT' }
      });
      const student = await tx.student.create({
        data: {
          userId: user.id, firstName, lastName, gender,
          dateOfBirth: new Date(dateOfBirth),
          address, district, phone, classId, schoolId, parentId, admissionNo
        },
        include: { class: true, school: { select: { name: true } } }
      });
      return student;
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const { firstName, lastName, gender, dateOfBirth, address, district, phone, classId, parentId } = req.body;
    const student = await prisma.student.update({
      where: { id: req.params.id },
      data: { firstName, lastName, gender, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined, address, district, phone, classId, parentId },
      include: { class: true }
    });
    res.json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({ where: { id: req.params.id } });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await prisma.$transaction([
      prisma.attendance.deleteMany({ where: { studentId: req.params.id } }),
      prisma.examResult.deleteMany({ where: { studentId: req.params.id } }),
      prisma.fee.deleteMany({ where: { studentId: req.params.id } }),
      prisma.student.delete({ where: { id: req.params.id } }),
      prisma.user.delete({ where: { id: student.userId } })
    ]);
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStudents, getStudent, createStudent, updateStudent, deleteStudent };