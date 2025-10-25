@echo off
echo Fixing backend dependency issues...
echo.

echo Step 1: Clearing npm cache...
call npm cache clean --force

echo.
echo Step 2: Removing node_modules and package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo.
echo Step 3: Installing dependencies with legacy peer deps...
call npm install --legacy-peer-deps

echo.
echo Step 4: Verifying installation...
call npm list class-validator
call npm list @nestjs/mapped-types

echo.
echo Installation complete! Try running: npm run start:dev
pause
