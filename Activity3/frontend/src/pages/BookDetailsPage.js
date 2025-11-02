import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/api";
import { User, Tags, ArrowLeft, Lock } from "lucide-react";
import "./BookDetailsPage.css";

export default function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get the tab we came from (default to "Library")
  const fromTab = searchParams.get('from') || 'Library';
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const res = await api.get(`/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error("Failed to fetch book details:", err);
      }
    };
    fetchBookDetails();
  }, [id]);

  if (!book) {
    return <p className="empty-msg">Loading book information...</p>;
  }

  let coverUrl = "https://via.placeholder.com/150x220.png?text=Book+Cover";
  if (book.cover && typeof book.cover === "string") {
    if (book.cover.startsWith("http")) {
      coverUrl = book.cover;
    } else {
      const normalized = book.cover.replace(/^\/?uploads\//, "");
      coverUrl = `http://localhost:3001/uploads/${normalized}`;
    }
  }

  return (
    <div className="book-details-page">
      <button className="back-btn" onClick={() => navigate(`/books?tab=${fromTab}`)}>
        <ArrowLeft /> Back
      </button>
      <h1 className="page-title">About This Book</h1>

      <div className="book-details-container">
        <div className="cover">
          <img
            src={coverUrl}
            alt={book.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://via.placeholder.com/150x220.png?text=Book+Cover";
            }}
          />
        </div>
        <div className="info">
          <div className="info-top">
            <h1 className="book-title">{book.title}</h1>

            <p className="meta">
              <User className="icon" />
              <span className="meta-label">Author:</span>
              <span className="meta-value">{book.author?.name || "Unknown"}</span>
            </p>

            <p className="meta">
              <Tags className="icon" />
              <span className="meta-label">Category:</span>
              <span className="meta-value">
                {book.category?.name || "Uncategorized"}
              </span>
            </p>
          </div>

          <div className="info-bottom-outer">
            <div className="info-bottom locked-area">
              <h3>Description</h3>
              <p>{book.description || "No description available."}</p>
            </div>

            <div className="lock-overlay">
              <Lock className="lock-icon" size={42} />
              <p className="lock-text">
                The full description is locked. Please subscribe to access the
                complete content.
              </p>
              <button className="unlock-btn" disabled>
                Unlock Access
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
