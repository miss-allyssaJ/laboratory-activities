# Blog Platform - Full Stack Application

A complete blog platform with user authentication, posts, and comments functionality.

## Tech Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: SQLite with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger
- **Validation**: class-validator

### Frontend
- **Framework**: React (Create React App)
- **Routing**: React Router
- **HTTP Client**: Axios
- **Styling**: CSS

## Features

### Backend Features
- ✅ User registration and login with JWT authentication
- ✅ CRUD operations for blog posts
- ✅ CRUD operations for comments
- ✅ Pagination for posts listing
- ✅ Protected routes (authentication required)
- ✅ Password hashing with bcrypt
- ✅ Swagger API documentation
- ✅ CORS enabled for frontend communication

### Frontend Features
- ✅ User registration and login pages
- ✅ Home page with paginated blog posts
- ✅ Create new blog post (authenticated users)
- ✅ View post details with comments
- ✅ Add comments to posts (authenticated users)
- ✅ Edit and delete own posts
- ✅ Delete own comments
- ✅ Responsive UI design

## Project Structure

```
ACTIVITY 5/
├── backend/               # Backend (NestJS)
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # Users module
│   │   ├── posts/         # Posts module
│   │   ├── comments/      # Comments module
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── blog-platform.db   # SQLite database
│   └── package.json
│
└── frontend/              # Frontend (React)
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── pages/         # Page components
    │   ├── services/      # API service
    │   ├── context/       # Auth context
    │   └── App.js
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run start:dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3001`

## API Documentation

Once the backend is running, access the Swagger documentation at:
```
http://localhost:3000/api/docs
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Posts
- `GET /posts` - Get all posts (with pagination)
- `GET /posts/:id` - Get single post with comments
- `POST /posts` - Create new post (authenticated)
- `PATCH /posts/:id` - Update post (authenticated, own posts only)
- `DELETE /posts/:id` - Delete post (authenticated, own posts only)

### Comments
- `GET /posts/:postId/comments` - Get all comments for a post
- `POST /posts/:postId/comments` - Create comment (authenticated)
- `DELETE /posts/:postId/comments/:id` - Delete comment (authenticated, own comments only)

## Database Schema

### Users Table
- id (Primary Key)
- email (Unique)
- username (Unique)
- password (Hashed)
- createdAt

### Posts Table
- id (Primary Key)
- title
- content
- authorId (Foreign Key -> Users)
- createdAt
- updatedAt

### Comments Table
- id (Primary Key)
- content
- postId (Foreign Key -> Posts)
- authorId (Foreign Key -> Users)
- createdAt

## Configuration

The backend uses default configuration values:
- **Port**: 3000 (can be overridden with `PORT` environment variable)
- **JWT Secret**: Default value provided (should be changed in production via `JWT_SECRET` environment variable)

For production deployment, set environment variables for:
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret key for JWT tokens (default: 'your-secret-key-change-in-production')

## Usage

1. **Register a new account**: Navigate to the registration page and create an account
2. **Login**: Use your credentials to login
3. **Create a post**: Click "Create Post" and write your blog post
4. **View posts**: Browse all posts on the home page
5. **Add comments**: Click on a post to view details and add comments
6. **Manage content**: Edit or delete your own posts and comments

## Security Features

- Password hashing using bcrypt
- JWT token-based authentication
- Protected routes requiring authentication
- Authorization checks (users can only modify their own content)
- Input validation using class-validator
- CORS configuration

## Development

### Backend Development
```bash
cd backend
npm run start:dev  # Watch mode
npm run build      # Production build
npm run test       # Run tests
```

### Frontend Development
```bash
cd frontend
npm start          # Development server
npm run build      # Production build
npm test           # Run tests
```

## Production Deployment

### Backend
1. Set `synchronize: false` in TypeORM configuration
2. Use environment variables for sensitive data
3. Set up proper database migrations
4. Configure production database

### Frontend
1. Update API URL to production backend
2. Build the production bundle: `npm run build`
3. Deploy the `build` folder to a static hosting service

## License

This project is created for educational purposes.

## Author

Created as part of Activity 5: Blog Platform API + UI
