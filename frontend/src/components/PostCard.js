import React from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css';

const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="post-card">
      <h2 className="post-card-title">
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h2>
      <div className="post-card-meta">
        <span className="post-card-author">By {post.author?.username}</span>
        <span className="post-card-date">{formatDate(post.createdAt)}</span>
      </div>
      <p className="post-card-content">
        {post.content.substring(0, 200)}
        {post.content.length > 200 ? '...' : ''}
      </p>
      <Link to={`/posts/${post.id}`} className="post-card-link">
        Read More →
      </Link>
    </div>
  );
};

export default PostCard;
