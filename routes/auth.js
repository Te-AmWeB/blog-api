const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../db/pool');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

// 1. Регистрация
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hashed },
    });

    res.status(201).json({ message: 'User created', user: { id: user.id, username, email } });
  } catch (err) {
    res.status(400).json({ error: 'Username or email already exists' });
  }
});

// 2. Логин
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, username: user.username, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, user: { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin } });
});

// 3. Получить профиль текущего пользователя
router.get('/me', isAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, username: true, email: true, isAdmin: true },
  });
  res.json(user);
});

module.exports = router;