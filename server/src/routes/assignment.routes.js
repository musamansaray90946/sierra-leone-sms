const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { subjectId, teacherId } = req.query;
    const where = {};
    if (subjectId) where.subjectId = subjectId;
    if (teacherId) where.teacherId = teacherId;
    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        teacher: { select: { firstName: true, lastName: true } },
        subject: { select: { name: true } },
        _count: { select: { submissions: true } }
      },
      orderBy: { dueDate: 'asc' }
    });
    res.json({ success: true, data: assignments });
  } catch (error) { next(error); }
});

router.post('/', authorize('TEACHER', 'SCHOOL_ADMIN'), async (req, res, next) => {
  try {
    const { title, description, fileUrl, dueDate, subjectId, teacherId, term, maxScore } = req.body;
    const assignment = await prisma.assignment.create({
      data: { title, description, fileUrl, dueDate: new Date(dueDate), subjectId, teacherId, term, maxScore }
    });
    res.status(201).json({ success: true, data: assignment });
  } catch (error) { next(error); }
});

router.post('/:id/submit', authorize('STUDENT'), async (req, res, next) => {
  try {
    const { studentId, fileUrl, remarks } = req.body;
    const submission = await prisma.submission.upsert({
      where: { assignmentId_studentId: { assignmentId: req.params.id, studentId } },
      update: { fileUrl, remarks },
      create: { assignmentId: req.params.id, studentId, fileUrl, remarks }
    });
    res.status(201).json({ success: true, data: submission });
  } catch (error) { next(error); }
});

module.exports = router;