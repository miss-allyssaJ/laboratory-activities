import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/api";
import { ArrowLeft, BookOpen } from "lucide-react";
import "./AuthorDetailsPage.css";

export default function AuthorDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  
  const fromTab = searchParams.get('from') || 'Authors';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authorRes = await api.get(`/authors/${id}`);
        setAuthor(authorRes.data);

        const booksRes = await api.get("/books");
        const filteredBooks = booksRes.data.filter(
          (b) => b.author?.id === parseInt(id)
        );
        setBooks(filteredBooks);
      } catch (err) {
        console.error("Failed to load author details:", err);
      }
    };
    fetchData();
  }, [id]);

  if (!author) return <p className="empty-msg">Loading author details...</p>;

  return (
    <div className="author-details-page">
      <button className="back-btn" onClick={() => navigate(`/books?tab=${fromTab}`)}>
        <ArrowLeft /> Back
      </button>

      <h1 className="page-title">{author.name}</h1>
      <p className="subtitle">Author Profile</p>

      <div className="author-info">
        <p>
          <strong>Books Published:</strong> {books.length}
        </p>
      </div>

      <h2 className="books-header">
        <BookOpen className="icon" /> Books by {author.name}
      </h2>

      <div className="book-grid">
        {books.length > 0 ? (
          books.map((b) => {
            let coverUrl =
              "https://via.placeholder.com/150x220.png?text=Book+Cover";
            if (b.cover && typeof b.cover === "string") {
              if (b.cover.startsWith("http")) {
                coverUrl = b.cover;
              } else {
                const normalized = b.cover.replace(/^\/?uploads\//, "");
                coverUrl = `http://localhost:3001/uploads/${normalized}`;
              }
            }

            return (
              <div
                key={b.id}
                className="book-card"
                onClick={() => navigate(`/books/${b.id}?from=Authors`)}
              >
                <img src={coverUrl} alt={b.title} />
                <h3>{b.title}</h3>
              </div>
            );
          })
        ) : (
          <p className="empty-msg">No books found for this author.</p>
        )}
      </div>
    </div>
  );
}
