const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const register = async (req, res, next) => {
  try {
    const { email, password, role, firstName, lastName, gender, schoolId } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role }
    });
    if (role === 'TEACHER') {
      await prisma.teacher.create({
        data: { userId: user.id, schoolId, firstName, lastName, gender }
      });
    }
    const token = generateToken(user.id, user.role);
    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    let profile = null;
    let school = null;

    if (user.role === 'TEACHER') {
      profile = await prisma.teacher.findUnique({
        where: { userId: user.id },
        include: { school: true }
      });
      school = profile?.school;
    } else if (user.role === 'STUDENT') {
      profile = await prisma.student.findUnique({
        where: { userId: user.id },
        include: { school: true, class: true }
      });
      school = profile?.school;
    } else if (['ADMIN', 'SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(user.role)) {
      const schools = await prisma.school.findMany({ take: 1 });
      school = schools[0] || null;
    }

    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile,
        school
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, role: true, createdAt: true }
    });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const loginByAdmissionNo = async (req, res, next) => {
  try {
    const { admissionNo, password } = req.body;
    if (!admissionNo || !password) {
      return res.status(400).json({ message: 'Please provide admission number and password' });
    }

    const student = await prisma.student.findUnique({
      where: { admissionNo },
      include: { user: true, school: true, class: true }
    });

    if (!student) {
      return res.status(401).json({ message: 'Invalid admission number or password' });
    }

    const isMatch = await bcrypt.compare(password, student.user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admission number or password' });
    }

    const token = generateToken(student.user.id, student.user.role);

    res.json({
      success: true,
      token,
      user: {
        id: student.user.id,
        email: student.user.email,
        role: student.user.role,
        profile: student,
        school: student.school
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, loginByAdmissionNo, getMe };