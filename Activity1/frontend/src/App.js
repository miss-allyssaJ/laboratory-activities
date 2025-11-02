import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import apiService from "./services/api";

ChartJS.register(ArcElement, Tooltip, Legend);

function formatTimeTo12Hour(value) {
  if (!value && value !== "") return "";
  const s = String(value).trim();
  if (!s) return "";
  if (/^(am|pm)$/i.test(s)) {
    return "";
  }
  const ampmMatch = s.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (ampmMatch) {
    const h = String(Number(ampmMatch[1]));
    const m = ampmMatch[2].padStart(2, "0");
    const period = ampmMatch[3].toUpperCase();
    return `${h}:${m} ${period}`;
  }
  const hhmmMatch = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (hhmmMatch) {
    const hh = Number(hhmmMatch[1]);
    const mm = hhmmMatch[2].padStart(2, "0");
    const period = hh >= 12 ? "PM" : "AM";
    const hour12 = ((hh + 11) % 12) + 1;
    return `${hour12}:${mm} ${period}`;
  }
  const date = new Date(s);
  if (!isNaN(date.getTime())) {
    const hh = date.getHours();
    const mm = String(date.getMinutes()).padStart(2, "0");
    const period = hh >= 12 ? "PM" : "AM";
    const hour12 = ((hh + 11) % 12) + 1;
    return `${hour12}:${mm} ${period}`;
  }
  return s;
}

