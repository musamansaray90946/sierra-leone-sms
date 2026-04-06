const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return res.json({ success: true, data: announcements });
  } catch (error) {
    console.error('GET /announcements error:', error.message);
    return res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, message, schoolId, sendSMS } = req.body;
    console.log('Creating announcement:', { title, schoolId });

    const announcement = await prisma.announcement.create({
      data: {
        title: title || 'Untitled',
        message: message || '',
        schoolId: schoolId,
        sendSMS: sendSMS === true,
      }
    });
    return res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    console.error('POST /announcements error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;