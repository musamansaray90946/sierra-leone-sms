const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

const resetCodes = new Map();

router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ success: true, message: 'If email exists, a reset code has been sent' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    resetCodes.set(email, { code, expires: Date.now() + 15 * 60 * 1000 });

    console.log(`Password reset code for ${email}: ${code}`);

    res.json({
      success: true,
      message: 'Reset code generated',
      code: process.env.NODE_ENV === 'development' ? code : undefined
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/reset', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const stored = resetCodes.get(email);

    if (!stored || stored.code !== code || Date.now() > stored.expires) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    resetCodes.delete(email);
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;