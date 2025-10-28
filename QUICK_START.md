# 🚀 Quick Start Guide - Blog Platform

## Prerequisites
- Node.js v14+ installed
- npm installed

## Setup in 5 Minutes

### 1. Start Backend (Terminal 1)
```bash
cd backend
npm install
npm run start:dev
```
✅ Backend running at: http://localhost:3000
✅ Swagger docs at: http://localhost:3000/api/docs

### 2. Start Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```
✅ Frontend running at: http://localhost:3001

## First Steps

### 1. Register a User
- Open http://localhost:3001
- Click "Register"
- Fill in: email, username, password
- Submit

### 2. Create a Post
- Click "Create Post" in navbar
- Enter title and content
- Click "Publish Post"

### 3. Add Comments
- Click on any post
- Scroll to comment section
- Enter comment and submit

## API Testing

### Swagger UI
http://localhost:3000/api/docs

### Postman
Import: `backend/Blog-Platform-API.postman_collection.json`

## Project Features

✅ User Authentication (JWT)
✅ Create/Read/Update/Delete Posts
✅ Comments System
✅ Pagination
✅ Protected Routes
✅ Responsive UI
✅ SQLite Database
✅ Swagger Documentation

## Tech Stack

**Backend:** NestJS + TypeScript + SQLite + TypeORM + JWT
**Frontend:** React + React Router + Axios + Context API

## Ports

- Backend: 3000
- Frontend: 3001
- Database: SQLite file (blog-platform.db)

## Troubleshooting

**Port in use?**
- Backend: Set PORT environment variable (e.g., `PORT=3001 npm run start:dev`)
- Frontend: Will auto-prompt for different port

**Database issues?**
- Delete blog-platform.db and restart backend

**Module errors?**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. ✅ Both servers running
2. ✅ Register a user
3. ✅ Create posts
4. ✅ Add comments
5. ✅ Test API with Swagger
6. ✅ Review code structure

## Documentation

- Full README: `README.md`
- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`
- API Collection: `backend/Blog-Platform-API.postman_collection.json`

---

**Need help?** Check the main README.md for detailed documentation.
