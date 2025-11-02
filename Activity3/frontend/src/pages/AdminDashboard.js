import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <header style={{ textAlign: "center", padding: "20px" }}>
        <h1>Admin Dashboard</h1>
        <p>Welcome, Administrator!</p>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 14px",
            background: "#d33",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginTop: "10px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <p>You can manage books, authors, and categories here soon.</p>
      </div>
    </div>
  );
}
