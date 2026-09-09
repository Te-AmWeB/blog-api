const prisma = require('../db/pool');

async function isAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
    });

    if (!user) {
      return res.redirect('/login');
    }

    req.user = user; // 👈 ЗАПОМИНАЕМ ПОЛЬЗОВАТЕЛЯ
    next();
  } catch (err) {
    res.redirect('/login');
  }
}

module.exports = isAuth;