const prisma = require('../db/pool');

async function findByEmail(email) {
  return await prisma.user.findUnique({ where: { email } });
}

async function findByUsername(username) {
  return await prisma.user.findUnique({ where: { username } });
}

async function createUser(username, email, passwordHash) {
  return await prisma.user.create({
    data: { username, email, password: passwordHash },
  });
}

async function findById(id) {
  return await prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, email: true, isAdmin: true },
  });
}

module.exports = {
  findByEmail,
  findByUsername,
  createUser,
  findById,
};