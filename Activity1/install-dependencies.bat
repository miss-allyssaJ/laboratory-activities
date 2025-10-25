@echo off
echo Installing backend dependencies...
cd backend
call npm install

echo Installing frontend dependencies...
cd ..\frontend
call npm install

echo All dependencies installed successfully!
echo.
echo To start the backend:
echo cd backend ^&^& npm run start:dev
echo.
echo To start the frontend:
echo cd frontend ^&^& npm start
pause
