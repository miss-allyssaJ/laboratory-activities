import React from 'react';
import { useAuth } from '../context/AuthContext';
import './CommentList.css';

const CommentList = ({ comments, onDelete }) => {
  const { user } = useAuth();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!comments || comments.length === 0) {
    return <p className="no-comments">No comments yet. Be the first to comment!</p>;
  }

  return (
    <div className="comments-list">
      <h3>Comments ({comments.length})</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <div className="comment-header">
            <span className="comment-author">{comment.author?.username}</span>
            <span className="comment-date">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="comment-content">{comment.content}</p>
          {user && user.id === comment.authorId && (
            <button
              onClick={() => onDelete(comment.id)}
              className="comment-delete-btn"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
