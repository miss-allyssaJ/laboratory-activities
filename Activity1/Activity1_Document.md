# Activity 1: To-Do List API + UI

## Title
**Activity 1: To-Do List API + UI**

## Description
A comprehensive task management application built with ReactJS frontend and NestJS backend. The application allows users to create, view, update, and delete tasks with advanced features including priority levels, date/time scheduling, progress tracking, and a beautiful modern UI with dark/light mode support.

### Key Features:
- **Task Management**: Full CRUD operations for tasks
- **Priority System**: Low, Medium, High priority levels
- **Date & Time**: Schedule tasks with specific dates and times
- **Progress Tracking**: Visual progress bars and statistics
- **Modern UI**: Glass-morphism design with responsive layout
- **Theme Support**: Dark and light mode toggle
- **Sidebar Navigation**: Organized task filtering and navigation
- **Today's Focus**: Dedicated view for daily tasks
- **Task Statistics**: Completion rates and task counts

## Screenshots

### Frontend UI Screenshots:
1. **Main Dashboard**: Shows task list with modern card design
2. **Add Task Modal**: Two-column layout with task details
3. **Today's Focus Modal**: Daily planner with active and completed tasks
4. **Sidebar Navigation**: Filter tasks by priority and status
5. **Dark Mode**: Beautiful dark theme implementation
6. **Progress Tracking**: Visual progress bars and statistics

### API Examples:

#### Create Task
```bash
POST http://localhost:3001/tasks
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the project",
  "time": "2:30 PM",
  "date": "2024-01-15",
  "priority": "high",
  "completed": false
}
```

#### Get All Tasks
```bash
GET http://localhost:3001/tasks
```

#### Update Task
```bash
PATCH http://localhost:3001/tasks/1
Content-Type: application/json

{
  "completed": true,
  "priority": "medium"
}
```

#### Delete Task
```bash
DELETE http://localhost:3001/tasks/1
```

#### Get Task Statistics
```bash
GET http://localhost:3001/tasks/stats
```

## Instructions to Run the Project

### Prerequisites
- Node.js (v16 or higher)
- XAMPP (for MySQL database)
- Git (for version control)

### Database Setup
1. **Start XAMPP:**
   - Open XAMPP Control Panel
   - Start **Apache** and **MySQL** services
   - Open phpMyAdmin: http://localhost/phpmyadmin

2. **Create Database:**
   ```sql
   CREATE DATABASE todo_app;
   ```

3. **Import Database Schema:**
   - Copy contents of `backend/database-setup.sql`
   - Paste and execute in phpMyAdmin SQL tab

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
npm run start:dev
```
**Backend runs on:** http://localhost:3001

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend server
npm start
```
**Frontend runs on:** http://localhost:3000

### API Testing
1. Import `backend/postman-collection.json` into Postman
2. Set base URL to `http://localhost:3001`
3. Test all CRUD endpoints

### Project Structure
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

### API Endpoints
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

### Technologies Used
- **Frontend**: ReactJS, CSS3, Chart.js
- **Backend**: Node.js, NestJS, TypeScript
- **Database**: MySQL (XAMPP)
- **ORM**: TypeORM
- **API Testing**: Postman Collection
- **Validation**: class-validator, class-transformer

### Features Implemented
- ✅ Complete CRUD operations
- ✅ Priority management system
- ✅ Date and time scheduling
- ✅ Progress tracking and statistics
- ✅ Modern responsive UI
- ✅ Dark/light theme support
- ✅ Sidebar navigation
- ✅ Task filtering and search
- ✅ Error handling and loading states
- ✅ API documentation with Postman

This project demonstrates proficiency in full-stack development with modern technologies and best practices.
