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
  // Using 'any' for initial state to handle the extra 'readTime' field flexible
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
            // Find article by matching ID (handle string vs number comparison)
            const foundArticle = parsedData.find(
              (item: any) =>
                String(item.articleId) === String(id) ||
                String(item.id) === String(id)
            );

            if (foundArticle) {
              console.log("Article found in cache");
              // Ensure readTime is present (in case cache is old)
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

      // 2. API Fallback (if not in cache or direct link access)
      const apiUrl = import.meta.env.VITE_API_URL || "/api";
      try {
        console.log("Fetching from API...");
        // We fetch the list to ensure consistent data structure mapping
        // (Or you could fetch `${apiUrl}/blog/${id}` if your API supports it directly)
        const response = await fetch(`${apiUrl}/blog/`);
        const result = await response.json();

        const dataArray = Array.isArray(result) ? result : result.data;

        if (Array.isArray(dataArray)) {
          const foundItem = dataArray.find(
            (item: any) =>
              String(item.id) === String(id) ||
              String(item.articleId) === String(id)
          );

          if (foundItem) {
            // Map fields to ensure consistency
            const normalizedArticle = {
              articleId: foundItem.id || foundItem.articleId,
              title: foundItem.title,
              image: foundItem.image,
              content: foundItem.content,
              date: foundItem.date,
              category: foundItem.category,
              readTime: calculateReadTime(foundItem.content),
            };
            setArticle(normalizedArticle);
          } else {
            setArticle(null); // Not found
          }
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticleData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="flex-grow-1 container text-center d-flex flex-column justify-content-center">
          <h2 className="display-6 fw-bold">Article Not Found</h2>
          <p className="text-muted">
            The story you are looking for does not exist or has been moved.
          </p>
          <div>
            <button
              className="btn btn-primary mt-3 px-4 py-2"
              onClick={() => navigate("/blogs")}
            >
              Back to Blogs
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-white">
      <Navbar />

      {/* Hero Image Section */}
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
          <span className="badge bg-warning text-dark mb-2 align-self-start fs-6">
            {article.category || "Food Guide"}
          </span>
          <h1 className="display-4 text-white fw-bold">{article.title}</h1>
          <div className="text-white opacity-75 mt-2 d-flex align-items-center flex-wrap">
            <i className="fa fa-user me-2"></i> By SaiGourmet Team
            <span className="mx-2">&bull;</span>
            <i className="fa fa-calendar me-2"></i>{" "}
            {article.date || "Nov 24, 2025"}
            <span className="mx-2">&bull;</span>
            <i className="fa fa-clock-o me-2"></i> {article.readTime}
          </div>
        </div>
      </div>

      <div className="container py-5" style={{ maxWidth: "800px" }}>
        {/* Navigation Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/blogs" className="text-decoration-none text-muted">
                Blogs
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {article.title}
            </li>
          </ol>
        </nav>

        {/* Article Content */}
        <article className="blog-post">
          {/* Render paragraphs nicely by splitting newlines */}
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

        {/* Author / Share Section */}
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
