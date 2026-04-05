const express = require('express');
const { getStudents, getStudent, createStudent, updateStudent, deleteStudent } = require('../controllers/student.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getStudents)
  .post(authorize('ADMIN'), createStudent);

router.route('/:id')
  .get(getStudent)
  .put(authorize('ADMIN'), updateStudent)
  .delete(authorize('ADMIN'), deleteStudent);

module.exports = router;