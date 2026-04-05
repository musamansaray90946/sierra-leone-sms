const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const exams = await prisma.exam.findMany({
      include: { class: true, academicYear: true, _count: { select: { results: true } } },
      orderBy: { startDate: 'desc' }
    });
    res.json({ success: true, data: exams });
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, term, classId, academicYearId, startDate, endDate } = req.body;
    const exam = await prisma.exam.create({
      data: { name, term, classId, academicYearId, startDate: new Date(startDate), endDate: new Date(endDate) }
    });
    res.status(201).json({ success: true, data: exam });
  } catch (error) { next(error); }
});

router.post('/:id/results', async (req, res, next) => {
  try {
    const { results } = req.body;
    const created = await prisma.$transaction(
      results.map(r =>
        prisma.examResult.upsert({
          where: { examId_studentId_subjectId: { examId: req.params.id, studentId: r.studentId, subjectId: r.subjectId } },
          update: { score: r.score, grade: r.grade, remarks: r.remarks },
          create: { examId: req.params.id, studentId: r.studentId, subjectId: r.subjectId, score: r.score, grade: r.grade, remarks: r.remarks }
        })
      )
    );
    res.status(201).json({ success: true, count: created.length });
  } catch (error) { next(error); }
});

module.exports = router;