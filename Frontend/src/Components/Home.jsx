
import React, { useEffect, useState, useRef } from "react";
import "./Home.css";
import PostModal from "./PostModal";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentBg, setCurrentBg] = useState(0);
  const [openComments, setOpenComments] = useState({});
  const [visiblePosts, setVisiblePosts] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});

  const bgImages = [
    "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1506619216599-9d16a6f0b9b3?auto=format&fit=crop&w=1600&q=80",
  ];

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content?.split(/\s+/).length || 0;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime > 0 ? readTime : 1;
  };

  // Intersection Observer for animations
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
          }
        });
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    return () => observer.disconnect();
  }, []);

  // Background slideshow with smoother transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Fetch posts with loading animation
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay for better UX
    setTimeout(fetchPosts, 500);
  }, []);

  // Local storage for comments and reactions
  const readLocal = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  };

  const saveLocal = (key, val) => {
    localStorage.setItem(key, JSON.stringify(val));
  };

  const getComments = (postId) => {
    const all = readLocal("comments", {});
    return all[postId] || [];
  };

  const addComment = (postId, name, text) => {
    if (!text || !name) return;
    const all = readLocal("comments", {});
    const item = {
      id: Date.now(),
      name: name.trim(),
      text: text.trim(),
      createdAt: new Date().toISOString()
    };
    all[postId] = all[postId] ? [item, ...all[postId]] : [item];
    saveLocal("comments", all);
    setCommentInputs((s) => ({ ...s }));

    // Show success feedback
    const notification = document.createElement('div');
    notification.textContent = 'Comment added successfully!';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  };

  const getReactions = (postId) => {
    const all = readLocal("reactions", {});
    return all[postId] || { likes: 0, liked: false };
  };

  const toggleLike = (postId) => {
    const all = readLocal("reactions", {});
    const cur = all[postId] || { likes: 0, liked: false };
    const next = { likes: cur.liked ? Math.max(cur.likes - 1, 0) : cur.likes + 1, liked: !cur.liked };
    all[postId] = next;
    saveLocal("reactions", all);
    setCommentInputs((s) => ({ ...s }));

    // Add haptic feedback animation
    const btn = document.querySelector(`[data-post-id="${postId}"] .like-btn`);
    if (btn) {
      btn.style.animation = 'none';
      setTimeout(() => btn.style.animation = '', 10);
    }
  };

  const toggleCommentsOpen = (postId) => {
    setOpenComments((s) => ({ ...s, [postId]: !s[postId] }));
  };

  const handleCommentChange = (postId, field, value) => {
    setCommentInputs((s) => ({ ...s, [postId]: { ...(s[postId] || {}), [field]: value } }));
  };

  const handleReadMore = (post) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const handleClosePostModal = () => {
    setShowPostModal(false);
    setSelectedPost(null);
  };

  // Load more posts functionality
  const loadMorePosts = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisiblePosts(prev => prev + 6);
      setIsLoadingMore(false);
    }, 1000);
  };

  // Filter posts based on search
  const filteredPosts = posts.filter((p) => {
    const q = searchTerm.toLowerCase();
    if (!q) return true;
    const inTitle = p.title?.toLowerCase().includes(q);
    const inContent = p.content?.toLowerCase().includes(q);
    const comments = getComments(p.id.toString());
    const inComments = comments.some((c) => c.text.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
    return inTitle || inContent || inComments;
  });

  const displayedPosts = filteredPosts.slice(0, visiblePosts);

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          {bgImages.map((img, i) => (
            <div
              key={img}
              className={`hero-slide ${i === currentBg ? "active" : ""}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

        <div className="hero-overlay" />

        <div className="hero-content">
          <span className="hero-badge">✨ Developer Blog</span>
          <h1>Building the Modern Web</h1>
          <p>
            Discover cutting-edge tutorials, real-world projects, and deep dives into
            React, JavaScript, Node.js, and modern web engineering practices.
          </p>

          <div className="hero-dots">
            {bgImages.map((_, i) => (
              <button
                key={i}
                className={i === currentBg ? "active" : ""}
                onClick={() => setCurrentBg(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* POSTS */}
      <section className="latest">
        <div className="section-header">
          <h2>Latest Articles</h2>
          <p>Thoughtful guides and hands-on tutorials from the community</p>
        </div>

        <input
          className="search-input"
          placeholder="🔍 Search articles, comments, or authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading && (
          <div className="status">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
              <div className="loading-shimmer" style={{ width: '20px', height: '20px', borderRadius: '50%' }}></div>
              <span>Loading amazing content...</span>
            </div>
          </div>
        )}
        {error && <p className="status error">{error}</p>}

        {!loading && !error && (
          <>
            <div className="posts-grid">
              {displayedPosts.map((post, index) => (
                <article
                  key={post.id}
                  className="post-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  ref={(el) => el && observerRef.current?.observe(el)}
                >
                  {post.image && (
                    <img
                      src={`http://localhost:5000/uploads/${post.image}`}
                      alt={post.title}
                      className="post-image"
                      loading="lazy"
                    />
                  )}

                  <div className="post-body">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="post-date">
                        📅 {new Date(post.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="read-time">⏱️ {calculateReadTime(post.content)} min read</span>
                    </div>

                    <h3>{post.title}</h3>
                    <p>{post.content?.slice(0, 150)}...</p>

                    <div className="interactive-row">
                      <button
                        className={`like-btn ${getReactions(post.id.toString()).liked ? "liked" : ""}`}
                        onClick={() => toggleLike(post.id.toString())}
                        data-post-id={post.id}
                        title={getReactions(post.id.toString()).liked ? "Unlike this post" : "Like this post"}
                      >
                        {getReactions(post.id.toString()).liked ? '❤️' : '🤍'} {getReactions(post.id.toString()).likes}
                      </button>

                      <button
                        className="comment-toggle"
                        onClick={() => toggleCommentsOpen(post.id.toString())}
                        title="View/Add comments"
                      >
                        💬 {getComments(post.id.toString()).length}
                      </button>

                      <a
                        className="read-more"
                        href="#"
                        title="Read full article"
                        onClick={(e) => {
                          e.preventDefault();
                          handleReadMore(post);
                        }}
                      >
                        Read article →
                      </a>
                    </div>

                    {openComments[post.id] && (
                      <div className="comments-section">
                        <div className="add-comment">
                          <input
                            type="text"
                            placeholder="Your name (required)"
                            value={commentInputs[post.id]?.name || ""}
                            onChange={(e) => handleCommentChange(post.id, "name", e.target.value)}
                            maxLength={50}
                          />
                          <textarea
                            placeholder="Share your thoughts... (required)"
                            value={commentInputs[post.id]?.text || ""}
                            onChange={(e) => handleCommentChange(post.id, "text", e.target.value)}
                            maxLength={500}
                            rows={3}
                          />
                          <button
                            className="post-comment-btn"
                            onClick={() => {
                              const inp = commentInputs[post.id] || {};
                              if (!inp.name?.trim() || !inp.text?.trim()) {
                                alert('Please fill in both name and comment fields.');
                                return;
                              }
                              addComment(post.id.toString(), inp.name.trim(), inp.text.trim());
                              handleCommentChange(post.id, "text", "");
                            }}
                          >
                            Post Comment
                          </button>
                        </div>

                        <div className="comments-list">
                          {getComments(post.id.toString()).map((c) => (
                            <div key={c.id} className="comment-item">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <strong>{c.name}</strong>
                                <small className="comment-time">
                                  — {new Date(c.createdAt).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </small>
                              </div>
                              <p>{c.text}</p>
                            </div>
                          ))}
                          {getComments(post.id.toString()).length === 0 && (
                            <p className="muted">💭 No comments yet. Be the first to share your thoughts!</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {filteredPosts.length > visiblePosts && (
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button
                  onClick={loadMorePosts}
                  disabled={isLoadingMore}
                  style={{
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: isLoadingMore ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    opacity: isLoadingMore ? 0.7 : 1
                  }}
                >
                  {isLoadingMore ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="loading-shimmer" style={{ width: '16px', height: '16px', borderRadius: '50%' }}></div>
                      Loading...
                    </span>
                  ) : (
                    `Load More Articles (${filteredPosts.length - visiblePosts} remaining)`
                  )}
                </button>
              </div>
            )}

            {filteredPosts.length === 0 && !loading && (
              <div className="status" style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                <h3>No articles found</h3>
                <p>Try adjusting your search terms or check back later for new content.</p>
              </div>
            )}
          </>
        )}
      </section>

      <PostModal
        isOpen={showPostModal}
        post={selectedPost}
        onClose={handleClosePostModal}
        onLike={toggleLike}
        onCommentToggle={(postId) => setOpenComments(prev => ({ ...prev, [postId]: true }))}
        getReactions={getReactions}
        getComments={getComments}
        calculateReadTime={calculateReadTime}
      />
    </div>
  );
};

export default Home;
