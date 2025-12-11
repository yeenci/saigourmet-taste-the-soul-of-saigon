/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import { apiRequest } from "../../lib/utils";
import SuccessModal from "../../components/modals/SuccessModal";

type Step = "REQUEST" | "VERIFY" | "RESET";

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<Step>("REQUEST");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Data needed across steps
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState("");

  // Step 3 Data
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Style for eye icon
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

  const handleApiError = (data: any, defaultMsg: string) => {
    let msg = defaultMsg;
    if (data?.detail) {
      msg = Array.isArray(data.detail) ? data.detail[0].msg : data.detail;
    } else if (data?.message) {
      msg = data.message;
    }
    setMessage({ type: "error", text: msg });
  };

  // Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await apiRequest("/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (e) {
        // ignore JSON parse error if body is empty
      }

      if (res.ok) {
        // Handle nested data structure (data.data.session_id) or flat structure
        const sid = data.session_id || data.data?.session_id;

        if (sid) {
          setSessionId(sid);
          setStep("VERIFY");
          setMessage({
            type: "success",
            text: data.message || "OTP code sent to your email.",
          });
        } else {
          console.error("Missing session_id in response:", data);
          setMessage({ type: "error", text: "Unexpected server response." });
        }
      } else {
        handleApiError(data, "User not found or error occurred.");
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await apiRequest("/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, otp }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (e) {
        // ignore
      }

      const isSuccess = res.ok && (data.code === undefined || data.code === 1);

      if (isSuccess) {
        setStep("RESET");
        setMessage({
          type: "success",
          text: data.message || "OTP Verified. Please set a new password.",
        });
      } else {
        handleApiError(data, "Invalid OTP code.");
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error." });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    if (newPassword.length < 8 || confirmPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await apiRequest("/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, password: newPassword }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch (e) {
        // ignore
      }

      const isSuccess = res.ok && (data.code === undefined || data.code === 1);

      if (isSuccess) {
        setShowSuccessModal(true);
      } else {
        handleApiError(data, "Failed to reset password.");
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthLayout
        title="Account Recovery"
        subtitle="Follow the steps to reset your password."
      >
        {message.text && (
          <div
            className={`alert ${
              message.type === "error" ? "alert-danger" : "alert-success"
            } p-2 mb-3 small`}
          >
            {message.text}
          </div>
        )}

        {/* --- STEP 1: ENTER EMAIL --- */}
        {step === "REQUEST" && (
          <form onSubmit={handleRequestOtp}>
            <div className="modern-input-group">
              <i className="fa fa-envelope"></i>
              <input
                type="email"
                className="modern-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* --- STEP 2: VERIFY OTP --- */}
        {step === "VERIFY" && (
          <form onSubmit={handleVerifyOtp}>
            <p className="small text-muted mb-3">
              OTP sent to: <strong>{email}</strong>
            </p>
            <div className="modern-input-group">
              <i className="fa fa-key"></i>
              <input
                type="text"
                className="modern-input"
                placeholder="Enter OTP code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <div className="text-center mt-2">
              <button
                type="button"
                className="btn btn-link btn-sm text-secondary"
                onClick={() => {
                  setStep("REQUEST");
                  setOtp("");
                  setSessionId("");
                  setMessage({ type: "", text: "" });
                }}
              >
                Change Email
              </button>
            </div>
          </form>
        )}

        {/* --- STEP 3: NEW PASSWORD --- */}
        {step === "RESET" && (
          <form onSubmit={handleResetPassword}>
            {/* New Password */}
            <div
              className="modern-input-group"
              style={{ position: "relative" }}
            >
              <i className="fa fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                className="modern-input"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

            {/* Confirm Password */}
            <div
              className="modern-input-group"
              style={{ position: "relative" }}
            >
              <i className="fa fa-check-circle"></i>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="modern-input"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="auth-links">
          Remember your password? <Link to="/login">Sign in</Link>
        </div>
      </AuthLayout>

      {/* --- SUCCESS MODAL POPUP --- */}
      {showSuccessModal && (
        <SuccessModal
          title="Password Reset!"
          path="/login"
          content="Your password has been reset successfully. You can now login with
              your new credentials."
          button="Back to Login"
        />
      )}
    </>
  );
};

export default ForgotPassword;
