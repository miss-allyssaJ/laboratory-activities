# Todo List API Backend

A comprehensive REST API for managing tasks and to-do items built with NestJS, TypeScript, and MySQL.

## 🚀 Features

- **CRUD Operations**: Create, Read, Update, Delete tasks
- **Priority Management**: Low, Medium, High priority levels
- **Date & Time Support**: Schedule tasks with specific dates and times
- **Task Statistics**: Get completion rates and task counts
- **Filtering**: Filter tasks by date, priority, completion status
- **Postman Collection**: Complete API testing collection
- **TypeScript**: Full type safety and IntelliSense support

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (XAMPP recommended)
- npm or yarn

## 🛠️ Installation

1. **Install dependencies:**
```bash
   npm install
   ```

2. **Set up MySQL database:**
   - Start XAMPP and ensure MySQL is running
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Run the SQL script from `database-setup.sql`

3. **Configure database connection:**
   - Update `src/app.module.ts` if needed:
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

## 🚀 Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at:
- **API**: http://localhost:3001
- **Documentation**: http://localhost:3001/api

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

### Example Requests

**Create a new task:**
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

**Update a task:**
```bash
curl -X PATCH http://localhost:3001/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

## 🔧 Development

```bash
# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format
```

## 📖 API Testing

Import the `postman-collection.json` file into Postman to test all API endpoints.

## 🗄️ Database Schema

```sql
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  time VARCHAR(50),
  date DATE,
  priority ENUM('low', 'medium', 'high') DEFAULT 'low',
  completed BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔗 Frontend Integration

This API is designed to work with the React frontend. Make sure to:

1. Update the frontend API base URL to `http://localhost:3001`
2. Replace localStorage operations with API calls
3. Handle loading states and error responses

## 📝 License

MIT License