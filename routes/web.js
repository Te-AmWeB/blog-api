const express = require('express');
const prisma = require('../db/pool');

const router = express.Router();

router.get('/', async (req, res)=>{
const posts = await prisma.post.findMany({
    where: {published: true},
    include: {author: {select:{username: true}}},
    orderBy: {createdAt: 'desc'},
});
res.render('posts/index', {posts});
});

router.get('/posts/:id', async (req, res)=>{
    const post = await prisma.post.findUnique({
        where: {id: Number(req.params.id)},
        include: {
            author: {select: {username: true}},
            comments: {include: {author:{select: {username: true}}}},
        },
    });
    if(!post || !post.published) {
        return res.status(404).send('Post not found');
    }
    res.render('posts/show', {post});
});
// Добавить комментарий
router.post('/posts/:id/comment', async (req, res) => {
  const { content } = req.body;
  const postId = Number(req.params.id);

  if (!content || content.trim() === '') {
    return res.redirect(`/posts/${postId}`);
  }

  const firstUser = await prisma.user.findFirst();
  if (!firstUser) {
    return res.send('No user found to attach comment. Please register first.');
  }

  await prisma.comment.create({
    data: {
      content: content.trim(),
      postId,
      authorId: firstUser.id,
    },
  });

  res.redirect(`/posts/${postId}`);
});

module.exports = router;