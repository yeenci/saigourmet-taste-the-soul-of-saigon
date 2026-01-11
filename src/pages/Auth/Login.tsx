/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import { apiRequest } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import SuccessModal from "../../components/modals/SuccessModal";
import AttentionModal from "../../components/modals/AttentionModal";

const Login: React.FC = () => {
  const location = useLocation();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Initialize state based on session storage to prevent reappearing on reload
  const [showDemoModal, setShowDemoModal] = useState(() => {
    return !sessionStorage.getItem("hasSeenDemoModal");
  });

  const previousPath = location.state?.from;

  const handleCloseDemoModal = () => {
    sessionStorage.setItem("hasSeenDemoModal", "true");
    setShowDemoModal(false);
  };

  const handleShowCredentials = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDemoModal(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Crucial: prevents page reload
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    // Safety checks for inputs
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    params.append("username", username || "");
    params.append("password", password || "");
    params.append("grant_type", "password");

    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: params.toString(),
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch (parseError) {
        // ignore JSON errors
      }

      if (response.ok) {
        await login(data.access_token);
        setShowSuccessModal(true);
      } else {
        if (response.status === 401) {
          setError("Invalid email or password.");
        } else {
          const msg =
            data.detail || "Login failed. Please check your credentials.";
          setError(Array.isArray(msg) ? msg[0].msg : msg);
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        "Unable to connect to server. Please check your internet connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const eyeIconStyle: React.CSSProperties = {
    position: "absolute",
    right: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#794929",
    zIndex: 10,
    left: "auto",
  };

  return (
    <>
      {/* Demo Credentials Modal */}
      {showDemoModal && (
        <AttentionModal
          title="Backend Offline - Demo Mode"
          content={
            <div>
              <p className="mb-3">
                The server is currently offline. Please use these demo
                credentials to test the features:
              </p>
              <div
                className="bg-light p-3 rounded border text-start"
                style={{ fontSize: "0.9rem" }}
              >
                <div className="mb-2">
                  <strong>👮 Admin:</strong> <br />
                  Email:{" "}
                  <span className="text-primary">
                    admin@saigourmet.com
                  </span>{" "}
                  <br />
                  Pass: <code>password123</code>
                </div>
                <div>
                  <strong>👤 User:</strong> <br />
                  Email:{" "}
                  <span className="text-primary">user@saigourmet.com</span>{" "}
                  <br />
                  Pass: <code>password123</code>
                </div>
              </div>
            </div>
          }
          button="Got it!"
          onConfirm={handleCloseDemoModal}
        />
      )}

      <AuthLayout
        title="Welcome Back"
        subtitle="Please enter your details to sign in."
      >
        {/* Error Alert with "Show Credentials" link */}
        {error && (
          <div className="alert alert-danger p-2 mb-3 small d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button
              onClick={handleShowCredentials}
              className="btn btn-link btn-sm text-danger fw-bold text-decoration-none p-0 ms-2"
              style={{ fontSize: "0.8rem" }}
            >
              See Credentials?
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="modern-input-group">
            <i className="fa fa-envelope"></i>
            <input
              type="text"
              name="username"
              className="modern-input"
              placeholder="Email Address"
              required
            />
          </div>

          <div className="modern-input-group" style={{ position: "relative" }}>
            <i className="fa fa-lock"></i>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="modern-input"
              placeholder="Password"
              required
              style={{ paddingRight: "40px" }}
            />
            <i
              className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              style={eyeIconStyle}
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide password" : "Show password"}
            ></i>
          </div>

          <div className="d-flex justify-content-end mb-3">
            <Link
              to="/forgot-password"
              style={{
                fontSize: "13px",
                color: "#b2744c",
                textDecoration: "none",
              }}
            >
              Forgot Password?
            </Link>
          </div>
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="auth-links">
          Don't have an account? <Link to="/register">Create free account</Link>
        </div>
      </AuthLayout>

      {showSuccessModal && (
        <SuccessModal
          title="Login Successful!"
          path="/"
          content="Welcome back! You're now signed in."
          button="Go to Home"
          secondaryPath={previousPath}
          secondaryButton={
            previousPath ? "Continue where you left off" : undefined
          }
        />
      )}
    </>
  );
};
export default Login;
