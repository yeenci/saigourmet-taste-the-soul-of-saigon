import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="mb-4">
                <i
                  className="fa fa-cutlery fa-5x text-muted opacity-25"
                  style={{ fontSize: "8rem" }}
                ></i>
              </div>

              <h1
                className="display-1 fw-bold font-playfair mb-2"
                style={{ color: "#b2744c", fontSize: "6rem" }}
              >
                404
              </h1>

              <h2 className="fw-bold mb-3">Table Not Found</h2>
              <p className="lead text-muted mb-5">
                Oops! It looks like the page you are looking for has been moved
                or doesn't exist. Let's get you back to booking delicious meals.
              </p>

              <div className="d-flex justify-content-center gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-outline-dark rounded-pill px-4 py-2 fw-bold"
                >
                  <i className="fa fa-arrow-left me-2"></i> Go Back
                </button>

                <Link
                  to="/"
                  className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm"
                  style={{ backgroundColor: "#b2744c", borderColor: "#b2744c" }}
                >
                  Return Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
