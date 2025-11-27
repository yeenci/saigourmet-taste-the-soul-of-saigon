/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Helper function to calculate read time
const calculateReadTime = (content: string): string => {
  if (!content) return "1 min read";
  const words = content.trim().split(/\s+/).length;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleData = async () => {
      setLoading(true);

      // 1. Try to find the article in Session Storage first
      const cachedData = sessionStorage.getItem("articlesData");
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          if (Array.isArray(parsedData)) {
            const foundArticle = parsedData.find(
              (item: any) =>
                String(item.articleId) === String(id) ||
                String(item.id) === String(id)
            );

            if (foundArticle) {
              const readTime =
                foundArticle.readTime ||
                calculateReadTime(foundArticle.content);
              setArticle({ ...foundArticle, readTime });
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.error("Error parsing cache:", e);
        }
      }

      // 2. API Fallback
      const apiUrl = import.meta.env.VITE_API_URL || "/api";
      try {
        const response = await fetch(`${apiUrl}/article/`);
        const result = await response.json();
        const dataArray = Array.isArray(result) ? result : result.data;

        if (Array.isArray(dataArray)) {
          const foundItem = dataArray.find(
            (item: any) =>
              String(item.id) === String(id) ||
              String(item.articleId) === String(id)
          );

          if (foundItem) {
            setArticle({
              articleId: foundItem.id || foundItem.articleId,
              title: foundItem.title,
              image: foundItem.image,
              content: foundItem.content,
              date: foundItem.date,
              category: foundItem.category,
              readTime: calculateReadTime(foundItem.content),
            });
          } else {
            setArticle(null);
          }
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArticleData();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-warning"></div>
      </div>
    );

  if (!article) {
    return (
      <div className="text-center mt-5 container">
        <h2>Article Not Found</h2>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/blogs")}
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-white">
      <style>{`
        .custom-link {
          text-decoration: none;
          font-weight: 400;  /* Regular weight */
          color: #6c757d;    /* Bootstrap text-muted color */
          transition: color 0.2s;
        }
        .custom-link:hover {
          text-decoration: underline; /* Underline on hover */
          color: #000; /* Darken color on hover */
        }
      `}</style>

      <Navbar />

      <div
        className="position-relative w-100"
        style={{
          height: "50vh",
          maxHeight: "500px",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${article.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container h-100 d-flex flex-column justify-content-end pb-5">
          <span className="badge bg-warning text-dark mb-2 align-self-start">
            {article.category || "Food Guide"}
          </span>
          <h1 className="display-4 text-white fw-bold">{article.title}</h1>
          <div className="text-white opacity-75 mt-2">
            <i className="fa fa-user me-2"></i> By SaiGourmet Team &bull;{" "}
            <i className="fa fa-calendar ms-2 me-2"></i>{" "}
            {article.date || "Nov 24, 2025"} &bull;{" "}
            <i className="fa fa-clock-o ms-2 me-2"></i> {article.readTime}
          </div>
        </div>
      </div>

      <div className="container py-5" style={{ maxWidth: "800px" }}>
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="custom-link">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/blogs" className="custom-link">
                Blogs
              </Link>
            </li>
            <li className="breadcrumb-item active fw-bold" aria-current="page">
              {article.title}
            </li>
          </ol>
        </nav>

        <article className="blog-post">
          {article.content &&
            article.content.split("\n").map(
              (paragraph: string, index: number) =>
                paragraph.trim() !== "" && (
                  <p
                    key={index}
                    className="fs-5 mb-4 text-secondary"
                    style={{ lineHeight: "1.8", textAlign: "justify" }}
                  >
                    {paragraph}
                  </p>
                )
            )}
        </article>

        <hr className="my-5" />

        <div className="d-flex justify-content-between align-items-center bg-light p-4 rounded">
          <div>
            <h5 className="fw-bold mb-1">Share this article</h5>
            <p className="text-muted mb-0 small">Spread the love for food.</p>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary btn-sm rounded-circle"
              style={{ width: "40px", height: "40px" }}
            >
              <i className="fa fa-facebook"></i>
            </button>
            <button
              className="btn btn-outline-info btn-sm rounded-circle"
              style={{ width: "40px", height: "40px" }}
            >
              <i className="fa fa-twitter"></i>
            </button>
            <button
              className="btn btn-outline-danger btn-sm rounded-circle"
              style={{ width: "40px", height: "40px" }}
            >
              <i className="fa fa-pinterest"></i>
            </button>
          </div>
        </div>

        <div className="mt-5 text-center">
          <Link
            to="/blogs"
            className="btn btn-outline-dark rounded-pill px-5 py-2 fw-bold"
          >
            <i className="fa fa-arrow-left me-2"></i> Back to All Blogs
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ArticleDetail;
