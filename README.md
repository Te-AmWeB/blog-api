# 📝 Blog API

A full‑stack blog application built with Node.js, Express, PostgreSQL, and Prisma.  
Features include user authentication, admin panel, post management, and comments.

---

## 🚀 Features

- Public blog with posts and comments
- Admin panel (create, edit, delete posts)
- User authentication (register / login)
- Role‑based access (admin only)
- Comments system
- Responsive design

---

## 🛠️ Tech Stack

Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- EJS (templating)

Frontend
- HTML5
- CSS3
- Responsive layout

Authentication
- Session‑based auth
- JWT (API)
---

## 🔐 Admin Access

To make a user an admin:

`sql
UPDATE "User"
SET "isAdmin" = true
WHERE email = 'your_email@example.com';
---

## 📁 Project Structure
git clone https://github.com/Te-AmWeB/blog-api.git
cd blog-api
npm install
npx prisma migrate dev --name init
node app.js
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/blog_db"
JWT_SECRET="your-secret-key"
SESSION_SECRET="your-session-secret"
PORT=6767
## 👥 Team

| Role | Name | GitHub |
|------|------|--------|
| Backend & Architecture | Team| [Te-AmWeB](https://github.com/Te-AmWeB) |
| Frontend & Design |Stack  | [Stack](https://github.com/Stack-zzz) |

---

Built with ❤️ by two brothers on their way to becoming full‑stack developers.

https://github.com/Te-AmWeB/blog-api/blob/main/Lobby.png

https://github.com/Te-AmWeB/blog-api/blob/main/admin.png

https://github.com/Te-AmWeB/blog-api/blob/main/login.png


