import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SignUpPage.css";
import BookIcon from "../book.png"; 

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");


  const showAlert = (msg, type) => {
    setAlertMsg(msg);
    setAlertType(type);
    setTimeout(() => {
      setAlertMsg("");
      setAlertType("");
    }, 2000); 
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      showAlert(
        "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character.",
        "error"
      );
      return;
    }

    if (password !== confirmPassword) {
      showAlert("Passwords do not match", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showAlert("Account created! You can now log in.", "success");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        showAlert(data.message || "Registration failed", "error");
      }
    } catch {
      showAlert("Something went wrong", "error");
    }
  };

  return (
    <div className="login-page">
      <div className="overlay"></div>

      <div className="login-container">
        <form onSubmit={handleSignup} className="login-card">
          <h2 className="login-title">Bookshelf</h2>
          {alertMsg && <div className={`alert-box ${alertType}`}>{alertMsg}</div>}

          <div className="input-group">
            <input
              type="text"
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label>Username</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Password</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder=" "
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label>Confirm Password</label>
          </div>

          <button type="submit" className="login-button">
            Sign Up
          </button>

          <p className="signup-text">
            Already have an account?{" "}
            <Link to="/login" className="signup-link">
              Login here
            </Link>
          </p>
        </form>

        <div className="login-image">
          <img src={BookIcon} alt="Bookshelf Logo" />
        </div>
      </div>
    </div>
  );
}
