import React, { useState } from "react";
import "./CategoryForm.css"; // make sure this CSS file exists

export default function CategoryForm({ onCreated, onClose }) {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch("http://localhost:3001/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to save category");

      onCreated();
    } catch (error) {
      console.error("❌ Failed to add category:", error);
      alert("Failed to add category. Please check your API connection.");
    }
  };

  return (
    <div className="bookform-container">
      {onClose && (
        <button className="close-btn" onClick={onClose} title="Close form">
          ×
        </button>
      )}

      <h2 className="form-title">Add Category</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            id="categoryName"
            className="input-field"
            placeholder=" "
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="categoryName" className="input-label">
            Category Name
          </label>
          <span className="input-line"></span>
        </div>

        <button type="submit" className="submit-btn">
          Save
        </button>
      </form>
    </div>
  );
}
