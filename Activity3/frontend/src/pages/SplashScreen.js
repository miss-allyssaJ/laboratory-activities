import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookIcon from "../book.png";
import "./SplashScreen.css"; 

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const timer = setTimeout(() => {
      if (token) {
        if (role === "admin") navigate("/admin/dashboard");
        else navigate("/books");
      } else {
        navigate("/login");
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <img src={BookIcon} alt="Bookshelf Logo" className="splash-logo" />
      <h1 className="splash-title">Bookshelf App</h1>
      <div className="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
