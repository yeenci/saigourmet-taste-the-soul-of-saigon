import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { CATEGORIES } from "../../lib/constants";

// Constants for Dropdowns/Selection
const DISTRICTS = [
  "District 1",
  "District 2",
  "District 3",
  "District 4",
  "District 5",
  "District 7",
  "Binh Thanh",
  "Phu Nhuan",
  "Thao Dien",
  "Tan Binh",
];

const CreateRestaurant: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    district: "",
    phone: "",
    openTime: "",
    closeTime: "",
    description: "",
    pictureUrl: "",
    selectedCategories: [] as string[],
  });

  // Handle Text Inputs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Category Selection (Toggle)
  const toggleCategory = (catId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedCategories.includes(catId);
      if (exists) {
        return {
          ...prev,
          selectedCategories: prev.selectedCategories.filter(
            (id) => id !== catId
          ),
        };
      } else {
        return {
          ...prev,
          selectedCategories: [...prev.selectedCategories, catId],
        };
      }
    });
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple Validation
    if (formData.selectedCategories.length === 0) {
      alert("Please select at least one category.");
      setLoading(false);
      return;
    }

    console.log("Submitting Data:", formData);

    // Simulate API Call
    setTimeout(() => {
      alert("Restaurant created successfully!");
      setLoading(false);
      navigate("/"); // Redirect to Home or Admin Dashboard
    }, 1500);
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Navbar />

      <div className="container my-5" style={{ maxWidth: "900px" }}>
        <div className="card border-0 shadow-lg rounded-3 overflow-hidden">
          {/* Header Banner */}
          <div className="form-header-bg">
            <h2 className="fw-bold font-playfair mb-2">
              Partner with SaiGourmet
            </h2>
            <p className="mb-0 opacity-90">
              Register your restaurant to reach thousands of foodies in Saigon.
            </p>
          </div>

          <div className="card-body p-5">
            <form onSubmit={handleSubmit}>
              {/* --- Section 1: Basic Information --- */}
              <div className="mb-5">
                <h5 className="form-section-title">
                  <i className="fa fa-info-circle text-primary"></i> Basic
                  Information
                </h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="restaurantName"
                        placeholder="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="restaurantName">Restaurant Name</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        placeholder="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="phone">Phone Number</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea
                        className="form-control"
                        placeholder="Description"
                        id="description"
                        style={{ height: "100px" }}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                      ></textarea>
                      <label htmlFor="description">
                        Short Description / Slogan
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- Section 2: Location & Media --- */}
              <div className="mb-5">
                <h5 className="form-section-title">
                  <i className="fa fa-map-marker text-danger"></i> Location &
                  Media
                </h5>
                <div className="row g-3">
                  <div className="col-md-8">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        placeholder="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="address">Street Address</label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>
                          Select...
                        </option>
                        {DISTRICTS.map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="district">District</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="url"
                        className="form-control"
                        id="pictureUrl"
                        placeholder="Image URL"
                        name="pictureUrl"
                        value={formData.pictureUrl}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="pictureUrl">Cover Image URL</label>
                    </div>
                    <div className="form-text">
                      Paste a link to a high-quality image of your restaurant.
                    </div>
                  </div>
                </div>
              </div>

              {/* --- Section 3: Operations & Category --- */}
              <div className="mb-5">
                <h5 className="form-section-title">
                  <i className="fa fa-clock-o text-warning"></i> Operations &
                  Category
                </h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">
                      Opening Time
                    </label>
                    <input
                      type="time"
                      className="form-control form-control-lg"
                      name="openTime"
                      value={formData.openTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">
                      Closing Time
                    </label>
                    <input
                      type="time"
                      className="form-control form-control-lg"
                      name="closeTime"
                      value={formData.closeTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <label className="form-label text-muted small fw-bold d-block mb-3">
                  Select Categories (Select at least one)
                </label>
                <div className="category-grid">
                  {CATEGORIES.map((cat) => (
                    <div
                      key={cat.categoryId}
                      className={`category-chip ${
                        formData.selectedCategories.includes(cat.categoryId)
                          ? "active"
                          : ""
                      }`}
                      onClick={() => toggleCategory(cat.categoryId)}
                    >
                      <i className={`fa ${cat.icon}`}></i> {cat.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="d-grid mt-5">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg p-3 fw-bold shadow-sm"
                  disabled={loading}
                  style={{ backgroundColor: "#b2744c", borderColor: "#b2744c" }}
                >
                  {loading ? (
                    <span>
                      <i className="fa fa-spinner fa-spin me-2"></i>{" "}
                      Processing...
                    </span>
                  ) : (
                    <span>Register Restaurant</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/")}
            className="btn btn-link text-muted text-decoration-none"
          >
            <i className="fa fa-arrow-left me-1"></i> Back to Home
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateRestaurant;
