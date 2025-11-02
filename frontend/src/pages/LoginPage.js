import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./LoginPage.css";
import BookIcon from "../book.png"; 

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setAlertMsg("Login successful!");
        setAlertType("success");

        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", username);

        setTimeout(() => {
          if (data.role === "admin") {
            window.location.href = "/admin/dashboard";
          } else {
            window.location.href = "/";
          }
        }, 1200);
      } else {
        setAlertMsg(data.message || "Invalid credentials");
        setAlertType("error");
      }
    } catch {
      setAlertMsg("Something went wrong");
      setAlertType("error");
    }
  };

  return (
    <div className="login-page">
      <div className="overlay"></div>

      <div className="login-container">
        <motion.div
          className="login-card"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="login-title">
            <span className="gradient-text">Bookshelf</span>
          </h1>

          <AnimatePresence>
            {alertMsg && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className={`alert-box ${alertType}`}
              >
                {alertMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <input
                type="text"
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
              <label htmlFor="username">Username</label>
            </div>

            <div className="input-group">
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <label htmlFor="password">Password</label>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="login-button"
            >
              Login
            </motion.button>

            <p className="signup-text">
              Don’t have an account?{" "}
              <Link to="/signup" className="signup-link">
                Sign up
              </Link>
            </p>
          </form>
        </motion.div>

        <div className="login-image">
          <img src={BookIcon} alt="Bookshelf Logo" />
        </div>
      </div>
    </div>
  );
}
