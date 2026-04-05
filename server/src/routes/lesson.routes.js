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
    const lessons = await prisma.lessonNote.findMany({
      where,
      include: {
        teacher: { select: { firstName: true, lastName: true } },
        subject: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: lessons });
  } catch (error) { next(error); }
});

router.post('/', authorize('TEACHER', 'SCHOOL_ADMIN'), async (req, res, next) => {
  try {
    const { title, description, fileUrl, subjectId, teacherId, term, week } = req.body;
    const lesson = await prisma.lessonNote.create({
      data: { title, description, fileUrl, subjectId, teacherId, term, week }
    });
    res.status(201).json({ success: true, data: lesson });
  } catch (error) { next(error); }
});

module.exports = router;