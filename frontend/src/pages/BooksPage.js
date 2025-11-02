import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { api } from "../api/api";
import BookForm from "../components/BookForm";
import AuthorForm from "../components/AuthorForm";
import CategoryForm from "../components/CategoryForm";
import { Book, User, Tags, LogOut, X, Edit, Trash2 } from "lucide-react";
import "./BooksPage.css";
import UpdateBookForm from "../components/UpdateBookForm";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showBookForm, setShowBookForm] = useState(false);
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialTab = () => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['Library', 'Authors', 'Categories'].includes(tabFromUrl)) {
      return tabFromUrl;
    }
    return 'Library';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categorySourceTab, setCategorySourceTab] = useState(null);
  const [darkMode] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [gridAnimated, setGridAnimated] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['Library', 'Authors', 'Categories'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [location, searchParams]);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books");
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  };

  const fetchAuthors = async () => {
    try {
      const res = await api.get("/authors");
      setAuthors(res.data);
    } catch (err) {
      console.error("Failed to fetch authors:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setGridAnimated(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleDeleteBook = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await api.delete(`/books/${id}`);
        fetchBooks();
      } catch (err) {
        console.error("Failed to delete book:", err);
      }
    }
  };

  const filteredBooks = books.filter((b) => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory
      ? b.category?.name === selectedCategory
      : true;
    return matchSearch && matchCategory;
  });

  const filteredAuthors = authors.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`books-page ${darkMode ? "dark" : ""}`}>
      <header className="top-header">
        <h1>Bookshelf</h1>

        {activeTab === "Library" && (
          <div className="top-controls">
            <div className="search-wrapper">
              <input
                type="text"
                className="search-bar"
                placeholder="Search books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <X
                  size={18}
                  className="clear-btn"
                  onClick={() => setSearch("")}
                />
              )}
            </div>

            {selectedCategory && (
              <div className="category-filter-tag">
                <span className="category-filter-text">{selectedCategory}</span>
                <button 
                  className="category-filter-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (categorySourceTab && categorySourceTab !== activeTab) {
                      handleTabChange(categorySourceTab);
                    }
                    setSelectedCategory(null);
                    setCategorySourceTab(null);
                  }}
                  aria-label="Remove category filter"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <button className="add-btn" onClick={() => setShowBookForm(true)}>
              + Add Book
            </button>
          </div>
        )}

        {activeTab === "Authors" && (
          <div className="top-controls">
            <div className="search-wrapper">
              <input
                type="text"
                className="search-bar"
                placeholder="Search authors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <X
                  size={18}
                  className="clear-btn"
                  onClick={() => setSearch("")}
                />
              )}
            </div>
            <button className="add-btn" onClick={() => setShowAuthorForm(true)}>
              + Add Author
            </button>
          </div>
        )}

        {activeTab === "Categories" && (
          <div className="top-controls">
            <div className="search-wrapper">
              <input
                type="text"
                className="search-bar"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <X
                  size={18}
                  className="clear-btn"
                  onClick={() => setSearch("")}
                />
              )}
            </div>
            <button
              className="add-btn"
              onClick={() => setShowCategoryForm(true)}
            >
              + Add Category
            </button>
          </div>
        )}
      </header>

      {(showBookForm || showAuthorForm || showCategoryForm || editBook) && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowBookForm(false);
            setShowAuthorForm(false);
            setShowCategoryForm(false);
            setEditBook(null);
          }}
        >
          <div className="form-popup" onClick={(e) => e.stopPropagation()}>
            <div className="form-box">
              {showBookForm && (
                <BookForm
                  onBookAdded={() => {
                    fetchBooks();
                    setShowBookForm(false);
                  }}
                  onClose={() => setShowBookForm(false)}
                />
              )}

              {editBook && (
                <UpdateBookForm
                  existingBook={editBook}
                  onBookUpdated={() => {
                    fetchBooks();
                    setEditBook(null);
                  }}
                  onClose={() => setEditBook(null)}
                />
              )}

              {showAuthorForm && (
                <AuthorForm
                  onCreated={() => {
                    fetchAuthors();
                    setShowAuthorForm(false);
                  }}
                  onClose={() => setShowAuthorForm(false)}
                />
              )}

              {showCategoryForm && (
                <CategoryForm
                  onCreated={() => {
                    fetchCategories();
                    setShowCategoryForm(false);
                  }}
                  onClose={() => setShowCategoryForm(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div className={`book-grid ${gridAnimated ? "animated" : ""}`}>
        {activeTab === "Library" &&
          (filteredBooks.length > 0 ? (
            filteredBooks.map((b) => {
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
                <div className="book-card" key={b.id}>
                  <div
                    className="book-cover"
                    onClick={() => navigate(`/books/${b.id}?from=${activeTab}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={coverUrl}
                      alt={b.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://via.placeholder.com/150x220.png?text=Book+Cover";
                      }}
                    />
                  </div>
                  <div className="book-info">
                    <h3>{b.title}</h3>
                    <p>{b.author?.name || "Unknown Author"}</p>
                  </div>
                  <div className="book-actions">
                    <button
                      className="edit-btn"
                      onClick={() => setEditBook(b)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteBook(b.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="empty-msg">No books found</p>
          ))}

        {activeTab === "Authors" &&
          (filteredAuthors.length > 0 ? (
            filteredAuthors.map((a) => (
              <div
                className="book-card"
                key={a.id}
                onClick={() => navigate(`/authors/${a.id}?from=Authors`)}
                style={{ cursor: "pointer" }}
              >
                <div className="book-info">
                  <User className="w-5 h-5" />
                  <h3>{a.name}</h3>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-msg">No authors found</p>
          ))}

        {activeTab === "Categories" &&
          (filteredCategories.length > 0 ? (
            filteredCategories.map((c) => (
              <div
                className="category-card"
                key={c.id}
                onClick={() => {
                  setCategorySourceTab(activeTab);
                  setSelectedCategory(c.name);
                  handleTabChange("Library");
                }}
                style={{ cursor: "pointer" }}
              >
                <div className="circle-icon">
                  <Tags />
                </div>
                <span>{c.name}</span>
              </div>
            ))
          ) : (
            <p className="empty-msg">No categories found</p>
          ))}
      </div>

      <nav className="bottom-nav">
        <button
          className={activeTab === "Library" ? "active" : ""}
          onClick={() => handleTabChange("Library")}
        >
          <Book />
          <span>Library</span>
        </button>
        <button
          className={activeTab === "Authors" ? "active" : ""}
          onClick={() => handleTabChange("Authors")}
        >
          <User />
          <span>Authors</span>
        </button>
        <button
          className={activeTab === "Categories" ? "active" : ""}
          onClick={() => handleTabChange("Categories")}
        >
          <Tags />
          <span>Categories</span>
        </button>

        <button
          className="logout-nav-btn"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            window.location.href = "/login";
          }}
        >
          <LogOut />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}
