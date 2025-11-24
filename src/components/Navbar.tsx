import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  // Mock user state
  const user = null;
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? "text-white fw-bold" : "";

  return (
    <nav className="navbar navbar-expand-lg sticky-top px-4 navbar-custom">
      <div className="container-fluid">
        <Link
          className="navbar-brand fw-bold d-flex align-items-center text-white"
          to="/"
        >
          <img
            src="../assets/SaiGourmet.png"
            alt="Logo"
            width="45"
            height="45"
            className="me-2 rounded-circle border border-white"
          />
          <span
            style={{ fontSize: "1.6rem", fontFamily: "Playfair Display, serif", letterSpacing: "1px" }}
          >
            SaiGourmet
          </span>
        </Link>

        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <i className="fa fa-bars fs-2"></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className={`nav-link nav-link-custom ${isActive('/')}`}>Home</Link>
            </li>
            <li className="nav-item">
              {/* <a href="#about" className={`nav-link nav-link-custom ${isActive('/about')}`}>About</a> */}
              <Link to="/about" className={`nav-link nav-link-custom ${isActive('/about')}`}>About</Link>
            </li>
            <li className="nav-item">
              {/* <a href="#category" className="nav-link nav-link-custom">Categories</a> */}
              <Link to="/categories" className={`nav-link nav-link-custom ${isActive('/categories')}`}>Categories</Link>
            </li>
            <li className="nav-item">
              {/* <a href="#restaurant" className="nav-link nav-link-custom">Restaurants</a> */}
              <Link to="/restaurants/all" className={`nav-link nav-link-custom ${isActive('/restaurants/all')}`}>Restaurants</Link>
            </li>
            <li className="nav-item">
              {/* <a href="#blogs" className="nav-link nav-link-custom">Blogs</a> */}
              <Link to="/blogs" className={`nav-link nav-link-custom ${isActive('/blogs')}`}>Blogs</Link>
            </li>
          </ul>
          
          <div className="d-flex gap-3 mt-3 mt-lg-0">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="btn btn-outline-light rounded-pill px-4 fw-bold"
                >
                  My Profile
                </Link>
                <button className="btn btn-light text-dark rounded-pill px-4 fw-bold shadow-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light rounded-pill px-4 fw-bold">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-light rounded-pill px-4 fw-bold shadow-sm"
                  style={{ color: "#b2744c" }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;