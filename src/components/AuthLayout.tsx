import React from "react";
import "../Auth.css";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="auth-container">
      {/* Left Side: Brand/Image */}
      <div className="auth-image-side">
        <div className="auth-overlay"></div>
        <div className="auth-quote">
          <h1 className="font-playfair">SaiGourmet</h1>
          <p className="lead fs-4">
            Reserve the best tables in town.
            <br />
            Seamless. Fast. Delicious.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="auth-form-side">
        <style>{`
        .custom-link:hover {
          text-decoration: underline;
          color: #000;
          text-decoration-color: #b2744c;
        }
      `}</style>
        <div className="auth-form-container">
          <div className="d-flex justify-content-start mb-3 custom-link">
            <Link
              to="/"
              style={{
                fontSize: "13px",
                color: "#b2744c",
                textDecoration: "none",
              }}
            >
              <span className="text-2xl">&lt;</span>
              Return to Home
            </Link>
          </div>
          <h2 className="auth-title">{title}</h2>
          <p className="auth-subtitle">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
