const express = require('express');
const prisma = require('../db/pool');
const isAuth = require('../middleware/isAuth');

const router = express.Router();
const isAdmin = require('../middleware/isAdmin');

router.delete('/:id', isAuth, async (req, res) => {
  const post = await prisma.post.findUnique({
    where: {id: Number(req.params.id)},
  });

  if (post.authorId !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // ...
});
// 1. Получить все посты (только опубликованные)
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: { select: { username: true } },
        comments: { include: { author: { select: { username: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// 2. Получить один пост по ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: {
        author: { select: { username: true } },
        comments: { include: { author: { select: { username: true } } } },
      },
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// 3. Создать пост (только авторизованные)
router.post('/', isAuth, async (req, res) => {
  const { title, content, published = false } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        authorId: req.user.id,
      },
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create post' });
  }
});

// 4. Обновить пост (только автор или админ)
router.put('/:id', isAuth, async (req, res) => {
  const { id } = req.params;
  const { title, content, published } = req.body;

  const post = await prisma.post.findUnique({ where: { id: Number(id) } });
  if (!post) return res.status(404).json({ error: 'Post not found' });

  if (post.authorId !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const updated = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content, published },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update post' });
  }
});

// 5. Удалить пост (только автор или админ)
router.delete('/:id', isAuth, async (req, res) => {
  const { id } = req.params;

  const post = await prisma.post.findUnique({ where: { id: Number(id) } });
  if (!post) return res.status(404).json({ error: 'Post not found' });

  if (post.authorId !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    await prisma.post.delete({ where: { id: Number(id) } });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;