const prisma = require('../db/pool');

async function getAllPublished() {
  return await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { username: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

async function getById(id) {
  return await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { username: true } },
      comments: { include: { author: { select: { username: true } } } },
    },
  });
}

async function createPost(title, content, published, authorId) {
  return await prisma.post.create({
    data: { title, content, published, authorId },
  });
}

async function updatePost(id, title, content, published) {
  return await prisma.post.update({
    where: { id },
    data: { title, content, published },
  });
}

async function deletePost(id) {
  return await prisma.post.delete({ where: { id } });
}

async function getAll() {
  return await prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = {
  getAllPublished,
  getById,
  createPost,
  updatePost,
  deletePost,
  getAll,
};