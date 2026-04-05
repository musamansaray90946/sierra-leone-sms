const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { upload, uploadToCloudinary } = require('../middleware/upload.middleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.post('/photo/:userId', protect, upload.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const result = await uploadToCloudinary(req.file.buffer, 'profiles');

    await prisma.user.update({
      where: { id: req.params.userId },
      data: { photoUrl: result.secure_url }
    });

    res.json({ success: true, url: result.secure_url });
  } catch (error) { next(error); }
});

router.post('/document', protect, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const isImage = req.file.mimetype.startsWith('image/');
    const result = await uploadToCloudinary(
      req.file.buffer,
      'documents',
      isImage ? 'image' : 'raw'
    );

    res.json({ success: true, url: result.secure_url, type: req.file.mimetype });
  } catch (error) { next(error); }
});

module.exports = router;