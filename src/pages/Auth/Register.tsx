/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import { apiRequest } from "../../lib/utils";
import SuccessModal from "../../components/modals/SuccessModal";
import AttentionModal from "../../components/modals/AttentionModal";

const Register: React.FC = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Initialize state based on session storage to prevent reappearing on reload
  const [showDemoModal, setShowDemoModal] = useState(() => {
    return !sessionStorage.getItem("hasSeenDemoModal");
  });

  const previousPath = location.state?.from;

  const [formData, setFormData] = useState({
    email: "",
    phone_number: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleCloseDemoModal = () => {
    sessionStorage.setItem("hasSeenDemoModal", "true");
    setShowDemoModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8 || formData.confirmPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    // Map React state (camelCase) to API requirement (snake_case)
    const payload = {
      email: formData.email,
      phone_number: formData.phone_number,
      address: formData.address,
      password: formData.password,
      isAdmin: false,
    };

    try {
      const response = await apiRequest("/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.code === -1) {
        setError(data.message || "Registration failed. Email might be taken.");
        setLoading(false);
        return;
      }

      if (response.ok || response.status === 201) {
        setShowSuccessModal(true);
      } else {
        let msg = "Registration failed";
        // Handle Validation Errors (422)
        if (data.detail && Array.isArray(data.detail)) {
          msg = data.detail
            .map((err: any) => `${err.loc[1]}: ${err.msg}`)
            .join(", ");
        } else if (data.message) {
          msg = data.message;
        }
        setError(msg);
      }
    } catch (err) {
      console.error(err);
      setError("Network error occurred.");
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
      {/* Demo Mode Notice */}
      {showDemoModal && (
        <AttentionModal
          title="Backend Offline - Demo Mode"
          content={
            <div>
              <p className="mb-3">
                Registration is currently <strong>simulated</strong>.
              </p>
              <div
                className="bg-light p-3 rounded border text-start"
                style={{ fontSize: "0.9rem" }}
              >
                <ul className="mb-0 ps-3">
                  <li className="mb-2">
                    New accounts are saved to your browser's <strong>Local Storage</strong>.
                  </li>
                  <li>
                    You can log in with your new credentials immediately after
                    registration.
                  </li>
                </ul>
              </div>
            </div>
          }
          button="Understood"
          onConfirm={handleCloseDemoModal}
        />
      )}

      <AuthLayout title="Create Account" subtitle="Join us today.">
        {error && (
          <div className="alert alert-danger p-2 mb-3 small">{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="modern-input-group">
            <i className="fa fa-envelope"></i>
            <input
              type="email"
              name="email"
              className="modern-input"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="modern-input-group">
                <i className="fa fa-phone"></i>
                <input
                  type="tel"
                  name="phone_number"
                  className="modern-input"
                  placeholder="Phone"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="modern-input-group">
                <i className="fa fa-map-marker"></i>
                <input
                  type="text"
                  name="address"
                  className="modern-input"
                  placeholder="Address"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="modern-input-group" style={{ position: "relative" }}>
            <i className="fa fa-lock"></i>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="modern-input"
              placeholder="Password"
              onChange={handleChange}
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

          <div className="modern-input-group" style={{ position: "relative" }}>
            <i className="fa fa-check-circle"></i>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="modern-input"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
              style={{ paddingRight: "40px" }}
            />
            <i
              className={`fa ${
                showConfirmPassword ? "fa-eye-slash" : "fa-eye"
              }`}
              style={eyeIconStyle}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              title={showConfirmPassword ? "Hide password" : "Show password"}
            ></i>
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>
        <div className="auth-links">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </AuthLayout>

      {showSuccessModal && (
        <SuccessModal
          title="Account Created!"
          path="/login"
          content="Your simulated account has been created! You can now use these credentials to log in."
          button="Go to Login"
          secondaryPath={previousPath}
          secondaryButton={
            previousPath ? "Continue where you left off" : undefined
          }
        />
      )}
    </>
  );
};

export default Register;