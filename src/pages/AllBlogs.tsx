/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchArticlesData } from "../lib/utils";

// Helper function to calculate read time
const calculateReadTime = (content: string): string => {
  if (!content) return "1 min read";

  // Split by regex \s+ to handle spaces, tabs, and newlines
  const words = content.trim().split(/\s+/).length;
  const wordsPerMinute = 200; // Average reading speed
  const minutes = Math.ceil(words / wordsPerMinute);

  return `${minutes} min read`;
};

const Blogs: React.FC = () => {
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchArticlesData();

      if (data) {
        setAllArticles(data);
      }

      setLoading(false);
    };
    loadData();
  }, []);

  // --- Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArticles = allArticles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allArticles.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      <div
        className="py-5 text-center text-white mb-4"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1920&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="container">
          <h1 className="display-4 fw-bold">Our Blogs</h1>
          <p className="lead">
            Stories, guides, and news from the food world of Saigon.
          </p>
        </div>
      </div>

      <div className="container mb-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {currentArticles.length > 0 ? (
                currentArticles.map((article, index) => (
                  <div
                    className="col-md-6 col-lg-4"
                    key={article.articleId || index}
                  >
                    <div
                      className="card h-100 border-0 shadow-sm hover-scale"
                      style={{ transition: "transform 0.3s" }}
                    >
                      <div
                        style={{
                          overflow: "hidden",
                          borderTopLeftRadius: "0.375rem",
                          borderTopRightRadius: "0.375rem",
                        }}
                      >
                        <img
                          src={article.image}
                          className="card-img-top"
                          alt={article.title}
                          style={{
                            height: "220px",
                            objectFit: "cover",
                            transition: "transform 0.5s",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.transform = "scale(1.1)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        />
                      </div>
                      <div className="card-body d-flex flex-column p-4">
                        <div className="mb-2 d-flex align-items-center flex-wrap">
                          <span className="badge bg-light text-dark border me-2">
                            {article.category || "General"}
                          </span>

                          {/* Date */}
                          <small className="text-muted">{article.date}</small>

                          {/* Bullet Separator */}
                          <span className="text-muted mx-2">•</span>

                          {/* Read Time Calculation Display */}
                          <small className="text-muted">
                            <i className="fa fa-clock-o me-1"></i>
                            {article.readTime}
                          </small>
                        </div>

                        <h4 className="card-title fw-bold mb-3">
                          <Link
                            to={`/article/${article.articleId}`}
                            className="text-decoration-none text-dark"
                          >
                            {article.title}
                          </Link>
                        </h4>
                        <p
                          className="card-text text-muted flex-grow-1"
                          style={{ fontSize: "0.95rem", lineHeight: "1.6" }}
                        >
                          {article.content && article.content.length > 120
                            ? `${article.content.substring(0, 120)}...`
                            : article.content}
                        </p>
                        <div className="mt-3 pt-3 border-top">
                          <Link
                            to={`/blog/${article.articleId}`}
                            className="fw-bold text-decoration-none"
                            style={{ color: "#b2744c" }}
                          >
                            Read More <i className="fa fa-arrow-right ms-1"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center text-muted">
                  <p>No articles found.</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-5">
                <nav aria-label="Page navigation">
                  <ul className="pagination">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (number) => (
                        <li
                          key={number}
                          className={`page-item ${
                            currentPage === number ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(number)}
                            style={
                              currentPage === number
                                ? {
                                    backgroundColor: "#b2744c",
                                    borderColor: "#b2744c",
                                    color: "white",
                                  }
                                : { color: "#333" }
                            }
                          >
                            {number}
                          </button>
                        </li>
                      )
                    )}

                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link text-dark"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Blogs;
