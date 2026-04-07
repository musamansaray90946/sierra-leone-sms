const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const teacherRoutes = require('./routes/teacher.routes');
const classRoutes = require('./routes/class.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const examRoutes = require('./routes/exam.routes');
const feeRoutes = require('./routes/fee.routes');
const schoolRoutes = require('./routes/school.routes');
const uploadRoutes = require('./routes/upload.routes');
const announcementRoutes = require('./routes/announcement.routes');
const lessonRoutes = require('./routes/lesson.routes');
const assignmentRoutes = require('./routes/assignment.routes');
const passwordRoutes = require('./routes/password.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://sierra-leone-sms.vercel.app',
    'https://sierra-leone-65u8li3c5-musamansaray90946s-projects.vercel.app'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'EduManage SL API is running',
    developer: 'Musa Mansaray',
    version: '2.0.0'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/password', passwordRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`EduManage SL API running on port ${PORT}`);
  console.log(`Developer: Musa Mansaray`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});