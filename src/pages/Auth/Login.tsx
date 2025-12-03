/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import { apiRequest } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import SuccessModal from "../../components/modals/SuccessModal";

const Login: React.FC = () => {
  const location = useLocation();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const previousPath = location.state?.from;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    params.append("username", formData.get("username") as string);
    params.append("password", formData.get("password") as string);
    params.append("grant_type", "password");

    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: params,
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch (parseError) {
        // ignore
      }

      if (response.ok) {
        await login(data.access_token);
        setShowSuccessModal(true);
      } else {
        if (response.status === 401) {
          setError("Invalid email or password. Please try again.");
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
      <AuthLayout
        title="Welcome Back"
        subtitle="Please enter your details to sign in."
      >
        {error && (
          <div className="alert alert-danger p-2 mb-3 small">{error}</div>
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
