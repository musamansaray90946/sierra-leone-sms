const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { schoolId } = req.query;
    const where = schoolId ? { schoolId } : {};
    const announcements = await prisma.announcement.findMany({
      where,
      include: { principal: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: announcements });
  } catch (error) { next(error); }
});

router.post('/', authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'), async (req, res, next) => {
  try {
    const { title, message, schoolId, principalId, sendSMS, targetRole } = req.body;
    const announcement = await prisma.announcement.create({
      data: { title, message, schoolId, principalId, sendSMS: sendSMS || false, targetRole }
    });
    res.status(201).json({ success: true, data: announcement });
  } catch (error) { next(error); }
});

module.exports = router;