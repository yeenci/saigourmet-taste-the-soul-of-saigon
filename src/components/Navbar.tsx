import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/SaiGourmet.png";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Refs for detecting clicks outside
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const brandColor = "#b2744c";

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const closeNav = () => setIsNavCollapsed(true);

  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);
  const closeUserMenu = () => setShowUserMenu(false);

  const handleLogout = () => {
    logout();
    closeNav();
    closeUserMenu();
    navigate("/login");
  };

  // useEffect( () => {
  //       if (user) {
  //           console.log("Navbar User Data:", user);
  //       }
  //   }
  // );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsNavCollapsed(true);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(target) &&
        avatarRef.current &&
        !avatarRef.current.contains(target)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path: string) =>
    location.pathname === path ? "text-white fw-bold" : "text-white opacity-90";

  // Helper to get user initial
  const getUserInitial = () => {
    if (user && user.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top px-4 navbar-custom position-sticky">
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
        >
          {isNavCollapsed ? (
            <i className="fa fa-bars fs-2"></i>
          ) : (
            <i className="fa fa-times fs-2"></i>
          )}
        </button>

        {/* --- DESKTOP MENU --- */}
        <div className="collapse navbar-collapse d-none d-lg-flex justify-content-between">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            {["/", "/about", "/categories", "/restaurants/all", "/blogs"].map(
              (path, index) => {
                const labels = [
                  "Home",
                  "About",
                  "Categories",
                  "Restaurants",
                  "Blogs",
                ];
                return (
                  <li className="nav-item" key={path}>
                    <Link
                      to={path}
                      className={`nav-link nav-link-custom ${isActive(path)}`}
                    >
                      {labels[index]}
                    </Link>
                  </li>
                );
              }
            )}
          </ul>

          <div className="d-flex gap-3 align-items-center position-relative">
            {user ? (
              /* --- LOGGED IN: AVATAR & ENHANCED DROPDOWN --- */
              <>
                <div
                  ref={avatarRef}
                  onClick={toggleUserMenu}
                  className="rounded-circle d-flex justify-content-center align-items-center shadow-sm user-select-none"
                  style={{
                    width: "42px",
                    height: "42px",
                    backgroundColor: "#fff",
                    color: brandColor,
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    border: "2px solid rgba(255,255,255,0.9)",
                    transition: "transform 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  {getUserInitial()}
                </div>

                {/* --- ENHANCED DESKTOP POPUP --- */}
                {showUserMenu && (
                  <div
                    ref={userMenuRef}
                    className="position-absolute bg-white rounded-4 shadow-lg overflow-hidden"
                    style={{
                      top: "60px",
                      right: "0",
                      width: "280px",
                      zIndex: 1050,
                      animation: "fadeIn 0.2s ease-out",
                    }}
                  >
                    {/* Header */}
                    <div className="px-4 py-3 bg-light border-bottom">
                      <p className="mb-1 text-muted small fw-bold text-uppercase">
                        Signed in as
                      </p>
                      <p
                        className="mb-0 fw-bold text-dark text-truncate"
                        style={{ fontSize: "0.95rem" }}
                      >
                        {user.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="dropdown-item px-4 py-2 d-flex align-items-center gap-3"
                        onClick={closeUserMenu}
                      >
                        <div
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                          style={{
                            width: "35px",
                            height: "35px",
                            color: brandColor,
                          }}
                        >
                          <i className="fa fa-user"></i>
                        </div>
                        <div>
                          <span className="d-block fw-semibold">
                            My Profile
                          </span>
                          <small
                            className="text-muted"
                            style={{ fontSize: "0.8rem" }}
                          >
                            Account settings
                          </small>
                        </div>
                      </Link>

                      <Link
                        to="/booking-history"
                        className="dropdown-item px-4 py-2 d-flex align-items-center gap-3"
                        onClick={closeUserMenu}
                      >
                        <div
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                          style={{
                            width: "35px",
                            height: "35px",
                            color: brandColor,
                          }}
                        >
                          <i className="fa fa-clock-o"></i>
                        </div>
                        <div>
                          <span className="d-block fw-semibold">
                            Booking History
                          </span>
                          <small
                            className="text-muted"
                            style={{ fontSize: "0.8rem" }}
                          >
                            Past orders
                          </small>
                        </div>
                      </Link>
                    </div>

                    {/* Footer / Logout */}
                    <div className="bg-light p-2 border-top">
                      <button
                        onClick={handleLogout}
                        className="dropdown-item text-danger fw-bold rounded px-3 py-2 d-flex align-items-center justify-content-center gap-2"
                      >
                        <i className="fa fa-sign-out"></i> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* --- LOGGED OUT BUTTONS --- */
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-light rounded-pill px-4 fw-bold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-light rounded-pill px-4 fw-bold shadow-sm"
                  style={{ color: brandColor }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU (Enhanced) --- */}
      <div
        ref={menuRef}
        className={`d-lg-none position-fixed end-0 me-3 mt-2 rounded-4 shadow-lg bg-white overflow-hidden ${
          isNavCollapsed ? "d-none" : "d-block"
        }`}
        style={{
          top: "70px",
          zIndex: 1050,
          width: "300px",
          animation: "fadeInUp 0.2s ease-out",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        {/* Mobile Header (User Info) */}
        {user ? (
          <div
            className="p-3 text-white"
            style={{
              background: `linear-gradient(135deg, ${brandColor} 0%, #d4956a 100%)`,
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-white text-dark d-flex align-items-center justify-content-center fw-bold shadow-sm"
                style={{ width: "40px", height: "40px" }}
              >
                {getUserInitial()}
              </div>
              <div className="overflow-hidden">
                <small className="d-block opacity-75">Welcome back,</small>
                <strong className="d-block">{user.email}</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-light border-bottom">
            <h6 className="mb-0 fw-bold text-muted">Menu</h6>
          </div>
        )}

        <div className="p-2">
          {/* Navigation Links */}
          <div className="d-flex flex-column gap-1">
            {[
              { path: "/", icon: "home", label: "Home" },
              { path: "/about", icon: "info-circle", label: "About" },
              { path: "/categories", icon: "th-large", label: "Categories" },
              {
                path: "/restaurants/all",
                icon: "cutlery",
                label: "Restaurants",
              },
              { path: "/blogs", icon: "newspaper-o", label: "Blogs" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`btn btn-sm text-start fw-semibold py-2 px-3 d-flex align-items-center gap-3 ${
                  location.pathname === item.path
                    ? "btn-light text-primary"
                    : "text-dark bg-white border-0"
                }`}
                onClick={closeNav}
              >
                <i
                  className={`fa fa-${item.icon} text-muted`}
                  style={{ width: "20px", textAlign: "center" }}
                ></i>
                {item.label}
              </Link>
            ))}
          </div>

          <hr className="my-2 opacity-25" />

          <div className="d-flex flex-column gap-1 pb-2">
            {[
              { path: "/profile", icon: "user", label: "My Profile" },
              {
                path: "/booking-history",
                icon: "clock-o",
                label: "Booking History",
              },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`btn btn-sm text-start fw-semibold py-2 px-3 d-flex align-items-center gap-3 ${
                  location.pathname === item.path
                    ? "btn-light text-primary"
                    : "text-dark bg-white border-0"
                }`}
                onClick={closeNav}
              >
                <i
                  className={`fa fa-${item.icon}`}
                  style={{ width: "20px", textAlign: "center" }}
                ></i>
                {item.label}
              </Link>
            ))}
          </div>
          {/* User Actions (Mobile) */}
          <div className="d-flex flex-column gap-2">
            {user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger btn-sm w-100 mt-2 rounded-pill fw-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="d-grid gap-2">
                <Link
                  to="/login"
                  className="btn btn-outline-dark rounded-pill fw-bold"
                  onClick={closeNav}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn text-white rounded-pill fw-bold shadow-sm"
                  style={{ backgroundColor: brandColor }}
                  onClick={closeNav}
                >
                  Register Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
