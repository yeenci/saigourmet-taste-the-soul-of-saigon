/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Article } from "../lib/types";

const LatestBlogs: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const mockArticles: Article[] = [
      {
        articleId: "101",
        title: "Top 5 Hidden Coffee Spots in D1",
        image:
          "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80",
        content:
          "Discover the quiet corners of Saigon's bustling District 1 where coffee culture thrives...",
        date: "Nov 20, 2025",
        category: "Guide",
      },
      {
        articleId: "102",
        title: "A Guide to Saigon Street Food",
        image:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
        content:
          "From Banh Mi to Pho, explore the culinary heritage of Vietnam through its streets...",
        date: "Nov 18, 2025",
        category: "Food Culture",
        readTime: "8 min read",
      },
      {
        articleId: "103",
        title: "Best Rooftop Bars for Sunset",
        image:
          "https://plus.unsplash.com/premium_photo-1736238795669-d8a908d893fa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        content:
          "Catch the golden hour at these spectacular rooftop venues overlooking the skyline...",
        date: "Nov 15, 2025",
        category: "Nightlife",
        readTime: "6 min read",
      },
    ];
    setArticles(mockArticles);
  }, []);

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
              <span className="position-absolute top-0 start-0 m-3 badge bg-white text-dark shadow-sm text-uppercase fw-bold ls-1" style={{fontSize: '0.7rem'}}>
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