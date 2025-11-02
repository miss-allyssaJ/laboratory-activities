import React, { useState } from "react";
import "./AuthorForm.css";

export default function AuthorForm({ onCreated, onClose }) {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch("http://localhost:3001/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to add author");
      onCreated();
      setName(""); // reset input
      if (onClose) onClose();
    } catch (error) {
      console.error("Error adding author:", error);
      alert("Failed to add author. Please check your API connection.");
    }
  };

  return (
    <div className="authorform-container">
      {onClose && (
        <button className="close-btn" onClick={onClose} title="Close form">
          ×
        </button>
      )}

      <h2 className="form-title">Add Author</h2>

      <form onSubmit={handleSubmit}>
        <InputField
          id="authorName"
          label="Author Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit" className="submit-btn">
          Save
        </button>
      </form>
    </div>
  );
}

function InputField({ id, label, value, onChange }) {
  return (
    <div className="input-group">
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        className="input-field"
        placeholder=" "
        required
      />
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <span className="input-line"></span>
    </div>
  );
}
