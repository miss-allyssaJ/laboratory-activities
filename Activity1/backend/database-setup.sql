-- Create database for Todo App
CREATE DATABASE IF NOT EXISTS todo_app;
USE todo_app;

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
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

-- Insert sample data
INSERT INTO tasks (title, description, time, date, priority, completed) VALUES
('Complete project documentation', 'Write comprehensive documentation for the project including API docs and user guide', '2:30 PM', '2024-01-15', 'high', false),
('Review code changes', 'Review all pending pull requests and provide feedback', '10:00 AM', '2024-01-15', 'medium', false),
('Update dependencies', 'Update all project dependencies to latest versions', '3:00 PM', '2024-01-16', 'low', true),
('Design user interface', 'Create mockups for the new dashboard design', '11:00 AM', '2024-01-16', 'high', false),
('Write unit tests', 'Add unit tests for the new features', '4:00 PM', '2024-01-17', 'medium', false);

-- Show the created data
SELECT * FROM tasks;
