'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Mock data (same as your list)
const mockBlogPosts = [
  {
    id: 1,
    title: "The Benefits of Omega-3 for Heart Health",
    excerpt: "Discover how omega-3 fatty acids can significantly improve cardiovascular function and reduce heart disease risk.",
    content: "Full content about omega-3 benefits for heart health... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/api/placeholder/300/200",
    date: "2023-10-15",
    status: "published",
    readTime: "5 min read",
    views: "4.2k views",
    author: "Dr. John Smith",
    authorEmail: "john.smith@example.com"
  },
  {
    id: 2,
    title: "Brain Function and DHA: What You Need to Know",
    excerpt: "Learn about the critical role DHA plays in cognitive function and brain development across all ages.",
    content: "Full content about DHA and brain function... Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "/api/placeholder/300/200",
    date: "2023-10-10",
    status: "published",
    readTime: "4 min read",
    views: "3.8k views",
    author: "Dr. Sarah Johnson",
    authorEmail: "sarah.johnson@example.com"
  },
  // ... add other posts with content and author/authorEmail fields
];

export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [blog, setBlog] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeedbackBox, setShowFeedbackBox] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const authStatus = localStorage.getItem('isAuthenticated');
        
        if (authStatus === 'true') {
          setIsAuthenticated(true);
          const blogId = parseInt(params.id);
          const foundBlog = mockBlogPosts.find(post => post.id === blogId);
          setBlog(foundBlog);
          setIsLoading(false);
        } else {
          setIsAuthenticated(false);
          router.push('/login');
        }
      }
    };

    const timer = setTimeout(checkAuth, 500);
    return () => clearTimeout(timer);
  }, [params.id, router]);

  const handlePublish = () => {
    if (!blog) return;
    alert(`Post "${blog.title}" has been published successfully!`);
  };

  const handleReject = () => {
    if (!blog) return;
    
    if (window.confirm(`Are you sure you want to reject and delete the post "${blog.title}"?`)) {
      alert(`Post "${blog.title}" has been rejected and deleted.`);
      router.push('/list');
    }
  };

  const handleSendFeedback = () => {
    if (!blog || !feedbackMessage.trim()) return;
    
    alert(`Feedback sent to ${blog.author} (${blog.authorEmail}): ${feedbackMessage}`);
    setShowFeedbackBox(false);
    setFeedbackMessage('');
  };

  const handleBackToList = () => {
    router.push('/list');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Loading Content</p>
        </div>
        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #ffffff;
          }
          .loading-content {
            text-align: center;
            color: #000;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 2px solid #f0f0f0;
            border-top: 2px solid #000;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          p {
            font-size: 0.9rem;
            letter-spacing: 0.5px;
          }
        `}</style>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null;
  }

  if (!blog) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h1>Post Not Found</h1>
          <p>The requested article could not be located.</p>
          <button onClick={handleBackToList} className="back-btn">
            Return to Articles
          </button>
        </div>
        <style jsx>{`
          .error-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #ffffff;
          }
          .error-content {
            text-align: center;
            color: #000;
            padding: 40px;
          }
          .error-content h1 {
            font-size: 1.5rem;
            font-weight: 300;
            margin-bottom: 10px;
            letter-spacing: 1px;
          }
          .error-content p {
            color: #666;
            margin-bottom: 30px;
            font-size: 0.9rem;
          }
          .back-btn {
            background: #000;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 0.8rem;
            letter-spacing: 0.5px;
            cursor: pointer;
            transition: opacity 0.3s ease;
          }
          .back-btn:hover {
            opacity: 0.8;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="blog-detail-container">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <div className="brand-section">
            <h1 className="brand-title">ANSONNE</h1>
            <span className="brand-subtitle">Content Review</span>
          </div>
          <div className="header-controls">
            <button onClick={handleBackToList} className="back-button">
              ← Back to List
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-header">
          <div className="title-section">
            <h2>Article Review</h2>
            <p>Review and moderate the submitted content</p>
          </div>
          <div className="content-stats">
            <div className="stat">
              <span className="stat-label">Status</span>
              <span className={`status ${blog.status}`}>{blog.status}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Read Time</span>
              <span className="stat-value">{blog.readTime}</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="article-container">
          <div className="article-header">
            <div className="article-meta">
              <span className="article-date">{blog.date}</span>
              <span className="article-views">{blog.views}</span>
            </div>
            <h1 className="article-title">{blog.title}</h1>
            <p className="article-excerpt">{blog.excerpt}</p>
          </div>

          <div className="article-image">
            <div className="image-placeholder">
              <span>📖</span>
            </div>
          </div>

          <div className="article-content">
            <h3>Full Content</h3>
            <div className="content-text">
              <p>{blog.content}</p>
            </div>
          </div>

          <div className="author-section">
            <h4>Author Information</h4>
            <div className="author-details">
              <div className="author-field">
                <span className="field-label">Name</span>
                <span className="field-value">{blog.author}</span>
              </div>
              <div className="author-field">
                <span className="field-label">Email</span>
                <span className="field-value">{blog.authorEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-section">
          <div className="action-buttons">
            <button onClick={handlePublish} className="action-btn publish-btn">
              Approve & Publish
            </button>
            <button onClick={handleReject} className="action-btn reject-btn">
              Reject & Delete
            </button>
            <button 
              onClick={() => setShowFeedbackBox(true)} 
              className="action-btn feedback-btn"
            >
              Send Feedback
            </button>
          </div>
        </div>
      </main>

      {/* Feedback Modal */}
      {showFeedbackBox && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Send Feedback to Author</h3>
              <button 
                onClick={() => {
                  setShowFeedbackBox(false);
                  setFeedbackMessage('');
                }} 
                className="modal-close"
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="recipient-info">
                <span className="info-label">Author:</span>
                <span className="info-value">{blog.author}</span>
              </div>
              <div className="recipient-info">
                <span className="info-label">Email:</span>
                <span className="info-value">{blog.authorEmail}</span>
              </div>
              
              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Provide constructive feedback about what needs to be improved or changed in this article..."
                rows={6}
                className="feedback-textarea"
              />
            </div>
            
            <div className="modal-actions">
              <button 
                onClick={() => {
                  setShowFeedbackBox(false);
                  setFeedbackMessage('');
                }} 
                className="modal-btn cancel-btn"
              >
                Cancel
              </button>
              <button
  onClick={handleSendFeedback}
  disabled={!feedbackMessage.trim()}
  className="action-btn feedback-btn"
>
  Send Feedback
</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .blog-detail-container {
          min-height: 100vh;
          background: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #000;
        }

        .admin-header {
          background: #ffffff;
          border-bottom: 1px solid #f0f0f0;
          padding: 30px 0;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand-title {
          font-size: 1.8rem;
          font-weight: 300;
          letter-spacing: 3px;
          margin: 0 0 4px 0;
          color: #000;
        }

        .brand-subtitle {
          font-size: 0.75rem;
          color: #666;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .back-button {
          background: #000;
          color: white;
          border: none;
          padding: 8px 20px;
          font-size: 0.8rem;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }

        .back-button:hover {
          opacity: 0.8;
        }

        .main-content {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f0f0f0;
        }

        .title-section h2 {
          font-size: 1.8rem;
          font-weight: 300;
          color: #000;
          margin: 0 0 8px 0;
          letter-spacing: 1px;
        }

        .title-section p {
          color: #666;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
          margin: 0;
        }

        .content-stats {
          display: flex;
          gap: 30px;
        }

        .stat {
          text-align: right;
        }

        .stat-label {
          display: block;
          font-size: 0.7rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .stat-value, .status {
          font-size: 0.9rem;
          font-weight: 500;
          color: #000;
        }

        .status.published {
          color: #10b981;
        }

        .status.draft {
          color: #f59e0b;
        }

        .article-container {
          background: #ffffff;
          border: 1px solid #f0f0f0;
          margin-bottom: 30px;
        }

        .article-header {
          padding: 40px;
          border-bottom: 1px solid #f0f0f0;
        }

        .article-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          font-size: 0.8rem;
          color: #666;
        }

        .article-title {
          font-size: 2rem;
          font-weight: 300;
          color: #000;
          margin: 0 0 20px 0;
          line-height: 1.3;
          letter-spacing: -0.5px;
        }

        .article-excerpt {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.6;
          margin: 0;
          font-style: italic;
          border-left: 2px solid #f0f0f0;
          padding-left: 20px;
        }

        .article-image {
          padding: 40px;
          background: #f8f8f8;
          border-bottom: 1px solid #f0f0f0;
        }

        .image-placeholder {
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f0f0;
          font-size: 3rem;
        }

        .article-content {
          padding: 40px;
          border-bottom: 1px solid #f0f0f0;
        }

        .article-content h3 {
          font-size: 1.2rem;
          font-weight: 500;
          color: #000;
          margin: 0 0 20px 0;
          letter-spacing: 0.5px;
        }

        .content-text {
          line-height: 1.7;
          color: #333;
          font-size: 0.95rem;
        }

        .author-section {
          padding: 40px;
        }

        .author-section h4 {
          font-size: 1rem;
          font-weight: 500;
          color: #000;
          margin: 0 0 20px 0;
          letter-spacing: 0.5px;
        }

        .author-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .author-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .field-label {
          font-size: 0.75rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .field-value {
          font-size: 0.9rem;
          color: #000;
          font-weight: 500;
        }

        .action-section {
          background: #ffffff;
          border: 1px solid #f0f0f0;
          padding: 30px 40px;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .action-btn {
          padding: 12px 24px;
          border: 1px solid #f0f0f0;
          background: transparent;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.3px;
          min-width: 140px;
        }

        .action-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .publish-btn:hover:not(:disabled) {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }

        .reject-btn:hover:not(:disabled) {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }

        .feedback-btn:hover:not(:disabled) {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-container {
          background: #ffffff;
          width: 100%;
          max-width: 500px;
          border: 1px solid #f0f0f0;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #f0f0f0;
        }

        .modal-header h3 {
          font-size: 1.1rem;
          font-weight: 500;
          color: #000;
          margin: 0;
          letter-spacing: 0.5px;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close:hover {
          color: #000;
        }

        .modal-content {
          padding: 24px;
        }

        .recipient-info {
          display: flex;
          gap: 10px;
          margin-bottom: 8px;
          font-size: 0.85rem;
        }

        .info-label {
          color: #666;
          font-weight: 500;
        }

        .info-value {
          color: #000;
        }

        .feedback-textarea {
          width: 100%;
          padding: 16px;
          border: 1px solid #f0f0f0;
          margin-top: 16px;
          font-family: inherit;
          font-size: 0.9rem;
          resize: vertical;
          min-height: 120px;
          transition: border-color 0.3s ease;
        }

        .feedback-textarea:focus {
          outline: none;
          border-color: #000;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding: 16px 24px 24px;
          border-top: 1px solid #f0f0f0;
        }

        .modal-btn {
          padding: 8px 20px;
          border: 1px solid #f0f0f0;
          background: transparent;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.3px;
          min-width: 80px;
        }

        .cancel-btn:hover {
          background: #f8f8f8;
        }

        .send-btn {
          background: #000;
          color: white;
          border-color: #000;
        }

        .send-btn:hover:not(:disabled) {
          opacity: 0.8;
        }

        .send-btn:disabled {
          background: #ccc;
          border-color: #ccc;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 20px;
          }

          .content-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }

          .content-stats {
            align-self: stretch;
            justify-content: space-between;
          }

          .article-header,
          .article-image,
          .article-content,
          .author-section {
            padding: 30px 20px;
          }

          .article-title {
            font-size: 1.5rem;
          }

          .author-details {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .action-section {
            padding: 20px;
          }

          .action-buttons {
            flex-direction: column;
          }

          .action-btn {
            width: 100%;
          }

          .modal-actions {
            flex-direction: column;
          }

          .modal-btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .header-content {
            padding: 0 20px;
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .article-title {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
}