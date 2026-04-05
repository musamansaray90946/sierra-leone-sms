const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { classId, date, studentId } = req.query;
    const where = {};
    if (classId) where.classId = classId;
    if (studentId) where.studentId = studentId;
    if (date) where.date = new Date(date);
    const attendance = await prisma.attendance.findMany({
      where,
      include: { student: { select: { firstName: true, lastName: true, admissionNo: true } } },
      orderBy: { date: 'desc' }
    });
    res.json({ success: true, data: attendance });
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const { records } = req.body;
    const created = await prisma.$transaction(
      records.map(r =>
        prisma.attendance.upsert({
          where: { studentId_date: { studentId: r.studentId, date: new Date(r.date) } },
          update: { status: r.status },
          create: {
            studentId: r.studentId, classId: r.classId,
            academicYearId: r.academicYearId, date: new Date(r.date),
            term: r.term, status: r.status
          }
        })
      )
    );
    res.status(201).json({ success: true, count: created.length });
  } catch (error) { next(error); }
});

module.exports = router;