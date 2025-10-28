# Blog Platform Frontend

React-based frontend for the Blog Platform application.

## Features

- User authentication (Login/Register)
- View all blog posts with pagination
- Create new blog posts (authenticated users)
- View post details with comments
- Add comments to posts (authenticated users)
- Delete own posts and comments
- Responsive design

## Tech Stack

- React 18
- React Router DOM for routing
- Axios for API calls
- Context API for state management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3001` (or another port if 3000 is occupied).

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.js
│   ├── PostCard.js
│   ├── CommentList.js
│   └── PrivateRoute.js
├── pages/              # Page components
│   ├── Home.js
│   ├── Login.js
│   ├── Register.js
│   ├── CreatePost.js
│   └── PostDetail.js
├── context/            # React Context
│   └── AuthContext.js
├── services/           # API services
│   └── api.js
├── App.js
└── index.js
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## API Configuration

The frontend connects to the backend API at `http://localhost:3000`. To change this, update the `API_URL` in `src/services/api.js`.

## Authentication

The application uses JWT tokens stored in localStorage for authentication. Tokens are automatically attached to API requests via Axios interceptors.
