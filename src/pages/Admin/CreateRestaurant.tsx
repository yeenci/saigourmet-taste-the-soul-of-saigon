import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { CATEGORIES, DISTRICTS } from "../../lib/constants";
import { apiRequest } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

// Import Custom Modals
import AttentionModal from "../../components/modals/AttentionModal";
import SuccessModal from "../../components/modals/SuccessModal";
import ErrorModal from "../../components/modals/ErrorModal";

// Define Modal Config Interface
interface ModalConfig {
  type: "success" | "error" | "attention" | null;
  title: string;
  content: string;
  button: string;
  path?: string;
  onConfirm?: () => void;
}

const CreateRestaurant: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);

  // Modal State
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    type: null,
    title: "",
    content: "",
    button: "",
  });

  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate("/you-are-not-allowed-to-create-restaurants");
    }
  }, [user, navigate]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    district_id: 1,
    openTime: "",
    closeTime: "",
    rating: 5,
    image_url: "",
    selectedCategories: [] as number[],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (catId: number) => {
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

  const closeModal = () => {
    setModalConfig({ ...modalConfig, type: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation: Check Categories
    if (formData.selectedCategories.length === 0) {
      setModalConfig({
        type: "attention",
        title: "Missing Category",
        content:
          "Please select at least one category to describe your restaurant.",
        button: "Okay",
        onConfirm: closeModal,
      });
      setLoading(false);
      return;
    }

    const formatToIso = (timeStr: string) => {
      if (!timeStr) return new Date().toISOString();
      const now = new Date();
      const [hours, minutes] = timeStr.split(":").map(Number);

      // Create date object treating input values as UTC components
      const utcDate = new Date(
        Date.UTC(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hours,
          minutes
        )
      );

      return utcDate.toISOString();
    };

    const payload = {
      name: formData.name,
      address: formData.address,
      district_id: Number(formData.district_id),
      description: "", // Sending empty string as required by schema
      image_url: formData.image_url,
      categories: formData.selectedCategories,
      openTime: formatToIso(formData.openTime),
      closeTime: formatToIso(formData.closeTime),
      rating: Number(formData.rating),
    };

    try {
      const response = await apiRequest("/admin/restaurant/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setModalConfig({
          type: "success",
          title: "Restaurant Created!",
          content: `${formData.name} has been successfully added to the system.`,
          button: "Go to Dashboard",
          path: "/admin/dashboard", // SuccessModal will handle navigation
        });
      } else {
        const data = await response.json();
        const errorMsg = data.detail
          ? JSON.stringify(data.detail)
          : "Failed to create restaurant.";

        setModalConfig({
          type: "error",
          title: "Creation Failed",
          content: `Server Error: ${errorMsg}`,
          button: "Try Again",
          onConfirm: closeModal,
        });
      }
    } catch (err) {
      console.error(err);
      setModalConfig({
        type: "error",
        title: "Network Error",
        content:
          "Unable to connect to the server. Please check your internet connection.",
        button: "Close",
        onConfirm: closeModal,
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper to render the active result modal
  const renderResultModal = () => {
    if (!modalConfig.type) return null;

    if (modalConfig.type === "success") {
      return (
        <SuccessModal
          title={modalConfig.title}
          content={modalConfig.content}
          button={modalConfig.button}
          path={modalConfig.path}
          onConfirm={modalConfig.onConfirm}
        />
      );
    }

    if (modalConfig.type === "error") {
      return (
        <ErrorModal
          title={modalConfig.title}
          content={modalConfig.content}
          button={modalConfig.button}
          onConfirm={modalConfig.onConfirm}
        />
      );
    }

    if (modalConfig.type === "attention") {
      return (
        <AttentionModal
          title={modalConfig.title}
          content={modalConfig.content}
          button={modalConfig.button}
          onConfirm={modalConfig.onConfirm}
        />
      );
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Navbar />

      {/* Render Modal */}
      {renderResultModal()}

      <div className="container my-5" style={{ maxWidth: "900px" }}>
        <div className="card border-0 shadow-lg rounded-3 overflow-hidden">
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
              {/* Basic Info */}
              <div className="mb-5">
                <h5 className="form-section-title">
                  <i className="fa fa-info-circle text-primary"></i> Basic
                  Information
                </h5>
                <div className="row g-3">
                  <div className="col-md-8">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="name">Restaurant Name</label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-floating">
                      <input
                        type="number"
                        className="form-control"
                        id="rating"
                        placeholder="Rating"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        min="0"
                        max="5"
                        step="0.1"
                        required
                      />
                      <label htmlFor="rating">Initial Rating (0-5)</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Media */}
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
                        id="district_id"
                        name="district_id"
                        value={formData.district_id}
                        onChange={handleChange}
                        required
                      >
                        {DISTRICTS.map((dist) => (
                          <option key={dist.districtId} value={dist.districtId}>
                            {dist.name}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="district_id">District</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="url"
                        className="form-control"
                        id="image_url"
                        placeholder="Image URL"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="image_url">Cover Image URL</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operations */}
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
                  Select Categories
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
                    "Register Restaurant"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateRestaurant;
