require('dotenv').config();
const express = require('express');
const session = require('express-session');
const ejsMate = require('ejs-mate') // 👈 ЭТОЙ СТРОКИ НЕ ХВАТАЛО
const app = express();

// === НАСТРОЙКА EJS ===
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// === НАСТРОЙКИ ===
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// === СЕССИИ ===
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// === МАРШРУТЫ ===
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const adminRoutes = require('./routes/admin');
const webRoutes = require('./routes/web');
const loginRoutes = require('./routes/login'); // 👈 ДОБАВЬ

app.use('/', webRoutes);
app.use('/admin', adminRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/auth', authRoutes);
app.use(loginRoutes); // 👈 ДОБАВЬ

// === КОРНЕВОЙ МАРШРУТ ===
app.get('/', (req, res) => {
  res.send('Blog API is running!');
});

// === ЗАПУСК ===
const PORT = process.env.PORT || 6767;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});