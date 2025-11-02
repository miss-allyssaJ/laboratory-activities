import React, { useState, useEffect } from "react";
import "./BookForm.css";
import axios from "axios";

export default function UpdateBookForm({ existingBook, onBookUpdated, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    authorName: "",
    categoryName: "",
  });

  const [coverFile, setCoverFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const categorySuggestions = [
    "Fiction",
    "Non-Fiction",
    "Mystery/Thriller",
    "Romance",
    "Science Fiction",
    "Fantasy",
    "Biography",
    "History",
    "Self-Help",
    "Children's Books",
    "Poetry",
    "Horror",
    "Adventure",
    "Drama",
    "Educational",
  ];

  useEffect(() => {
    if (existingBook) {
      setFormData({
        title: existingBook.title || "",
        authorName: existingBook.author?.name || "",
        categoryName: existingBook.category?.name || "",
      });

      if (existingBook.cover) {
        const normalized = existingBook.cover.startsWith("http")
          ? existingBook.cover
          : `http://localhost:3001/uploads/${existingBook.cover.replace(/^\/?uploads\//, "")}`;
        setPreview(normalized);
      }
    }
  }, [existingBook]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB.");
      return;
    }

    setError("");
    setCoverFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.authorName || !formData.categoryName) {
      setError("All fields are required.");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("authorName", formData.authorName);
      data.append("categoryName", formData.categoryName);
      if (coverFile) data.append("cover", coverFile);

      await axios.put(`http://localhost:3001/books/${existingBook.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Book updated successfully!");
      if (onBookUpdated) onBookUpdated();
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update book. See console for details.");
    }
  };

  return (
    <div className="bookform-container">
      {onClose && (
        <button className="close-btn" onClick={onClose} title="Close form">
          ×
        </button>
      )}

      <h2 className="form-title">Update Book</h2>

      <form onSubmit={handleSubmit}>
        <InputField
          id="title"
          label="Book Title"
          value={formData.title}
          onChange={handleChange}
        />
        <InputField
          id="authorName"
          label="Author Name"
          value={formData.authorName}
          onChange={handleChange}
        />
        <InputField
          id="categoryName"
          label="Category"
          value={formData.categoryName}
          onChange={handleChange}
          list="categoryOptions"
        />
        <datalist id="categoryOptions">
          {categorySuggestions.map((cat, index) => (
            <option key={index} value={cat} />
          ))}
        </datalist>

        <div className="image-upload">
          <label htmlFor="cover" className="image-label">
            {preview ? "Change Cover" : "Upload New Cover (optional)"}
          </label>
          <input
            type="file"
            id="cover"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
          {error && <p className="error-msg">{error}</p>}
          {preview && (
            <div className="preview-container">
              <img src={preview} alt="Cover Preview" className="cover-preview" />
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn">
          Update Book
        </button>
      </form>
    </div>
  );
}

function InputField({ id, label, type = "text", value, onChange, ...props }) {
  return (
    <div className="input-group">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="input-field"
        placeholder=" "
        required
        {...props}
      />
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <span className="input-line"></span>
    </div>
  );
}
