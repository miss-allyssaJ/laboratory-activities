import React, { useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showInput, setShowInput] = useState(false); // NEW

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask("");
    setShowInput(false); // Optional: auto-close input after adding
  };

  const completeTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: true } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = (id, newText) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const progress =
    tasks.length > 0
      ? Math.round((completedTasks.length / tasks.length) * 100)
      : 0;

  return (
    <div className="layout">
      <aside className={sidebarOpen ? "sidebar open" : "sidebar"}>
        <h2> Menu</h2>
        <ul>
          <li>All Tasks</li>
          <li>Active</li>
          <li>Completed</li>
          <li>Settings</li>
        </ul>
      </aside>

      <div className="app">
        <button className="toggle-btn" onClick={toggleSidebar}>
          ☰
        </button>

        <header className="header">
          <h1>My Daily Planner</h1>
          <p>Organize your day, track progress, and stay stress-free 🌸</p>
        </header>

        {showInput && (
          <div className="input-box floating-input">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
            />
            <button onClick={addTask}>Add</button>
          </div>
        )}

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="progress-text">{progress}% Completed</p>

        <section className="tasks">
          <h2>To Do</h2>
          {activeTasks.length === 0 ? (
            <p className="empty">No tasks yet ✨</p>
          ) : (
            <ul>
              {activeTasks.map((task) => (
                <li key={task.id}>
                  <span>{task.text}</span>
                  <div className="buttons">
                    <button
                      onClick={() => completeTask(task.id)}
                      className="done"
                    >
                      Done
                    </button>
                    <button
                      onClick={() => {
                        const newText = prompt("Edit task:", task.text);
                        if (newText) editTask(task.id, newText);
                      }}
                      className="edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="delete"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="tasks">
          <h2>Completed</h2>
          {completedTasks.length === 0 ? (
            <p className="empty">No completed tasks yet 🌼</p>
          ) : (
            <ul>
              {completedTasks.map((task) => (
                <li key={task.id} className="completed">
                  {task.text}
                </li>
              ))}
            </ul>
          )}
        </section>

        <button
          className="add-task-btn"
          onClick={() => setShowInput(!showInput)}
        >
          {showInput ? "✖" : "+"}
        </button>
      </div>
    </div>
  );
}

export default App;