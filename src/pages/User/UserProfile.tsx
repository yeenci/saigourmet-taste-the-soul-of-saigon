/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../lib/utils";

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, token, logout, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const brandColor = "#b2744c";

  const [formData, setFormData] = useState({
    email: "",
    phone_number: "",
    address: "",
    password: "",
  });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    } else if (user) {
      setFormData({
        email: user.email || "",
        // Correctly reading camelCase from Context User object
        phone_number: user.phone_number || "", 
        address: user.address || "",
        password: "",
      });
    }
  }, [user, isLoading, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const res = await apiRequest("/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Correctly mapping to snake_case for API
        body: JSON.stringify({
          email: formData.email,
          phone_number: formData.phone_number, 
          address: formData.address,
          password: formData.password,
        }),
      });

      if (res.ok) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.detail || data.message || "Failed to update profile.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setSaveLoading(false);
    }
  };

  const getUserInitial = () => {
    return user?.email ? user.email.charAt(0).toUpperCase() : "U";
  };

  if (isLoading || !user)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Navbar />

      <div
        className="position-relative"
        style={{
          height: "220px",
          background: `linear-gradient(135deg, ${brandColor} 0%, #d4956a 100%)`,
        }}
      ></div>

      <div
        className="container flex-grow-1"
        style={{ marginTop: "-80px", marginBottom: "60px" }}
      >
        <div className="row g-4">
          <div className="col-lg-3">
            <div className="card border-0 shadow-lg h-100 overflow-hidden">
              <div className="card-body text-center p-4">
                <div
                  className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3 shadow-sm border border-3 border-white"
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#f8f9fa",
                    color: brandColor,
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                >
                  {getUserInitial()}
                </div>

                <h6 className="fw-bold mb-1 text-dark text-truncate">
                  {user.email}
                </h6>
                <p className="text-muted small mb-4">Member</p>

                <div className="d-grid gap-2 text-start">
                  <button className="btn btn-light fw-bold text-dark d-flex align-items-center justify-content-between active">
                    <span>
                      <i className="fa fa-user-circle me-2 text-muted"></i>{" "}
                      Profile
                    </span>
                    <i className="fa fa-chevron-right small text-muted"></i>
                  </button>

                  <Link
                    to="/booking-history"
                    className="btn btn-white text-muted d-flex align-items-center justify-content-between hover-bg-light"
                  >
                    <span>
                      <i className="fa fa-history me-2"></i> History
                    </span>
                  </Link>
                </div>

                <hr className="my-4 text-muted opacity-25" />

                <button
                  onClick={logout}
                  className="btn btn-outline-danger w-100 rounded-pill btn-sm"
                >
                  <i className="fa fa-sign-out me-2"></i> Sign Out
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="card border-0 shadow-lg">
              <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                <h5
                  className="mb-0 fw-bold font-playfair"
                  style={{ color: "#333" }}
                >
                  Personal Information
                </h5>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-sm btn-outline-dark rounded-pill px-3"
                  >
                    <i className="fa fa-pencil me-1"></i> Edit
                  </button>
                )}
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleSave}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">
                        Email Address
                      </label>
                      <input
                        className="form-control bg-light"
                        value={formData.email}
                        disabled
                        style={{ border: "1px solid #eee" }}
                      />
                      <small
                        className="text-muted fst-italic"
                        style={{ fontSize: "0.8rem" }}
                      >
                        Email cannot be changed.
                      </small>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold text-uppercase">
                        Phone Number
                      </label>
                      <input
                        className={`form-control ${
                          isEditing ? "bg-white" : "bg-light text-muted"
                        }`}
                        // Use correct state key
                        value={formData.phone_number}
                        disabled={!isEditing}
                        placeholder="Enter your phone number"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone_number: e.target.value,
                          })
                        }
                        style={{
                          border: isEditing
                            ? `1px solid ${brandColor}`
                            : "1px solid #eee",
                        }}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label text-muted small fw-bold text-uppercase">
                        Delivery Address
                      </label>
                      <textarea
                        className={`form-control ${
                          isEditing ? "bg-white" : "bg-light text-muted"
                        }`}
                        value={formData.address}
                        disabled={!isEditing}
                        rows={3}
                        placeholder="Enter your full address"
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        style={{
                          border: isEditing
                            ? `1px solid ${brandColor}`
                            : "1px solid #eee",
                        }}
                      />
                    </div>

                    {isEditing && (
                      <div className="col-12">
                        <div className="p-3 rounded bg-light border border-warning-subtle">
                          <label className="form-label fw-bold text-danger">
                            <i className="fa fa-lock me-2"></i>Security Check
                          </label>
                          <p className="small text-muted mb-2">
                            Please enter your password to confirm these changes.
                          </p>
                          <input
                            type="password"
                            className="form-control"
                            required
                            placeholder="Current Password"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                      <button
                        type="button"
                        className="btn btn-light text-muted fw-bold px-4"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            email: user.email || "",
                            phone_number: user.phone_number || "",
                            address: user.address || "",
                            password: "",
                          });
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn text-white px-4 fw-bold shadow-sm"
                        disabled={saveLoading}
                        style={{ backgroundColor: brandColor }}
                      >
                        {saveLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;