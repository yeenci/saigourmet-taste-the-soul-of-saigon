import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Article } from "../lib/types";

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock Data Store (Ideally this comes from a shared context or API)
    const mockArticles: Article[] = [
      {
        articleId: 101,
        title: "Top 5 Hidden Coffee Spots in D1",
        image:
          "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1200&q=80",
        content: `District 1 is known for its high-energy vibe, but tucked away in old apartment blocks are some of the city's best-kept coffee secrets. 

                1. The Loft Cafe: Located on the 3rd floor of an art deco building, this spot offers a rustic industrial vibe. The coconut coffee here is a must-try.

                2. Mockingbird Cafe: A cozy, dimly lit space perfect for reading. Their egg coffee rivals the best in Hanoi.

                3. Whispering Bean: Hidden down a narrow alley, this silence-focused cafe is perfect for digital nomads.

                Exploring these spots gives you a glimpse into the "Slow Living" movement growing within the chaotic heart of Saigon.`,
      },
      {
        articleId: 102,
        title: "A Guide to Saigon Street Food",
        image:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
        content: `Vietnam's street food culture is legendary. It is not just about eating; it is a social event. 
                
                Start your morning with a steaming bowl of Pho Bo (Beef Noodle Soup) from a street-side vendor. Look for the pots simmering over charcoal fires.
                
                For lunch, grab a Com Tam (Broken Rice) with grilled pork chop. The key is the fish sauce dressing (Nuoc Mam) - sweet, savory, and spicy.
                
                As the sun sets, the sidewalks fill with plastic stools. It's time for Oc (Snails) and shellfish, washed down with a cold local beer.
                
                This guide will take you through the culinary map of Saigon, district by district.`,
      },
      {
        articleId: 103,
        title: "Best Rooftop Bars for Sunset",
        image:
          "https://plus.unsplash.com/premium_photo-1736238795669-d8a908d893fa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        content:
          "Catch the golden hour at these spectacular rooftop venues overlooking the skyline. Perfect for romantic dates or chilling with friends...",
      },
      {
        articleId: 104,
        title: "Vegetarian Delights in Thao Dien",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
        content:
          "Healthy eating is easier than ever. Check out these top-rated vegetarian and vegan restaurants in the expat hub of District 2...",
      },
      {
        articleId: 105,
        title: "The History of Banh Mi",
        image:
          "https://images.unsplash.com/photo-1541544537156-21c2d906f0d7?auto=format&fit=crop&w=1200&q=80",
        content:
          "How a French baguette became a Vietnamese icon. We dive deep into the history and variations of the world-famous Banh Mi...",
      },
      {
        articleId: 106,
        title: "Late Night Eats: Where to go?",
        image:
          "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80",
        content:
          "Hungry after midnight? Saigon never sleeps. Here is a curated list of places serving delicious hot food 24/7...",
      },
    ];

    // Simulate Fetching
    setTimeout(() => {
      const found = mockArticles.find((a) => a.articleId === Number(id));
      setArticle(found || null);
      setLoading(false);
    }, 300);
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-warning"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center mt-5">
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
          <span className="badge bg-warning text-dark mb-2 align-self-start">
            Featured Story
          </span>
          <h1 className="display-4 text-white fw-bold">{article.title}</h1>
          <div className="text-white opacity-75 mt-2">
            <i className="fa fa-user me-2"></i> By SaiGourmet Team &bull;{" "}
            <i className="fa fa-calendar ms-2 me-2"></i> Nov 24, 2025
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
          {article.content.split("\n").map((paragraph, index) => (
            <p
              key={index}
              className="fs-5 mb-4 text-secondary"
              style={{ lineHeight: "1.8" }}
            >
              {paragraph}
            </p>
          ))}
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
