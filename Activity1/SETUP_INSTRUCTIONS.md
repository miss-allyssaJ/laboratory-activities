# Todo List Application - Setup Instructions

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **XAMPP** (for MySQL database)
- **Git** (for version control)

## 🚀 Quick Setup

### 1. Database Setup (XAMPP)

1. **Start XAMPP:**
   - Open XAMPP Control Panel
   - Start **Apache** and **MySQL** services
   - Open phpMyAdmin: http://localhost/phpmyadmin

2. **Create Database:**
   ```sql
   CREATE DATABASE todo_app;
   ```

3. **Import Database Schema:**
   - Copy the contents of `backend/database-setup.sql`
   - Paste and execute in phpMyAdmin SQL tab
   - Or import the file directly

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (this will install @nestjs/mapped-types and other packages)
npm install

# Start the backend server
npm run start:dev
```

**Backend will run on:** http://localhost:3001
**Postman Collection:** Import `backend/postman-collection.json` for API testing

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend server
npm start
```

**Frontend will run on:** http://localhost:3000

## 🔧 Configuration

### Database Configuration
If you need to change database settings, edit `backend/src/app.module.ts`:

```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '', // Your MySQL password
  database: 'todo_app',
  // ... other options
})
```

### API Configuration
The frontend is configured to connect to `http://localhost:3001`. If you change the backend port, update `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:3001'; // Change this if needed
```

## 📚 API Endpoints

### Tasks
- `GET /tasks` - Get all tasks
- `GET /tasks/stats` - Get task statistics
- `GET /tasks/active` - Get active tasks
- `GET /tasks/completed` - Get completed tasks
- `GET /tasks/by-date?date=YYYY-MM-DD` - Get tasks by date
- `GET /tasks/by-priority/:priority` - Get tasks by priority
- `GET /tasks/:id` - Get task by ID
- `POST /tasks` - Create new task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Example API Usage

**Create a task:**
```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn NestJS",
    "description": "Complete the NestJS tutorial",
    "time": "2:00 PM",
    "date": "2024-01-20",
    "priority": "high"
  }'
```

**Get all tasks:**
```bash
curl http://localhost:3001/tasks
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test
```

### API Testing with Postman
1. Import `backend/postman-collection.json` into Postman
2. Set base URL to `http://localhost:3001`
3. Test all endpoints

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Error:**
- Ensure XAMPP MySQL is running
- Check database credentials in `backend/src/app.module.ts`
- Verify database `todo_app` exists

**2. CORS Error:**
- Backend is configured for `http://localhost:3000`
- If using different frontend port, update CORS settings in `backend/src/main.ts`

**3. Port Already in Use:**
- Backend: Change port in `backend/src/main.ts`
- Frontend: Change port in `frontend/package.json`

**4. Module Not Found (@nestjs/mapped-types):**
- Run `npm install` in backend directory
- If still having issues, the UpdateTaskDto has been updated to not require this package

**5. TypeScript Errors:**
- Ensure all dependencies are installed: `npm install`
- Check that TypeScript is properly configured
- Restart your development server

## 📁 Project Structure

```
Activity1/
├── backend/
│   ├── src/
│   │   ├── tasks/
│   │   │   ├── dto/
│   │   │   ├── task.entity.ts
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.service.ts
│   │   │   └── tasks.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── database-setup.sql
│   ├── postman-collection.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
└── SETUP_INSTRUCTIONS.md
```

## 🎯 Features

### Frontend Features
- ✅ Modern, responsive UI with glass-morphism design
- ✅ Dark/Light mode toggle
- ✅ Task management (CRUD operations)
- ✅ Priority levels (Low, Medium, High)
- ✅ Date and time scheduling
- ✅ Progress tracking
- ✅ Sidebar navigation
- ✅ Today's focus modal
- ✅ Task statistics

### Backend Features
- ✅ NestJS with TypeScript
- ✅ MySQL database integration
- ✅ RESTful API design
- ✅ Swagger documentation
- ✅ Input validation
- ✅ Error handling
- ✅ CORS support

## 📝 Next Steps

1. **Deploy to Production:**
   - Set up production database
   - Configure environment variables
   - Deploy backend to cloud service
   - Deploy frontend to hosting service

2. **Add Features:**
   - User authentication
   - Task categories
   - File attachments
   - Email notifications
   - Mobile app

3. **Improve Performance:**
   - Database indexing
   - Caching
   - Pagination
   - Search functionality

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all services are running
3. Check database connection
4. Review the Postman collection for API examples
