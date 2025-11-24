import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/SaiGourmet.png";

const Navbar: React.FC = () => {
  const user = null; // Mock user state
  const location = useLocation();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  
  // Ref for detecting clicks outside the menu
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const closeNav = () => setIsNavCollapsed(true);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsNavCollapsed(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path: string) =>
    location.pathname === path ? "text-white fw-bold" : "text-white opacity-90";

  // Mobile Menu Link Style (Dark text because the dialog is white)
  const mobileLinkStyle = (path: string) => 
    `nav-link px-3 py-2 rounded ${location.pathname === path ? "bg-light fw-bold text-primary" : "text-dark"}`;

  return (
    <nav className="navbar navbar-expand-lg sticky-top px-4 navbar-custom position-relative">
      <div className="container-fluid">
        {/* --- BRAND --- */}
        <Link
          className="navbar-brand fw-bold d-flex align-items-center text-white"
          to="/"
          onClick={closeNav}
        >
          <img
            src={logo}
            alt="Logo"
            width="45"
            height="45"
            className="me-2 rounded-circle border border-white"
          />
          <span
            style={{
              fontSize: "1.6rem",
              fontFamily: "Playfair Display, serif",
              letterSpacing: "1px",
            }}
          >
            SaiGourmet
          </span>
        </Link>

        {/* --- TOGGLE BUTTON --- */}
        <button
          ref={buttonRef}
          className="navbar-toggler border-0 text-white"
          type="button"
          onClick={handleNavCollapse}
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
          style={{ transition: "transform 0.2s" }}
        >
          {isNavCollapsed ? <i className="fa fa-bars fs-2"></i> : <i className="fa fa-times fs-2"></i>}
        </button>

        {/* --- DESKTOP MENU (Hidden on Mobile) --- */}
        <div className="collapse navbar-collapse d-none d-lg-flex justify-content-between">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className={`nav-link nav-link-custom ${isActive("/")}`}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className={`nav-link nav-link-custom ${isActive("/about")}`}>About</Link>
            </li>
            <li className="nav-item">
              <Link to="/categories" className={`nav-link nav-link-custom ${isActive("/categories")}`}>Categories</Link>
            </li>
            <li className="nav-item">
              <Link to="/restaurants/all" className={`nav-link nav-link-custom ${isActive("/restaurants/all")}`}>Restaurants</Link>
            </li>
            <li className="nav-item">
              <Link to="/blogs" className={`nav-link nav-link-custom ${isActive("/blogs")}`}>Blogs</Link>
            </li>
          </ul>

          <div className="d-flex gap-3">
            {user ? (
              <>
                <Link to="/profile" className="btn btn-outline-light rounded-pill px-4 fw-bold">My Profile</Link>
                <button className="btn btn-light text-dark rounded-pill px-4 fw-bold shadow-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light rounded-pill px-4 fw-bold">Login</Link>
                <Link to="/register" className="btn btn-light rounded-pill px-4 fw-bold shadow-sm" style={{ color: "#b2744c" }}>Register</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- MOBILE DIALOG MENU (Reduced Width) --- */}
      <div 
        ref={menuRef}
        // Changes: Removed 'start-0', changed 'mx-3' to 'me-3' (margin-end only)
        className={`d-lg-none position-absolute end-0 me-3 mt-2 p-3 rounded-4 shadow-lg bg-white ${isNavCollapsed ? 'd-none' : 'd-block'}`}
        style={{ 
            top: "100%", 
            zIndex: 1050,
            width: "280px", // Fixed width for popup feel
            borderTop: "4px solid #b2744c",
            animation: "fadeInUp 0.2s ease-out"
        }}
      >
        <div className="d-flex flex-column gap-1">
            <Link to="/" className={mobileLinkStyle("/")} onClick={closeNav}>
                <i className="fa fa-home me-3 text-muted" style={{width: '20px'}}></i> Home
            </Link>
            <Link to="/about" className={mobileLinkStyle("/about")} onClick={closeNav}>
                <i className="fa fa-info-circle me-3 text-muted" style={{width: '20px'}}></i> About
            </Link>
            <Link to="/categories" className={mobileLinkStyle("/categories")} onClick={closeNav}>
                <i className="fa fa-th-large me-3 text-muted" style={{width: '20px'}}></i> Categories
            </Link>
            <Link to="/restaurants/all" className={mobileLinkStyle("/restaurants/all")} onClick={closeNav}>
                <i className="fa fa-cutlery me-3 text-muted" style={{width: '20px'}}></i> Restaurants
            </Link>
            <Link to="/blogs" className={mobileLinkStyle("/blogs")} onClick={closeNav}>
                <i className="fa fa-newspaper-o me-3 text-muted" style={{width: '20px'}}></i> Blogs
            </Link>
            
            <hr className="my-2 opacity-50" />

            {/* Mobile Auth Buttons */}
            <div className="d-flex flex-column gap-2 mt-1">
                {user ? (
                    <>
                        <Link to="/profile" className="btn btn-outline-primary w-100 rounded-pill fw-bold btn-sm py-2" onClick={closeNav} style={{borderColor: '#b2744c', color: '#b2744c'}}>
                            My Profile
                        </Link>
                        <button className="btn btn-danger w-100 rounded-pill fw-bold btn-sm py-2" onClick={closeNav}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-outline-dark w-100 rounded-pill fw-bold btn-sm py-2" onClick={closeNav}>
                            Login
                        </Link>
                        <Link to="/register" className="btn w-100 rounded-pill fw-bold text-white shadow-sm btn-sm py-2" style={{backgroundColor: '#b2744c'}} onClick={closeNav}>
                            Register Account
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