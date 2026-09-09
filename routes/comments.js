const express = require('express');
const prisma = require('../db/pool');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

// 1. Получить все комментарии к посту
router.get('/post/:postId', async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(postId) },
      include: { author: { select: { username: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// 2. Создать комментарий
router.post('/post/:postId', isAuth, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  const post = await prisma.post.findUnique({ where: { id: Number(postId) } });
  if (!post) return res.status(404).json({ error: 'Post not found' });

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId: Number(postId),
        authorId: req.user.id,
      },
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create comment' });
  }
});

// 3. Удалить комментарий (только автор или админ)
router.delete('/:id', isAuth, async (req, res) => {
  const { id } = req.params;
  const comment = await prisma.comment.findUnique({ where: { id: Number(id) } });
  if (!comment) return res.status(404).json({ error: 'Comment not found' });

  if (comment.authorId !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    await prisma.comment.delete({ where: { id: Number(id) } });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;