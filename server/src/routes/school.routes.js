const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.get('/', protect, authorize('SUPER_ADMIN'), async (req, res, next) => {
  try {
    const schools = await prisma.school.findMany({
      include: {
        _count: { select: { students: true, teachers: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: schools });
  } catch (error) { next(error); }
});

router.post('/', protect, authorize('SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { name, address, district, chiefdom, phone, email, subscriptionPlan, maxStudents } = req.body;
    const school = await prisma.school.create({
      data: { name, address, district, chiefdom, phone, email, subscriptionPlan, maxStudents: maxStudents || 200 }
    });
    res.status(201).json({ success: true, data: school });
  } catch (error) { next(error); }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const school = await prisma.school.findUnique({
      where: { id: req.params.id },
      include: {
        _count: { select: { students: true, teachers: true, classes: true } }
      }
    });
    if (!school) return res.status(404).json({ message: 'School not found' });
    res.json({ success: true, data: school });
  } catch (error) { next(error); }
});

router.put('/:id', protect, authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'), async (req, res, next) => {
  try {
    const school = await prisma.school.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json({ success: true, data: school });
  } catch (error) { next(error); }
});

module.exports = router;