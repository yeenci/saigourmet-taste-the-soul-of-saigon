import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutSection from "../components/AboutSection";
import CategoryList from "../components/CategoryList";
import TopRestaurants from "../components/TopRestaurants";
import LatestBlogs from "../components/LatestBlogs";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="all-content">
      <Navbar />

      {/* Hero Section */}
      <section
        id="home"
        className="d-flex align-items-center justify-content-center text-center"
        style={{
          height: "80vh",
          background:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
        }}
      >
        <div className="container">
          <h1 className="display-3 fw-bold mb-3">
            <span style={{ color: "#fff" }}>Booking</span> the restaurant <br />{" "}
            you want
          </h1>
          <p className="lead mb-4">
            Our service is the best option. For you and for everyone.
          </p>
          <a
            href="#restaurant"
            className="btn btn-lg btn-outline-light rounded-pill px-5 fw-bold"
          >
            Booking Now
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-light">
        <AboutSection />
      </section>

      {/* Categories Section */}
      <section id="category" className="py-5">
        <div className="container">
          <h2 className="text-center mb-2 fw-bold" style={{ color: "#333" }}>
            Categories
          </h2>
          <p className="text-center text-muted mb-4">
            Explore by cuisine and atmosphere
          </p>
          <CategoryList />
        </div>
      </section>

      {/* Top Restaurants Section */}
      <section id="restaurant" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold" style={{ color: "#333" }}>
            Top 3 Restaurants
          </h2>
          <TopRestaurants />
          <div className="text-center mt-4">
            <Link
              to="/restaurants/all"
              className="btn btn-outline-dark rounded-pill px-4"
            >
              View All Restaurants
            </Link>
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section id="blogs" className="py-5">
        <h2 className="text-center mb-5 fw-bold" style={{ color: "#333" }}>
          Latest <span style={{ color: "#b2744c" }}>Blogs</span>
        </h2>
        <LatestBlogs />
      </section>

      <Footer />
    </div>
  );
};

export default Home;
