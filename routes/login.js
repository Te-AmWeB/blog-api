const express = require('express');
const bcrypt = require('bcrypt');
const prisma = require('../db/pool');

const router = express.Router();

// Страница входа
router.get('/login', (req, res) => {
  res.render('login');
});

// Обработка входа
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.send('Invalid email or password. <a href="/login">Try again</a>');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.send('Invalid email or password. <a href="/login">Try again</a>');
  }

  req.session.userId = user.id;
  req.session.isAdmin = user.isAdmin;

  res.redirect('/admin');
});
// Страница регистрации
router.get('/register', (req, res) => {
  res.render('register');
});

// Обработка регистрации
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { username, email, password: hashed },
  });

  res.redirect('/login');
});

// Выход
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;