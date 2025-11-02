# Bookshelf Application

A full-stack web application for managing your personal library. Create, organize, and explore books with their authors and categories in a beautiful, user-friendly interface.

## What It Does

The Bookshelf App is a book management system that allows users to:
- Browse and search through their book collection
- Add new books with cover images
- Organize books by authors and categories
- View detailed information about books, authors, and categories
- Manage the library with admin privileges

## Features

### For All Users
- User Authentication - Sign up and login system with JWT tokens
- Book Library - View all books in a responsive grid layout
- Search Functionality - Search books, authors, and categories
- Author Pages - View author details and their books
- Category Filtering - Filter books by category
- Book Details - Detailed view of individual books with cover images
- Modern UI - Beautiful interface with animations using Framer Motion

### For Admins
- Admin Dashboard - Dedicated admin interface
- Create Books - Add new books with title, author, category, year, and cover image
- Update Books - Edit existing book information
- Delete Books - Remove books from the library
- Manage Authors - Create, update, and delete authors
- Manage Categories - Create, update, and delete categories

### Technical Features
- Full CRUD Operations - Create, Read, Update, Delete for all entities
- Image Upload - Book cover image upload and storage
- Swagger API Documentation - Interactive API documentation at /api
- MySQL Database - Persistent data storage with TypeORM
- RESTful API - Clean REST API built with NestJS
- React Frontend - Modern React application with React Router

## How to Run the Project

### Prerequisites
- Node.js (v14 or higher)
- MySQL database server
- npm or yarn

### Step 1: Set Up the Database
1. Create a MySQL database named `bookshelf_db` (or update the name in `backend/src/ormconfig.ts`)
2. Note your database credentials (host, port, username, password)

### Step 2: Configure Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create a `.env` file in the `backend` folder with your database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=bookshelf_db
   PORT=3001
   ```
   If you don't create a `.env` file, the app will use default values.

4. Build the project:
   ```bash
   npm run build
   ```

5. Start the backend server:
   ```bash
   npm run start:dev
   ```
   
   The backend will run on http://localhost:3001
   - API: http://localhost:3001
   - Swagger Docs: http://localhost:3001/api

### Step 3: Configure Frontend
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```
   
   The frontend will run on http://localhost:3000 and automatically open in your browser.

### Step 4: Access the Application
1. Open your browser and go to http://localhost:3000
2. You'll see a splash screen that redirects to the login page
3. Sign up for a new account or login if you have one
4. Once logged in, you can start managing your bookshelf!

## Quick Start Commands

**Terminal 1 (Backend):**
```bash
cd backend
npm install
npm run start:dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm start
```

## Project Structure

```
Activity3-Bookshelf/
├── backend/          # NestJS API server
│   ├── src/
│   │   ├── books/    # Book CRUD operations
│   │   ├── authors/  # Author CRUD operations
│   │   ├── categories/ # Category CRUD operations
│   │   ├── auth/     # Authentication endpoints
│   │   └── users/    # User management
│   └── uploads/      # Uploaded book cover images
│
└── frontend/         # React frontend application
    ├── src/
    │   ├── pages/    # Page components
    │   ├── components/ # Reusable components
    │   └── api/      # API configuration
```

## Default Users

After first run, you'll need to sign up for an account. Admins must be created directly in the database (role: "admin").

## API Endpoints

- `GET /books` - Get all books
- `POST /books` - Create a book
- `GET /books/:id` - Get a book by ID
- `PUT /books/:id` - Update a book
- `DELETE /books/:id` - Delete a book

Similar endpoints exist for `/authors` and `/categories`.

Full API documentation available at http://localhost:3001/api

## Technologies Used

**Backend:**
- NestJS (Node.js framework)
- TypeORM (ORM for MySQL)
- JWT (Authentication)
- Swagger (API documentation)
- Multer (File uploads)

**Frontend:**
- React 19
- React Router
- Axios
- Framer Motion (Animations)
- Lucide React (Icons)
