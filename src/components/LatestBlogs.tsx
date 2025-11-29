/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Article } from "../lib/types";
import { fetchArticlesData } from "../lib/utils";

const LatestBlogs: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const data = await fetchArticlesData();

      if (data) {
        const sortedLatest = [...data]
          .sort((a, b) => {
            // Robust date parsing
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 3);

        setArticles(sortedLatest);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {articles.map((article) => (
        <div className="col-md-4" key={article.articleId}>
          <div
            className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden position-relative"
            style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 0.125rem 0.25rem rgba(0,0,0,0.075)";
            }}
          >
            {/* Image Wrapper */}
            <div
              className="position-relative overflow-hidden"
              style={{ height: "220px" }}
            >
              <img
                src={article.image}
                className="w-100 h-100 object-fit-cover"
                alt={article.title}
                style={{ transition: "transform 0.6s ease" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1.0)")
                }
              />
              {/* Category Badge */}
              <span
                className="position-absolute top-0 start-0 m-3 badge bg-white text-dark shadow-sm text-uppercase fw-bold ls-1"
                style={{ fontSize: "0.7rem" }}
              >
                {article.category}
              </span>
            </div>

            {/* Card Content */}
            <div className="card-body d-flex flex-column p-4">
              {/* Meta Data */}
              <div className="d-flex justify-content-between align-items-center mb-2 text-muted small">
                <span>
                  <i className="fa fa-calendar me-1"></i> {article.date}
                </span>
                <span>
                  <i className="fa fa-clock-o me-1"></i> {article.readTime}
                </span>
              </div>

              <h5
                className="card-title fw-bold mb-3 font-playfair"
                style={{ fontSize: "1.35rem", lineHeight: "1.4" }}
              >
                {article.title}
              </h5>

              <p className="card-text text-muted flex-grow-1 small">
                {article.content.length > 90
                  ? `${article.content.substring(0, 90)}...`
                  : article.content}
              </p>

              <div className="mt-4 pt-3 border-top">
                <Link
                  to={`/article/${article.articleId}`}
                  className="btn btn-link text-decoration-none p-0 fw-bold d-flex align-items-center"
                  style={{ color: "#b2744c" }}
                >
                  Read Full Story
                  <i className="fa fa-long-arrow-right ms-2 transition-transform"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* See All Button */}
      <div className="text-center mt-5">
        <Link
          to="/blogs"
          className="btn btn-lg rounded-pill px-5 py-3 fw-bold shadow-sm"
          style={{
            backgroundColor: "#b2744c",
            borderColor: "#b2744c",
            color: "white",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#9a6340";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#b2744c";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          See All Stories <i className="fa fa-arrow-right ms-2"></i>
        </Link>
      </div>
    </div>
  );
};

export default LatestBlogs;
