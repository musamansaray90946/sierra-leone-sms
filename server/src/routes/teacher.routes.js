const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const teachers = await prisma.teacher.findMany({
      include: { school: { select: { name: true } }, user: { select: { email: true } } },
      orderBy: { lastName: 'asc' }
    });
    res.json({ success: true, count: teachers.length, data: teachers });
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: req.params.id },
      include: { classes: { include: { class: true, subject: true } } }
    });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json({ success: true, data: teacher });
  } catch (error) { next(error); }
});

module.exports = router;