function parse12HourStringToHM(str) {
  if (!str) return null;
  const m = String(str).trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const period = m[3].toUpperCase();
  if (period === "PM" && h < 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return { hours: h, minutes: min };
}

function sanitizeTaskForServer(task) {
  return {
    title: task.title,
    time: task.time,
    priority: task.priority,
    completed: !!task.completed,
  };
}

function App() {
  const [tasks, setTasks] = useState([]);
  const tasksRef = useRef([]);

  const [newTask, setNewTask] = useState(() => {
    const draft = localStorage.getItem("draftTask");
    return draft ? JSON.parse(draft).newTask : "";
  });
  const [taskDescription, setTaskDescription] = useState(() => {
    const draft = localStorage.getItem("draftTask");
    return draft ? JSON.parse(draft).taskDescription : "";
  });
  const [taskTime, setTaskTime] = useState(() => {
    const draft = localStorage.getItem("draftTask");
    return draft ? JSON.parse(draft).taskTime : "";
  });
  const [taskDate, setTaskDate] = useState(() => {
    const draft = localStorage.getItem("draftTask");
    return draft ? JSON.parse(draft).taskDate : "";
  });
  const [taskPriority, setTaskPriority] = useState("low");
  const [priorityOpen, setPriorityOpen] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showInput, setShowInput] = useState(() => !!localStorage.getItem("draftTask"));
  const [modalType, setModalType] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [showTimeModal, setShowTimeModal] = useState(false);

  const [reminder, setReminder] = useState(() => {
    const saved = localStorage.getItem("reminder");
    return saved ? JSON.parse(saved) : null;
  });

  const alarmSound = useRef(new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"));
  const isAlarmPlayingRef = useRef(false);

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const progress = tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const progressData = {
    labels: ["Completed", "Active"],
    datasets: [
      {
        label: "Tasks",
        data: [completedTasks.length, activeTasks.length],
        backgroundColor: ["#4caf50", "#f44336"],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      const data = await apiService.getTasks();
      const normalized = data.map((t) => ({
        ...t,
        time: t.time ? formatTimeTo12Hour(t.time) : "No time",
        date: t.date || new Date().toISOString().split('T')[0],
        notified: !!t.notified,
      }));
      setTasks(normalized);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    const formattedTime = taskTime ? formatTimeTo12Hour(taskTime) : "No time";
    const formattedDate = taskDate || new Date().toISOString().split('T')[0]; // Default to today if no date
    const payload = {
      title: newTask.trim(),
      description: taskDescription.trim(),
      time: formattedTime,
      date: formattedDate,
      priority: taskPriority,
      completed: false,
    };
    try {
      const serverTask = await apiService.createTask(payload);
      const normalizedTask = { ...serverTask, time: serverTask.time ? formatTimeTo12Hour(serverTask.time) : formattedTime, date: serverTask.date || formattedDate, notified: false };
      setTasks((prev) => [...prev, normalizedTask]);
      setNewTask("");
      setTaskDescription("");
      setTaskTime("");
      setTaskDate("");
      setTaskPriority("low");
      setShowInput(false);
    } catch (err) {
      console.error("Error adding task:", err);
      const local = { id: Math.random().toString(36).slice(2), ...payload, notified: false };
      setTasks((prev) => [...prev, local]);
      setNewTask("");
      setTaskDescription("");
      setTaskTime("");
      setTaskPriority("low");
      setShowInput(false);
    }
  };

  const completeTask = async (id) => {
    try {
      const existing = tasks.find((t) => t.id === id);
      if (!existing) return;
      const payload = sanitizeTaskForServer({ ...existing, completed: true });
      const updatedTask = await apiService.updateTask(id, payload);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...updatedTask, notified: !!t.notified } : t)));
    } catch (err) {
      console.error("Error completing task:", err);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: true } : t)));
    }
  };

  const deleteTask = async (id) => {
    try {
      await apiService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const editTask = async (id, newText) => {
    try {
      const existing = tasks.find((t) => t.id === id);
      if (!existing) return;
      const payload = sanitizeTaskForServer({ ...existing, title: newText });
      const updatedTask = await apiService.updateTask(id, payload);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...updatedTask, notified: !!updatedTask.notified } : t)));
    } catch (err) {
      console.error("Error editing task:", err);
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title: newText } : t)));
    }
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().catch(() => {});
    }

    const unlock = () => {
      alarmSound.current
        .play()
        .then(() => {
          alarmSound.current.pause();
          alarmSound.current.currentTime = 0;
          window.removeEventListener("mousedown", unlock);
          window.removeEventListener("touchstart", unlock);
        })
        .catch(() => {
        });
    };
    window.addEventListener("mousedown", unlock);
    window.addEventListener("touchstart", unlock);
    return () => {
      window.removeEventListener("mousedown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    localStorage.setItem("draftTask", JSON.stringify({ newTask, taskDescription, taskTime, taskDate }));
  }, [newTask, taskDescription, taskTime, taskDate]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!showInput) return;
      if (e.key === "Enter") addTask();
      if (e.key === "Escape") setShowInput(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [showInput, newTask, taskTime, taskPriority]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const curH = now.getHours();
      const curM = now.getMinutes();
      const toTrigger = tasksRef.current.find((task) => {
        if (!task || !task.time || task.time === "No time" || task.completed) return false;
        const parsed = parse12HourStringToHM(task.time);
        if (!parsed) return false;
        const alreadyNotified = !!task.notified;
        return parsed.hours === curH && parsed.minutes === curM && !alreadyNotified;
      });

      if (toTrigger) {
        if ("Notification" in window && Notification.permission === "granted") {
          try {
            new Notification("Task Reminder ⏰", {
              body: `${toTrigger.title} - ${toTrigger.time}`,
            });
          } catch (err) {
          }
        }

        if (!isAlarmPlayingRef.current) {
          alarmSound.current.loop = true;
          alarmSound.current
            .play()
            .catch(() => {});
          isAlarmPlayingRef.current = true;
        }

        setReminder({ title: toTrigger.title, time: toTrigger.time });

        setTasks((prev) => prev.map((t) => (t.id === toTrigger.id ? { ...t, notified: true } : t)));
      }

      setTasks((prev) =>
        prev.map((t) => {
          const parsed = parse12HourStringToHM(t.time);
          if (!parsed) return t;
          const shouldReset = t.notified && !(parsed.hours === curH && parsed.minutes === curM);
          return shouldReset ? { ...t, notified: false } : t;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const stopAlarm = () => {
    try {
      alarmSound.current.pause();
      alarmSound.current.currentTime = 0;
      alarmSound.current.loop = false;
    } catch (err) {
    }
    isAlarmPlayingRef.current = false;
    setReminder(null);
  };

  const toggleSidebar = () => setSidebarOpen((s) => !s);

  const triggerTestAlarm = () => {
    const dummyTime = formatTimeTo12Hour(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true }));
    setReminder({ title: "Test Alarm", time: dummyTime });
    if (!isAlarmPlayingRef.current) {
      alarmSound.current.loop = true;
      alarmSound.current
        .play()
        .catch(() => {});
      isAlarmPlayingRef.current = true;
    }
  };

  return (
    <div className="layout">
      {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
<aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
  <h2>🌸 My Planner</h2>
  <ul>
    {/* Core Filters */}
    <li className="pill" onClick={() => setModalType("today")}>
      <span>📅 Today's Focus</span>
    </li>
    <li className="pill" onClick={() => setModalType("upcoming")}>
      <span>⏰ Upcoming</span>
    </li>
    <li className="pill" onClick={() => setModalType("completed")}>
      <span>✅ Completed ({completedTasks.length})</span>
    </li>

    {/* Priority Dropdown */}
    <li
      className="pill priority-toggle"
      onClick={() => setPriorityOpen((prev) => !prev)}
    >
      <span>🎯 Priority</span>
      <span className={`arrow ${priorityOpen ? "open" : ""}`}>▼</span>
    </li>
    {priorityOpen && (
      <ul className="priority-submenu">
        <li onClick={() => setModalType("high")}>
          🔴 High ({tasks.filter((t) => t.priority === "high" && !t.completed).length})
        </li>
        <li onClick={() => setModalType("medium")}>
          🟡 Medium ({tasks.filter((t) => t.priority === "medium" && !t.completed).length})
        </li>
        <li onClick={() => setModalType("low")}>
          🟢 Low ({tasks.filter((t) => t.priority === "low" && !t.completed).length})
        </li>
      </ul>
    )}

    {/* Motivation (Mascot + Quotes) */}
    <li className="pill" onClick={() => setModalType("motivation")}>
      <span>💪 Daily Motivation</span>
    </li>

    {/* Stats (Pie Chart or Productivity Graph) */}
    <li className="pill" onClick={() => setModalType("stats")}>
      <span>📊 Statistics</span>
    </li>

    {/* Settings */}
    <li className="pill" onClick={() => setModalType("settings")}>
      <span>⚙️ Settings</span>
    </li>
  </ul>
</aside>


      {modalType && (
        <>
          <div className="modal-overlay" onClick={() => setModalType(null)}></div>
          <div className="modal">
            <h3>
              {modalType === "all" && "All Tasks"}
              {modalType === "active" && "Active Tasks"}
              {modalType === "completed" && "Completed Tasks"}
              {modalType === "high" && "High Priority Tasks"}
              {modalType === "medium" && "Medium Priority Tasks"}
              {modalType === "low" && "Low Priority Tasks"}
              {modalType === "today" && "Today's Tasks 📅"}
              {modalType === "upcoming" && "Upcoming Tasks ⏰"}
              {modalType === "motivation" && "Daily Motivation 💪"}
              {modalType === "stats" && "Task Statistics 📊"}
              {modalType === "progress" && "Progress Overview"}
              {modalType === "settings" && "Settings ⚙"}
            </h3>

            {modalType === "settings" ? (
              <div className="settings-content">
                <p>Choose Theme:</p>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={theme === "dark"}
                    onChange={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
                  />
                  <span className="slider"></span>
                  <span className="theme-label">{theme === "light" ? "☀️ Light Mode" : "🌙 Dark Mode"}</span>
                </label>

                <hr />
                <button onClick={() => {
                  localStorage.clear();
                  setTasks([]);
                  setNewTask("");
                  setTaskTime("");
                  setModalType(null);
                  alert("All data has been cleared.");
                }}>
                  Clear All Data
                </button>
              </div>
                ) : modalType === "today" ? (
                  <div className="daily-planner-content">
                    <div className="planner-header">
                    <h4>Today's Focus 📅</h4>
                      <div className="planner-stats">
                        <span className="stat-item">
                          <span className="stat-number">{tasks.filter(task => {
                            const today = new Date().toISOString().split('T')[0];
                            return task.date === today && !task.completed;
                          }).length}</span>
                          <span className="stat-label">Active</span>
                        </span>
                        <span className="stat-item">
                          <span className="stat-number">{tasks.filter(task => {
                      const today = new Date().toISOString().split('T')[0];
                            return task.date === today && task.completed;
                          }).length}</span>
                          <span className="stat-label">Completed</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="planner-sections">
                      {/* Active Tasks Section */}
                      <div className="planner-section">
                        <h5 className="section-title">
                          <span className="section-icon">📋</span>
                          Active Tasks
                        </h5>
                        <div className="task-list">
                      {tasks.filter(task => {
                        const today = new Date().toISOString().split('T')[0];
                            return task.date === today && !task.completed;
                      }).sort((a, b) => {
                        if (!a.time || !b.time) return 0;
                        const timeA = parse12HourStringToHM(a.time);
                        const timeB = parse12HourStringToHM(b.time);
                        if (!timeA || !timeB) return 0;
                        return (timeA.hours * 60 + timeA.minutes) - (timeB.hours * 60 + timeB.minutes);
                      }).map(task => (
                            <div key={task.id} className={`task-card ${task.priority}`}>
                              <div className="task-header">
                                <div className="task-title">{task.title}</div>
                                <div className="task-actions">
                                  <button onClick={() => completeTask(task.id)} className="complete-btn">✓</button>
                                </div>
                              </div>
                              {task.description && (
                                <div className="task-description">{task.description}</div>
                              )}
                              <div className="task-meta">
                                {task.time && <span className="task-time">⏰ {task.time}</span>}
                                <span className="task-date">📅 {new Date(task.date).toLocaleDateString()}</span>
                                <span className={`priority-badge ${task.priority}`}>
                                  {task.priority === 'high' ? '🔴 High' : task.priority === 'medium' ? '🟡 Medium' : '🟢 Low'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Completed Tasks Section */}
                      <div className="planner-section">
                        <h5 className="section-title">
                          <span className="section-icon">✅</span>
                          Completed Tasks
                        </h5>
                        <div className="task-list">
                          {tasks.filter(task => {
                            const today = new Date().toISOString().split('T')[0];
                            return task.date === today && task.completed;
                          }).map(task => (
                            <div key={task.id} className={`task-card completed ${task.priority}`}>
                              <div className="task-header">
                                <div className="task-title completed-title">{task.title}</div>
                                <div className="completed-badge">✓</div>
                              </div>
                              {task.description && (
                                <div className="task-description completed-description">{task.description}</div>
                              )}
                              <div className="task-meta">
                                {task.time && <span className="task-time">⏰ {task.time}</span>}
                                <span className="task-date">📅 {new Date(task.date).toLocaleDateString()}</span>
                                <span className={`priority-badge ${task.priority}`}>
                                  {task.priority === 'high' ? '🔴 High' : task.priority === 'medium' ? '🟡 Medium' : '🟢 Low'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : modalType === "upcoming" ? (
                  <div>
                    <h4>Upcoming Tasks ⏰</h4>
                    <p>Tasks scheduled for the next 7 days: {tasks.filter(task => {
                      if (task.completed) return false;
                      const today = new Date().toISOString().split('T')[0];
                      const weekFromNow = new Date();
                      weekFromNow.setDate(weekFromNow.getDate() + 7);
                      const weekFromNowStr = weekFromNow.toISOString().split('T')[0];
                      return task.date > today && task.date <= weekFromNowStr;
                    }).length}</p>
                    <ul>
                      {tasks.filter(task => {
                        if (task.completed) return false;
                        const today = new Date().toISOString().split('T')[0];
                        const weekFromNow = new Date();
                        weekFromNow.setDate(weekFromNow.getDate() + 7);
                        const weekFromNowStr = weekFromNow.toISOString().split('T')[0];
                        return task.date > today && task.date <= weekFromNowStr;
                      }).sort((a, b) => {
                        // Sort by date first, then by time
                        if (a.date !== b.date) {
                          return new Date(a.date) - new Date(b.date);
                        }
                        if (!a.time || !b.time) return 0;
                        const timeA = parse12HourStringToHM(a.time);
                        const timeB = parse12HourStringToHM(b.time);
                        if (!timeA || !timeB) return 0;
                        return (timeA.hours * 60 + timeA.minutes) - (timeB.hours * 60 + timeB.minutes);
                      }).map(task => (
                        <li key={task.id} className={`${task.priority}`}>
                          <span>{task.title}</span>
                          <span className="time">{task.time} - {new Date(task.date).toLocaleDateString()}</span>
                          {!task.completed && (
                            <button onClick={() => completeTask(task.id)} className="done">✓</button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : modalType === "motivation" ? (
                  <div className="motivation-content">
                    <div className="mascot">🌸</div>
                    <h4>Daily Motivation</h4>
                    <div className="motivational-quotes">
                      <p className="quote">"The way to get started is to quit talking and begin doing." - Walt Disney</p>
                      <p className="quote">"Don't be pushed around by the fears in your mind. Be led by the dreams in your heart." - Roy T. Bennett</p>
                      <p className="quote">"Success is not final, failure is not fatal: it is the courage to continue that counts." - Winston Churchill</p>
                    </div>
                    <div className="progress-motivation">
                      <h5>Your Progress Today:</h5>
                      <p>✅ Completed: {completedTasks.length} tasks</p>
                      <p>📋 Remaining: {activeTasks.length} tasks</p>
                      <p>🎯 Completion Rate: {progress}%</p>
                    </div>
                    <div className="encouragement">
                      {progress >= 80 && <p className="encouraging">🌟 Amazing! You're crushing your goals!</p>}
                      {progress >= 50 && progress < 80 && <p className="encouraging">💪 Great progress! Keep it up!</p>}
                      {progress < 50 && <p className="encouraging">🌱 Every step counts! You've got this!</p>}
                    </div>
                  </div>
                ) : modalType === "stats" ? (
                  <div>
                    <h4>Task Statistics 📊</h4>
                    <p>{progress}% of all tasks completed</p>
                    <Pie data={progressData} />
                    <div className="stats-breakdown">
                      <h5>Priority Distribution:</h5>
                      <p>🔴 High Priority: {tasks.filter(t => t.priority === "high" && !t.completed).length}</p>
                      <p>🟡 Medium Priority: {tasks.filter(t => t.priority === "medium" && !t.completed).length}</p>
                      <p>🟢 Low Priority: {tasks.filter(t => t.priority === "low" && !t.completed).length}</p>
                    </div>
                  </div>
                ) : (
              <ul>
                {(() => {
                  let filtered = [];
                  switch (modalType) {
                    case "all": filtered = tasks; break;
                    case "active": filtered = tasks.filter((t) => !t.completed); break;
                    case "completed": filtered = tasks.filter((t) => t.completed); break;
                    case "high": filtered = tasks.filter((t) => t.priority === "high" && !t.completed); break;
                    case "medium": filtered = tasks.filter((t) => t.priority === "medium" && !t.completed); break;
                    case "low": filtered = tasks.filter((t) => t.priority === "low" && !t.completed); break;
                    default: filtered = [];
                  }
                  return filtered.map((task) => (
                    <li key={task.id} className={`${task.completed ? "completed" : ""} ${task.priority}`}>
                      <span>{task.title}</span>
                      {task.time && <span>{task.time}</span>}
                      {!task.completed && (
                        <button onClick={() => completeTask(task.id)} className="done" style={{ marginLeft: 10 }}>Done</button>
                      )}
                    </li>
                  ));
                })()}
              </ul>
            )}

            <button onClick={() => setModalType(null)}>Close</button>
          </div>
        </>
      )}

      <div className="app">
        <button className="toggle-btn" onClick={toggleSidebar}>☰</button>

        <header className="header">
          <div className="header-content">
            <h1>My Daily Planner</h1>
            <p>Organize your day, track progress, and stay stress-free 🌸</p>
          </div>
        </header>

        {showInput && (
          <>
            <div className="floating-input-overlay" onClick={() => setShowInput(false)}></div>
            <div className="input-box floating-input" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                {/* Left Column: Task Title, Description, Priority */}
                <div className="modal-left-column">
            <div className="form-group">
              <label htmlFor="taskTitle"> Task Title</label>
              <input
                id="taskTitle"
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter task title..."
                autoFocus
                className="task-title-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="taskDescription"> Description (Optional)</label>
              <textarea
                id="taskDescription"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Add details, notes, or context for this task..."
                className="task-description-input"
                rows="3"
              />
            </div>

                  <div className="form-group">
                    <label htmlFor="taskPriority"> Priority</label>
                    <select 
                      id="taskPriority" 
                      value={taskPriority} 
                      onChange={(e) => setTaskPriority(e.target.value)} 
                      className={`priority-dropdown ${taskPriority}`}
                    >
                      <option value="low">🟢 Low Priority</option>
                      <option value="medium">🟡 Medium Priority</option>
                      <option value="high">🔴 High Priority</option>
                    </select>
                  </div>
                </div>

                {/* Right Column: Time, Date, Buttons */}
                <div className="modal-right-column">
            <div className="form-group">
              <label htmlFor="taskTime"> Time (Optional)</label>
              <div className="time-date-wrapper">
                <div className="task-input-wrapper">
                  <input
                    id="taskTime"
                    type="text"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    placeholder="Set time (e.g., 2:30 PM)"
                    className="time-input"
                  />
                  <button type="button" className="alarm-btn" onClick={() => setShowTimeModal(true)}>⏰</button>
                </div>
                {taskTime && <span className="selected-time">{taskTime}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="taskDate"> Date (Optional)</label>
              <input
                id="taskDate"
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="date-input"
              />
            </div>

                  <div className="modal-quote">
                    <p className="quote-text">"The way to get started is to quit talking and begin doing."</p>
                    <p className="quote-author">- Walt Disney</p>
            </div>

            <div className="form-actions">
              <button onClick={addTask} className="add-task-btn-form">
                ✨ Add Task
              </button>
              <button onClick={() => setShowInput(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
              </div>
            </div>
          </>
        )}

        {showTimeModal && (
          <div className="modal-overlay" onClick={() => setShowTimeModal(false)}>
            <div className="time-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Select Time</h3>
            <TimePicker
              onChange={(value) => {
                const formatted = value ? formatTimeTo12Hour(value) : "";
                setTaskTime(formatted);
              }}
              value={taskTime || null}
              disableClock={true}
              clearIcon={null}
              clockIcon={null}
              format="h:mm a"
              openClockOnFocus={false}
              className="time-picker"
              onKeyUp={(e) => {
                const key = e.key.toLowerCase();
                const raw = e.target.value.trim();

                const quickMatch = raw.match(/^(\d{1,2})(\d{2})?\s*([ap])?$/i);
                if (quickMatch) {
                  let [_, hour, minute, period] = quickMatch;
                  let formattedTime = "";

                  const hh = parseInt(hour, 10);
                  const mm = minute ? minute.padStart(2, "0") : "00";
                  const per = period ? (period.toLowerCase() === "p" ? "PM" : "AM") : "";

                  formattedTime = `${hh}:${mm}${per ? " " + per : ""}`;
                  const formatted = formatTimeTo12Hour(formattedTime);
                  if (formatted && per) {
                    setTaskTime(formatted);
                    setShowTimeModal(false);
                    return;
                  }
                }

                if (key === "a" || key === "p") {
                  const append = key === "a" ? "AM" : "PM";
                  let formattedInput = raw;

                  if (!new RegExp(append, "i").test(raw)) {
                    formattedInput = `${raw.replace(/\s*(am|pm)?$/i, "").trim()} ${append}`;
                  }

                  setTimeout(() => {
                    const formatted = formatTimeTo12Hour(formattedInput);
                    if (formatted) setTaskTime(formatted);
                    setShowTimeModal(false);
                  }, 100);
                }

                if (key === "enter") {
                  setTimeout(() => {
                    const formatted = raw ? formatTimeTo12Hour(raw) : "";
                    setTaskTime(formatted);
                    setShowTimeModal(false);
                  }, 100);
                }
              }}

            />

              <button onClick={() => setShowTimeModal(false)}>Set</button>
            </div>
          </div>
        )}

        <div className="progress-container"><div className="progress-bar" style={{ width: `${progress}%` }} /></div>
        <p className="progress-text">{progress}% Completed</p>

        <section className="tasks">
          <h2>To Do</h2>
          {activeTasks.length === 0 ? (
            <p className="empty">No tasks yet ✨</p>
          ) : (
            <ul>
              {activeTasks.map((task) => (
                <li key={task.id} className={`task-item ${task.priority}`}>
                  <div className="task-content">
                    <div className="task-title">{task.title}</div>
                    {task.description && <div className="task-description">{task.description}</div>}
                    <div className="task-meta">
                      <span className="task-time">{task.time}</span>
                      {task.date && <span className="task-date">{new Date(task.date).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="buttons">
                    <button onClick={() => completeTask(task.id)} className="done">Done</button>
                    <button onClick={() => { const newText = prompt("Edit task:", task.title); if (newText) editTask(task.id, newText); }} className="edit">Edit</button>
                    <button onClick={() => deleteTask(task.id)} className="delete">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="tasks completed-tasks">
          <h2>✨ Completed Tasks</h2>
          {completedTasks.length === 0 ? (
            <p className="empty">No completed tasks yet 🌸</p>
          ) : (
            <ul className="completed-list">
              {completedTasks.slice().reverse().map((task) => (
                <li key={task.id} className="completed-item">
                  <div className="completed-left">
                    <span className="completed-check">✔</span>
                    <div className="completed-info">
                      <span className="completed-name">{task.title}</span>
                      {task.time && <span className="completed-time">{task.time}</span>}
                    </div>
                  </div>
                  <button className="delete-completed" onClick={() => deleteTask(task.id)} title="Remove task">✖</button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="floating-buttons">
          <button className="add-task-btn" onClick={() => setShowInput((s) => !s)}>{showInput ? "✖" : "+"}</button>
        </div>

        {reminder && (
          <>
            <div className="reminder-overlay"></div>
            <div className="reminder-popup">
              <h2>
                <span className={`alarm-icon ${isAlarmPlayingRef.current ? "ring" : ""}`}>⏰</span> Reminder!
              </h2>
              <p>Task: <strong>{reminder.title}</strong></p>
              <p>Time: <em>{reminder.time}</em></p>
              <button onClick={stopAlarm}>Stop Alarm</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default App;
