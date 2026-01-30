import React from 'react';

const PostModal = ({
  isOpen,
  post,
  onClose,
  onLike,
  onCommentToggle,
  getReactions,
  getComments,
  calculateReadTime
}) => {
  if (!isOpen || !post) return null;

  return (
    <div
      className="post-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div
        className="post-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '20px',
          maxWidth: '800px',
          maxHeight: '90vh',
          width: '90%',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        <div style={{ position: 'relative' }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1
            }}
          >
            ×
          </button>

          {post.image && (
            <img
              src={`http://localhost:5000/uploads/${post.image}`}
              alt={post.title}
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                borderRadius: '20px 20px 0 0'
              }}
            />
          )}

          <div style={{ padding: '2rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              color: '#6c757d'
            }}>
              <span style={{ marginRight: '1rem' }}>
                📅 {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span>
                ⏱️ {calculateReadTime(post.content)} min read
              </span>
            </div>

            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              lineHeight: '1.2',
              color: '#2d3748'
            }}>
              {post.title}
            </h1>

            <div style={{
              fontSize: '1.1rem',
              lineHeight: '1.8',
              color: '#4a5568',
              whiteSpace: 'pre-wrap'
            }}>
              {post.content}
            </div>

            <div style={{
              marginTop: '2rem',
              paddingTop: '2rem',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button
                  className={`like-btn ${getReactions(post.id.toString()).liked ? "liked" : ""}`}
                  onClick={() => onLike(post.id.toString())}
                  style={{
                    background: getReactions(post.id.toString()).liked ? '#fed7d7' : '#f8f9fa',
                    border: '1px solid #dee2e6',
                    padding: '0.5rem 1rem',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {getReactions(post.id.toString()).liked ? '❤️' : '🤍'} {getReactions(post.id.toString()).likes}
                </button>

                <button
                  className="comment-toggle"
                  onClick={() => {
                    onClose();
                    onCommentToggle(post.id);
                  }}
                  style={{
                    background: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    padding: '0.5rem 1rem',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  💬 {getComments(post.id.toString()).length}
                </button>
              </div>

              <button
                onClick={onClose}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;