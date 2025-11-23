import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutSection from "../components/AboutSection";
import CategoryList from "../components/CategoryList";
import TopRestaurants from "../components/TopRestaurants";
import LatestBlogs from "../components/LatestBlogs";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Redirect to search results
      navigate(`/restaurants/all?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <header
        className="hero-section"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80")',
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-center">
          <span className="badge bg-warning text-dark mb-3 animate-up delay-1 text-uppercase fw-bold ls-1 px-3 py-2">
            #1 Booking Platform in Vietnam
          </span>
          <h1 className="display-3 fw-bold mb-4 animate-up delay-1 font-playfair text-white">
            Taste the Soul of <span style={{ color: "#ffb347" }}>Saigon</span>
          </h1>
          <p className="lead mb-5 animate-up delay-2 text-white opacity-90 fs-4">
            Discover hidden gems, book the best tables, and experience culinary excellence.
          </p>

          {/* Search Bar */}
          <div className="animate-up delay-3 d-flex justify-content-center">
            <form
              onSubmit={handleSearch}
              className="d-flex w-100 position-relative"
              style={{ maxWidth: "650px" }}
            >
              <input
                type="text"
                className="form-control hero-search-input"
                placeholder="Search restaurant, cuisine, or district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn hero-search-btn" type="submit">
                Find Table
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* --- STATISTICS STRIP --- */}
      <div
        className="bg-white py-5 shadow position-relative"
        style={{
          zIndex: 10,
          marginTop: "-60px",
          borderRadius: "8px",
          width: "85%",
          margin: "-60px auto 0 auto",
        }}
      >
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-3 stat-card">
              <i className="fa fa-cutlery stat-icon fs-1 text-primary mb-3"></i>
              <h3 className="fw-bold display-6 text-dark">500+</h3>
              <p className="text-muted mb-0 fw-bold text-uppercase small">Restaurants</p>
            </div>
            <div className="col-md-3 stat-card">
              <i className="fa fa-users stat-icon fs-1 text-success mb-3"></i>
              <h3 className="fw-bold display-6 text-dark">10k+</h3>
              <p className="text-muted mb-0 fw-bold text-uppercase small">Happy Diners</p>
            </div>
            <div className="col-md-3 stat-card">
              <i className="fa fa-star stat-icon fs-1 text-warning mb-3"></i>
              <h3 className="fw-bold display-6 text-dark">4.9</h3>
              <p className="text-muted mb-0 fw-bold text-uppercase small">Average Rating</p>
            </div>
            <div className="col-md-3 stat-card">
              <i className="fa fa-check-circle stat-icon fs-1 text-info mb-3"></i>
              <h3 className="fw-bold display-6 text-dark">24/7</h3>
              <p className="text-muted mb-0 fw-bold text-uppercase small">Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-5 mt-5">
        <AboutSection />
      </section>

      {/* --- CATEGORIES SECTION --- */}
      <section id="category" className="py-5 bg-light">
        <div className="container pt-4">
          <div className="text-center mb-5">
            <small className="text-uppercase text-muted fw-bold ls-1">
              Discover
            </small>
            <h2 className="fw-bold display-5 font-playfair mt-2">
              Explore by Category
            </h2>
            <div className="section-title-line"></div>
          </div>
          <CategoryList />
        </div>
      </section>

      {/* --- TOP RESTAURANTS --- */}
      <section id="restaurant" className="py-5">
        <div className="container pt-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5">
            <div className="text-center text-md-start mb-3 mb-md-0">
              <small className="text-uppercase text-muted fw-bold ls-1">
                Top Rated
              </small>
              <h2 className="fw-bold display-5 font-playfair mt-2">
                Popular Restaurants
              </h2>
              <div className="section-title-line ms-md-0 mx-auto"></div>
            </div>
            {/* LINK TO ALL RESTAURANTS */}
            <Link
              to="/restaurants/all"
              className="btn btn-outline-dark rounded-pill px-4 py-2 fw-bold hover-scale"
            >
              View All Restaurants <i className="fa fa-arrow-right ms-2"></i>
            </Link>
          </div>

          <TopRestaurants />
        </div>
      </section>

      {/* --- PARALLAX CTA BANNER --- */}
      <section
        className="cta-banner d-flex align-items-center justify-content-center"
        style={{
          minHeight: "400px",
          backgroundImage:
            'linear-gradient(rgba(178, 116, 76, 0.9), rgba(140, 80, 40, 0.9)), url("https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80")',
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          color: "white"
        }}
      >
        <div className="container text-center">
          <h2 className="fw-bold display-4 mb-4 font-playfair">
            Partner with VinaTable
          </h2>
          <p className="lead mb-5 fs-4 opacity-90">
            Fill your seats and manage bookings effortlessly with our restaurant solutions.
          </p>
          <Link
            to="/admin/create-restaurant"
            className="btn btn-light btn-lg rounded-pill px-5 py-3 fw-bold text-uppercase shadow hover-scale"
            style={{ color: "#b2744c" }}
          >
            List Your Restaurant
          </Link>
        </div>
      </section>

      {/* --- BLOGS SECTION --- */}
      <section id="blogs" className="py-5 bg-light">
        <div className="container pt-4">
          <div className="text-center mb-5">
            <small className="text-uppercase text-muted fw-bold ls-1">
              Inspiration
            </small>
            <h2 className="fw-bold display-5 font-playfair mt-2">
              Latest Stories
            </h2>
            <div className="section-title-line"></div>
          </div>
          {/* LatestBlogs component now handles the "See All" and "Read More" links internally */}
          <LatestBlogs />
        </div>
      </section>

      {/* --- NEWSLETTER SECTION --- */}
      <section className="py-5 bg-white">
        <div className="container text-center py-4">
          <i className="fa fa-paper-plane-o fa-3x text-warning mb-3"></i>
          <h2 className="fw-bold mb-3 display-6 font-playfair">Subscribe to our Newsletter</h2>
          <p className="text-muted mb-4 fs-5">
            Get the latest updates, promotions, and culinary news delivered to
            your inbox.
          </p>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="input-group mb-3 shadow-sm">
                <input
                  type="email"
                  className="form-control form-control-lg border-0 bg-light"
                  placeholder="Enter your email address"
                  style={{height: '60px'}}
                />
                <button className="btn btn-dark px-5 fw-bold" type="button" style={{backgroundColor: '#2a2b38'}}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;