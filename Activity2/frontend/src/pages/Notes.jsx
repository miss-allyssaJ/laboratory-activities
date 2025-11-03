import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Notes() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`http://localhost:3000/notes/${user.id}`);
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setLoading(true);
    try {
      if (editingId) {
        await fetch(`http://localhost:3000/notes/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        await fetch('http://localhost:3000/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, userId: user.id }),
        });
      }
      setForm({ title: '', content: '' });
      setEditingId(null);
      fetchNotes();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setForm({ title: note.title, content: note.content });
    setEditingId(note.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await fetch(`http://localhost:3000/notes/${id}`, { method: 'DELETE' });
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>📝 My Notes</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </header>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <textarea
          name="content"
          placeholder="Write your note..."
          value={form.content}
          onChange={handleChange}
          style={styles.textarea}
          required
        />
        <button type="submit" style={styles.addBtn} disabled={loading}>
          {loading
            ? 'Saving...'
            : editingId
            ? 'Update Note'
            : 'Add Note'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ title: '', content: '' });
            }}
            style={styles.cancelBtn}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div style={styles.notesList}>
        {notes.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#777' }}>No notes yet. Add one above!</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} style={styles.noteCard}>
              <div>
                <h3 style={{ margin: 0 }}>{note.title}</h3>
                <p style={{ marginTop: 5, whiteSpace: 'pre-wrap' }}>{note.content}</p>
              </div>
              <div style={styles.actions}>
                <button onClick={() => handleEdit(note)} style={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(note.id)} style={styles.deleteBtn}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f7f4f1',
    padding: '40px 20px',
    fontFamily: 'Segoe UI, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 700,
    margin: '0 auto 30px',
  },
  logoutBtn: {
    background: '#000000ff',
    border: 'none',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  form: {
    background: '#fff',
    maxWidth: 700,
    margin: '0 auto',
    padding: 20,
    borderRadius: 10,
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  input: {
    padding: '10px',
    borderRadius: 6,
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '10px',
    borderRadius: 6,
    border: '1px solid #ccc',
    minHeight: '80px',
  },
  addBtn: {
    background: '#4B3A2F',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: 6,
    cursor: 'pointer',
  },
  cancelBtn: {
    background: '#ccc',
    color: '#333',
    border: 'none',
    padding: '8px',
    borderRadius: 6,
    cursor: 'pointer',
  },
  notesList: {
    maxWidth: 700,
    margin: '30px auto 0',
  },
  noteCard: {
    background: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  actions: {
    marginTop: 10,
    display: 'flex',
    gap: 10,
  },
  editBtn: {
    background: '#87666eff',
    border: 'none',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: 6,
    cursor: 'pointer',
  },
  deleteBtn: {
    background: '#150100ff',
    border: 'none',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: 6,
    cursor: 'pointer',
  },
};
