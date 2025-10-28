import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI, commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CommentList from '../components/CommentList';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getOne(id);
      setPost(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load post');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentsAPI.getByPost(id);
      setComments(response.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }

    setSubmitting(true);
    setCommentError('');

    try {
      await commentsAPI.create(id, { content: commentContent });
      setCommentContent('');
      fetchComments();
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await commentsAPI.delete(id, commentId);
      fetchComments();
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postsAPI.delete(id);
      navigate('/');
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="post-detail-container">
        <div className="loading">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail-container">
        <div className="error-message">{error || 'Post not found'}</div>
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      <article className="post-detail">
        <header className="post-header">
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span className="post-author">By {post.author?.username}</span>
            <span className="post-date">{formatDate(post.createdAt)}</span>
          </div>
          {user && user.id === post.authorId && (
            <div className="post-actions">
              <button onClick={handleDeletePost} className="delete-post-btn">
                Delete Post
              </button>
            </div>
          )}
        </header>
        <div className="post-content">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className="comments-section">
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <h3>Add a Comment</h3>
            {commentError && <div className="error-message">{commentError}</div>}
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write your comment here..."
              rows="4"
              required
            />
            <button type="submit" disabled={submitting} className="submit-comment-btn">
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="login-prompt">
            <p>Please log in to comment on this post.</p>
          </div>
        )}

        <CommentList comments={comments} onDelete={handleDeleteComment} />
      </section>
    </div>
  );
};

export default PostDetail;
