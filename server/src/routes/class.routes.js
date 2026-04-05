const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        school: { select: { name: true } },
        academicYear: true,
        _count: { select: { students: true } }
      },
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, data: classes });
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, level, stream, schoolId, academicYearId } = req.body;
    const cls = await prisma.class.create({
      data: { name, level, stream, schoolId, academicYearId }
    });
    res.status(201).json({ success: true, data: cls });
  } catch (error) { next(error); }
});

module.exports = router;