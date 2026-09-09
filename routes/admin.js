const express = require('express');
const router = express.Router();
const prisma = require('../db/pool');
const isAuth = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');

// === ЗАЩИТА ВСЕХ МАРШРУТОВ ===
router.use(isAuth);   // сначала проверяем, залогинен ли
//router.use(isAdmin);  // потом проверяем, админ ли

// === МАРШРУТЫ (без дублей isAuth) ===

// Все посты
router.get('/', async (req, res) => {
  const posts = await prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  });
  res.render('admin/index', { posts });
});

// Форма создания поста
router.get('/new', (req, res) => {
  res.render('admin/edit', { post: null });
});

// Форма редактирования
router.get('/edit/:id', async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { id: Number(req.params.id) },
  });
  res.render('admin/edit', { post });
});

// Сохранение (создание или обновление)
router.post('/save', async (req, res) => {
  const { id, title, content, published } = req.body;

  if (id) {
    await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content, published: published === 'on' },
    });
  } else {
    await prisma.post.create({
      data: {
        title,
        content,
        published: published === 'on',
        authorId: req.user.id,
      },
    });
  }
  res.redirect('/admin');
});

// Удаление поста
router.post('/delete/:id', async (req, res) => {
  await prisma.post.delete({
    where: { id: Number(req.params.id) },
  });
  res.redirect('/admin');
});

module.exports = router;