'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Blog = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  status: 'published' | 'draft';
  readTime: string;
  views: string;
};

function BlogCard({ blog, index }: { blog: Blog; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const handleClick = () => router.push(`/blogs/${blog.id}`);

  return (
    <div
      className={`blog-card ${isVisible ? 'visible' : ''} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="image-container">
        {blog.image ? (
          <img src={blog.image} alt={blog.title} className="blog-image" />
        ) : (
          <div className="image-placeholder">📖</div>
        )}
        <div className="status-indicator">
          <span className={`status ${blog.status}`}>{blog.status}</span>
        </div>
        <div className="hover-overlay">
          <span className="read-more">Read Article →</span>
        </div>
      </div>

      <div className="content-container">
        <div className="meta-info">
          <span className="date">{blog.date}</span>
          <span className="dot">•</span>
          <span className="read-time">{blog.readTime}</span>
        </div>
        <h3 className="title">{blog.title}</h3>
        <p className="excerpt">{blog.excerpt}</p>
        <div className="footer">
          <span className="views">{blog.views} views</span>
          <div className="action-indicator">
            <div className="arrow">→</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .blog-card {
          background: #ffffff;
          border: 1px solid #f0f0f0;
          border-radius: 2px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          opacity: 0;
          transform: translateY(20px);
          position: relative;
        }
        .blog-card.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .blog-card.hovered {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          border-color: #e0e0e0;
        }
        .image-container {
          position: relative;
          height: 240px;
          overflow: hidden;
          background: #f8f8f8;
        }
        .blog-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
          font-size: 2.5rem;
          transition: transform 0.6s ease;
        }
        .blog-card.hovered .blog-image,
        .blog-card.hovered .image-placeholder {
          transform: scale(1.05);
        }
        .status-indicator {
          position: absolute;
          top: 12px;
          right: 12px;
        }
        .status {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
        }
        .status.published { background: #000; }
        .status.draft { background: #666; }
        .hover-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .blog-card.hovered .hover-overlay { opacity: 1; }
        .read-more {
          color: white;
          font-weight: 500;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
        }
        .content-container { padding: 24px; }
        .meta-info { display: flex; align-items: center; margin-bottom: 12px; font-size: 0.75rem; color: #666; letter-spacing: 0.3px; }
        .dot { margin: 0 8px; }
        .title { font-size: 1.1rem; font-weight: 400; color: #000; margin: 0 0 12px 0; line-height: 1.4; letter-spacing: -0.2px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .excerpt { color: #666; line-height: 1.5; margin: 0 0 20px 0; font-size: 0.85rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #f0f0f0; }
        .views { font-size: 0.75rem; color: #999; font-weight: 500; }
        .action-indicator { opacity: 0; transform: translateX(-5px); transition: all 0.3s ease; }
        .blog-card.hovered .action-indicator { opacity: 1; transform: translateX(0); }
        .arrow { font-size: 1rem; color: #000; font-weight: 300; }
        @media (max-width: 768px) {
          .content-container { padding: 20px; }
          .title { font-size: 1rem; }
        }
      `}</style>
    </div>
  );
}

export default function ListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const blogsPerPage = 6;
  const router = useRouter();

  const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yourdomain.com',
    ENDPOINTS: { BLOGS: '/api/blogs', AUTH: '/api/auth/verify' },
    HEADERS: { 'Content-Type': 'application/json' }
  };

  const fetchBlogs = async () => {
    setIsFetching(true);
    try {
      const res = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.BLOGS, {
        credentials: 'include',
        headers: API_CONFIG.HEADERS
      });
      if (!res.ok) throw new Error('Failed to fetch blogs');
      const data: Blog[] = await res.json();
      setBlogs(data);
      setFilteredBlogs(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load blogs. Please try again.');
      setBlogs([]);
      setFilteredBlogs([]);
    } finally {
      setIsFetching(false);
      setIsLoading(false);
    }
  };

  const verifyAuth = async (): Promise<boolean> => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) return false;
      const res = await fetch('/api/auth/verify', { headers: { Authorization: `Bearer ${authToken}` } });
      if (!res.ok) return false;
      const data = await res.json();
      return data.valid;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const init = async () => {
      const authValid = await verifyAuth();
      if (!authValid) {
        setIsAuthenticated(false);
        router.push('/login');
      } else {
        setIsAuthenticated(true);
        await fetchBlogs();
      }
    };
    init();
  }, [router]);

  useEffect(() => {
    if (!searchTerm) return setFilteredBlogs(blogs);
    setFilteredBlogs(
      blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.status.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setCurrentPage(1);
  }, [searchTerm, blogs]);

  const handleLogout = async () => {
    try {
      await fetch(API_CONFIG.BASE_URL + '/api/auth/logout', { method: 'POST', credentials: 'include', headers: API_CONFIG.HEADERS });
      toast.success('Logged out successfully');
      router.push('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handlePageChange = (page: number) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
    else {
      if (currentPage <= 3) { for (let i = 1; i <= 4; i++) pages.push(i); pages.push('...'); pages.push(totalPages); }
      else if (currentPage >= totalPages - 2) { pages.push(1); pages.push('...'); for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i); }
      else { pages.push(1); pages.push('...'); for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i); pages.push('...'); pages.push(totalPages); }
    }
    return pages;
  };

  if (isLoading) return <div>Loading...</div>;
  if (isAuthenticated === false) return null;

  const handleRefresh = () => fetchBlogs();

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <div className="brand-section">
            <h1 className="brand-title">ANSONNE</h1>
            <span className="brand-subtitle">Blog & Journal</span>
          </div>
          <div className="header-controls">
            <div className="search-container">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">⌕</span>
              </div>
            </div>
            <div className="control-buttons">
              <button onClick={handleRefresh} className="refresh-btn" disabled={isFetching}>{isFetching ? 'Refreshing...' : 'Refresh'}</button>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat">
            <span className="stat-number">{blogs.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-number">{blogs.filter(b => b.status === 'published').length}</span>
            <span className="stat-label">Published</span>
          </div>
          <div className="stat">
            <span className="stat-number">{blogs.filter(b => b.status === 'draft').length}</span>
            <span className="stat-label">Drafts</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-header">
          <h2>Latest Articles</h2>
          <p>Curated insights and research</p>
          {isFetching && (<div className="fetching-indicator"><span>Updating content...</span></div>)}
        </div>
        <div className="blogs-grid">{currentBlogs.map((blog, index) => <BlogCard key={blog.id} blog={blog} index={index} />)}</div>
        {filteredBlogs.length === 0 && !isFetching && (
          <div className="no-results">
            <div className="no-results-icon">✕</div>
            <h3>No articles found</h3>
            <p>{searchTerm ? 'Try different search terms' : 'No articles available'}</p>
          </div>
        )}
      </main>

      {/* Pagination */}
      {totalPages > 1 && filteredBlogs.length > 0 && (
        <footer className="pagination-footer">
          <div className="pagination-container">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="pagination-btn prev">← Previous</button>
            <div className="page-numbers">
              {getPageNumbers().map((page, index) => page === '...' ? <span key={`ellipsis-${index}`} className="ellipsis">...</span> :
                <button key={page} onClick={() => handlePageChange(Number(page))} className={`page-btn ${currentPage === page ? 'active' : ''}`}>{page}</button>
              )}
            </div>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-btn next">Next →</button>
          </div>
          <div className="pagination-info">
            Showing {indexOfFirstBlog + 1}-{Math.min(indexOfLastBlog, filteredBlogs.length)} of {filteredBlogs.length} posts
          </div>
        </footer>
      )}

      <style jsx>{`
        .admin-container {
          min-height: 100vh;
          background: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #000;
        }

        .admin-header {
          background: #ffffff;
          border-bottom: 1px solid #f0f0f0;
          padding: 40px 0 20px;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
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

        .header-controls {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .search-bar {
          position: relative;
          background: #f8f8f8;
          border-radius: 0;
          padding: 8px 16px;
          border: 1px solid #f0f0f0;
          transition: all 0.3s ease;
        }

        .search-bar:focus-within {
          border-color: #000;
          background: #ffffff;
        }

        .search-input {
          border: none;
          background: transparent;
          outline: none;
          width: 200px;
          font-size: 0.85rem;
          padding-right: 25px;
          color: #000;
        }

        .search-input::placeholder {
          color: #999;
        }

        .search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
          font-size: 0.9rem;
        }

        .control-buttons {
          display: flex;
          gap: 10px;
        }

        .refresh-btn, .logout-btn {
          background: #000;
          color: white;
          border: none;
          padding: 8px 20px;
          font-size: 0.8rem;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }

        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .refresh-btn:hover:not(:disabled),
        .logout-btn:hover {
          opacity: 0.8;
        }

        .header-stats {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          gap: 40px;
        }

        .stat {
          text-align: left;
        }

        .stat-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 300;
          color: #000;
          margin-bottom: 2px;
        }

        .stat-label {
          font-size: 0.7rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 40px;
        }

        .content-header {
          text-align: center;
          margin-bottom: 50px;
          position: relative;
        }

        .fetching-indicator {
          position: absolute;
          top: 0;
          right: 0;
          background: #f8f8f8;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          color: #666;
        }

        .content-header h2 {
          font-size: 1.8rem;
          font-weight: 300;
          color: #000;
          margin: 0 0 8px 0;
          letter-spacing: 1px;
        }

        .content-header p {
          color: #666;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
        }

        .blogs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 30px;
          margin-bottom: 60px;
        }

        .no-results {
          text-align: center;
          padding: 80px 40px;
          background: #f8f8f8;
        }

        .no-results-icon {
          font-size: 2rem;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .no-results h3 {
          color: #000;
          margin: 0 0 8px 0;
          font-weight: 400;
          font-size: 1.1rem;
        }

        .no-results p {
          color: #666;
          margin: 0;
          font-size: 0.9rem;
        }

        .pagination-footer {
          background: #ffffff;
          border-top: 1px solid #f0f0f0;
          padding: 40px 0;
        }

        .pagination-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .pagination-btn {
          padding: 8px 16px;
          background: transparent;
          color: #000;
          border: 1px solid #f0f0f0;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
        }

        .pagination-btn:hover:not(:disabled) {
          border-color: #000;
          background: #000;
          color: white;
        }

        .pagination-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .page-numbers {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .page-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #f0f0f0;
          background: transparent;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .page-btn:hover {
          border-color: #000;
        }

        .page-btn.active {
          background: #000;
          color: white;
          border-color: #000;
        }

        .ellipsis {
          padding: 0 8px;
          color: #999;
          font-size: 0.8rem;
        }

        .pagination-info {
          text-align: center;
          color: #666;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 20px;
            text-align: center;
            padding: 0 20px;
          }

          .header-controls {
            width: 100%;
            justify-content: center;
            flex-direction: column;
            gap: 15px;
          }

          .control-buttons {
            width: 100%;
            justify-content: center;
          }

          .search-input {
            width: 100%;
          }

          .header-stats {
            padding: 0 20px;
            justify-content: center;
          }

          .main-content {
            padding: 40px 20px;
          }

          .blogs-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .pagination-container {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}