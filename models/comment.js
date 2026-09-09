const prisma = require('../db/pool');

async function getByPostId(postId) {
  return await prisma.comment.findMany({
    where: { postId },
    include: { author: { select: { username: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

async function createComment(content, postId, authorId) {
  return await prisma.comment.create({
    data: { content, postId, authorId },
  });
}

async function deleteComment(id) {
  return await prisma.comment.delete({ where: { id } });
}

async function findById(id) {
  return await prisma.comment.findUnique({ where: { id } });
}

module.exports = {
  getByPostId,
  createComment,
  deleteComment,
  findById,
};