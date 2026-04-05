const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { studentId, status, term } = req.query;
    const where = {};
    if (studentId) where.studentId = studentId;
    if (status) where.status = status;
    if (term) where.term = term;
    const fees = await prisma.fee.findMany({
      where,
      include: {
        student: { select: { firstName: true, lastName: true, admissionNo: true } },
        academicYear: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: fees });
  } catch (error) { next(error); }
});

router.post('/', authorize('ADMIN'), async (req, res, next) => {
  try {
    const { studentId, academicYearId, term, amount, dueDate, description } = req.body;
    const fee = await prisma.fee.create({
      data: { studentId, academicYearId, term, amount, dueDate: new Date(dueDate), description }
    });
    res.status(201).json({ success: true, data: fee });
  } catch (error) { next(error); }
});

router.patch('/:id/pay', authorize('ADMIN'), async (req, res, next) => {
  try {
    const { amountPaid } = req.body;
    const existing = await prisma.fee.findUnique({ where: { id: req.params.id } });
    const totalPaid = existing.amountPaid + amountPaid;
    const status = totalPaid >= existing.amount ? 'PAID' : totalPaid > 0 ? 'PARTIAL' : 'UNPAID';
    const fee = await prisma.fee.update({
      where: { id: req.params.id },
      data: { amountPaid: totalPaid, status, paidDate: status === 'PAID' ? new Date() : null }
    });
    res.json({ success: true, data: fee });
  } catch (error) { next(error); }
});

module.exports = router;