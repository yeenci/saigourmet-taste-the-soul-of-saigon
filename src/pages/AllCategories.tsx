import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryList from "../components/CategoryList";

const AllCategories: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      {/* Header */}
      <div
        className="text-center text-white d-flex align-items-center justify-content-center"
        style={{
          height: "300px",
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div>
          <span className="badge bg-warning text-dark mb-2 text-uppercase fw-bold ls-1">
            Discover
          </span>
          <h1 className="display-3 fw-bold font-playfair">All Categories</h1>
          <p className="lead opacity-90">
            Find the perfect atmosphere for your next meal
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-5">
        <div className="row justify-content-center mb-5">
          <div className="col-md-8 text-center">
            <p className="text-muted fs-5">
              Whether you're looking for a quiet cafe to work in, a lively club
              for the weekend, or a romantic fine dining experience, we have
              curated the best spots in Saigon for you.
            </p>
          </div>
        </div>

        {/* Reusing the Component */}
        <CategoryList />
      </div>

      <Footer />
    </div>
  );
};

export default AllCategories;
