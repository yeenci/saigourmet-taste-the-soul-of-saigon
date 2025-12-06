/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { apiRequest } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import { DISTRICTS, CATEGORIES } from "../../lib/constants";

// Import Custom Modals
import AttentionModal from "../../components/modals/AttentionModal";
import SuccessModal from "../../components/modals/SuccessModal";
import ErrorModal from "../../components/modals/ErrorModal";

interface AdminRestaurant {
  restaurant_id: string;
  name: string;
  address: string;
  rating: number;
  picture: string;
  openTime: string;
  closeTime: string;
  district_id?: number;
  description?: string;
  categories?: any[];
}

interface ModalConfig {
  type: "success" | "error" | "attention" | null;
  title: string;
  content: string;
  button: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  secondaryButton?: string;
}

const RestaurantDashboard: React.FC = () => {
  const { token, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState<AdminRestaurant[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Modal State for Edit Form
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRest, setEditingRest] = useState<AdminRestaurant | null>(null);

  // Modal State for Success/Error/Attention
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    type: null,
    title: "",
    content: "",
    button: "",
  });

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    district_id: 1,
    picture: "",
    openTime: "",
    closeTime: "",
    description: "",
    rating: 0,
    selectedCategories: [] as number[],
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }
    fetchRestaurants();
  }, [user, token, authLoading]);

  // --- Helper Functions ---

  const closeModal = () => {
    setModalConfig({ ...modalConfig, type: null });
  };

  const getTimeForInput = (timeStr: string) => {
    if (!timeStr) return "";
    if (timeStr.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
      return timeStr.substring(0, 5);
    }
    try {
      const date = new Date(timeStr);
      if (!isNaN(date.getTime())) {
        const hours = date.getUTCHours().toString().padStart(2, "0");
        const minutes = date.getUTCMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
      }
    } catch {
      return "";
    }
    return "";
  };

  const mergeTimeIntoIso = (timeStr: string) => {
    const date = new Date();
    if (!timeStr) return date.toISOString();
    try {
      const [h, m] = timeStr.split(":");
      date.setUTCHours(Number(h), Number(m), 0, 0);
      return date.toISOString();
    } catch (e) {
      console.error("Error parsing time string", e);
      return new Date().toISOString();
    }
  };

  const fetchRestaurants = async () => {
    setDataLoading(true);
    try {
      const response = await apiRequest("/admin/restaurants", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const result = await response.json();
        const dataArray = Array.isArray(result) ? result : result.data || [];
        setRestaurants(Array.isArray(dataArray) ? dataArray : []);
      }
    } catch (error) {
      console.error("Error fetching admin restaurants:", error);
    } finally {
      setDataLoading(false);
    }
  };

  // --- DELETE LOGIC ---

  // 1. Trigger the Attention Modal
  const confirmDelete = (restaurant: AdminRestaurant) => {
    setModalConfig({
      type: "attention",
      title: "Delete Restaurant?",
      content: `Are you sure you want to delete "${restaurant.name}"? This action cannot be undone.`,
      button: "Yes, Delete",
      secondaryButton: "Cancel",
      onConfirm: () => performDelete(restaurant),
      onCancel: closeModal,
    });
  };

  // 2. Perform the actual API call
  const performDelete = async (restaurant: AdminRestaurant) => {
    // Close the attention modal first (optional, or keep it open with loading state if needed)
    closeModal();

    const payload = {
      name: restaurant.name,
      address: restaurant.address,
      district_id: restaurant.district_id || 1,
      image_url: restaurant.picture,
      description: restaurant.description || "Deleted",
      rating: Number(restaurant.rating),
      openTime: restaurant.openTime
        ? mergeTimeIntoIso(getTimeForInput(restaurant.openTime))
        : new Date().toISOString(),
      closeTime: restaurant.closeTime
        ? mergeTimeIntoIso(getTimeForInput(restaurant.closeTime))
        : new Date().toISOString(),
      categories: [],
    };

    try {
      const response = await apiRequest(
        `/admin/restaurant/${restaurant.restaurant_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setRestaurants((prev) =>
          prev.filter((r) => r.restaurant_id !== restaurant.restaurant_id)
        );
        setModalConfig({
          type: "success",
          title: "Deleted Successfully",
          content: "The restaurant has been removed from the system.",
          button: "Okay",
          onConfirm: closeModal,
        });
      } else {
        const err = await response.json();
        const errMsg = err.detail
          ? JSON.stringify(err.detail)
          : err.message || "Unknown error";

        setModalConfig({
          type: "error",
          title: "Delete Failed",
          content: `Could not delete restaurant: ${errMsg}`,
          button: "Close",
          onConfirm: closeModal,
        });
      }
    } catch (e) {
      console.error(e);
      setModalConfig({
        type: "error",
        title: "Network Error",
        content: "An error occurred while connecting to the server.",
        button: "Close",
        onConfirm: closeModal,
      });
    }
  };

  // --- EDIT LOGIC ---

  const handleEditClick = (rest: AdminRestaurant) => {
    setEditingRest(rest);

    const existingCategoryIds =
      (rest.categories
        ?.map((c: any) => {
          if (typeof c === "number") return c;
          if (typeof c === "object") return Number(c.categoryId || c.id);
          if (typeof c === "string") {
            const found = CATEGORIES.find(
              (cat) => cat.name.toLowerCase() === c.toLowerCase()
            );
            return found ? found.categoryId : null;
          }
          return null;
        })
        .filter((id: any) => id !== null) as number[]) || [];

    setFormData({
      name: rest.name || "",
      address: rest.address || "",
      district_id: rest.district_id || 1,
      picture: rest.picture || "",
      openTime: getTimeForInput(rest.openTime),
      closeTime: getTimeForInput(rest.closeTime),
      description: rest.description || "",
      rating: rest.rating || 0,
      selectedCategories: existingCategoryIds,
    });
    setShowEditModal(true);
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

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRest) return;

    if (formData.selectedCategories.length === 0) {
      setModalConfig({
        type: "error",
        title: "Validation Error",
        content: "Please select at least one category.",
        button: "Okay",
        onConfirm: closeModal,
      });
      return;
    }

    const payload = {
      name: formData.name,
      address: formData.address,
      district_id: Number(formData.district_id),
      image_url: formData.picture,
      description: formData.description,
      rating: Number(formData.rating),
      openTime: mergeTimeIntoIso(formData.openTime),
      closeTime: mergeTimeIntoIso(formData.closeTime),
      categories: formData.selectedCategories,
    };

    try {
      const response = await apiRequest(
        `/admin/restaurant/${editingRest.restaurant_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setShowEditModal(false); // Close edit form first
        fetchRestaurants(); // Refresh list

        setModalConfig({
          type: "success",
          title: "Update Successful",
          content: "Restaurant details have been updated successfully.",
          button: "Great",
          onConfirm: closeModal,
        });
      } else {
        const err = await response.json();
        const msg = Array.isArray(err.detail)
          ? err.detail
              .map((d: any) => `${d.loc.join(".")}: ${d.msg}`)
              .join(", ")
          : err.message || "Update failed";

        setModalConfig({
          type: "error",
          title: "Update Failed",
          content: msg,
          button: "Try Again",
          onConfirm: closeModal,
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      setModalConfig({
        type: "error",
        title: "System Error",
        content: "An error occurred while updating the restaurant.",
        button: "Close",
        onConfirm: closeModal,
      });
    }
  };

  const formatTimeDisplay = (isoString: string) => {
    if (!isoString) return "N/A";
    return getTimeForInput(isoString);
  };

  // --- Render Helpers ---

  const renderResultModal = () => {
    if (!modalConfig.type) return null;

    if (modalConfig.type === "success") {
      return (
        <SuccessModal
          title={modalConfig.title}
          content={modalConfig.content}
          button={modalConfig.button}
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
          onCancel={modalConfig.onCancel}
          secondaryButton={modalConfig.secondaryButton}
        />
      );
    }
  };

  if (authLoading) {
    return (
      <div className="d-flex flex-column min-vh-100 bg-light">
        <Navbar />
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <div className="spinner-border text-warning" role="status"></div>
        </div>
      </div>
    );
  }

  if (!user || !user.isAdmin) return null;

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      {/* Render Global Result Modal */}
      {renderResultModal()}

      <div className="bg-white border-bottom shadow-sm">
        <div className="container py-4 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold font-playfair mb-1">Admin Dashboard</h2>
            <p className="text-muted mb-0">
              Manage your restaurants and bookings
            </p>
          </div>
          <Link
            to="/admin/create-restaurant"
            className="btn btn-primary fw-bold px-4"
            style={{ backgroundColor: "#b2744c", borderColor: "#b2744c" }}
          >
            <i className="fa fa-plus me-2"></i> Add Restaurant
          </Link>
        </div>
      </div>

      <div className="container py-5">
        {dataLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-5">
            <i className="fa fa-cutlery fa-3x text-muted opacity-50 mb-3"></i>
            <h3>No Restaurants Found</h3>
            <p className="text-muted">
              You haven't listed any restaurants yet.
            </p>
            <Link
              to="/admin/create-restaurant"
              className="btn btn-outline-dark mt-2"
            >
              Create One Now
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {restaurants.map((rest) => (
              <div
                key={rest.restaurant_id}
                className="card border-0 shadow-sm rounded-3 overflow-hidden hover-shadow transition-all"
              >
                <div className="d-flex flex-column flex-md-row align-items-md-center">
                  {/* Image Section */}
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "200px",
                      minHeight: "130px",
                      position: "relative",
                    }}
                    className="d-none d-md-block align-self-stretch"
                  >
                    <img
                      src={
                        rest.picture || "https://via.placeholder.com/200x130"
                      }
                      alt={rest.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        position: "absolute",
                      }}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/200x130?text=No+Image";
                      }}
                    />
                  </div>
                  {/* Mobile Image */}
                  <div className="d-md-none w-100" style={{ height: "180px" }}>
                    <img
                      src={
                        rest.picture || "https://via.placeholder.com/400x200"
                      }
                      alt={rest.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* Content Section */}
                  <div className="p-3 p-md-4 flex-grow-1">
                    <h5 className="fw-bold mb-1 font-playfair">{rest.name}</h5>
                    <div className="d-flex align-items-center text-secondary small">
                      <i className="fa fa-clock-o me-2 text-primary"></i>
                      <span className="fw-semibold">
                        {formatTimeDisplay(rest.openTime)} -{" "}
                        {formatTimeDisplay(rest.closeTime)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons (Right Side) */}
                  <div className="p-3 p-md-4 d-flex align-items-center gap-2 border-start-md bg-light-md">
                    <Link
                      to={`/admin/restaurant/${rest.restaurant_id}/bookings`}
                      className="btn btn-sm px-3 fw-bold shadow-sm d-flex align-items-center gap-2"
                      style={{
                        backgroundColor: "#b2744c",
                        color: "white",
                        border: "none",
                        height: "38px",
                      }}
                    >
                      <i className="fa fa-list-alt"></i> Bookings
                    </Link>

                    <div
                      className="vr mx-1 text-muted d-none d-md-block"
                      style={{ height: "20px" }}
                    ></div>

                    <button
                      className="btn btn-sm btn-white border bg-white shadow-sm text-primary"
                      onClick={() => handleEditClick(rest)}
                      title="Edit Restaurant"
                      style={{ width: "38px", height: "38px" }}
                    >
                      <i className="fa fa-pencil"></i>
                    </button>

                    <button
                      className="btn btn-sm btn-white border bg-white shadow-sm text-danger"
                      onClick={() => confirmDelete(rest)}
                      title="Delete Restaurant"
                      style={{ width: "38px", height: "38px" }}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Edit Modal Form (This remains as a custom inline modal for the form itself) */}
      {showEditModal && editingRest && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1060,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="bg-white rounded-3 shadow-lg overflow-hidden"
            style={{ width: "95%", maxWidth: "650px", maxHeight: "90vh" }}
          >
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
              <h5 className="mb-0 fw-bold">Edit Restaurant</h5>
              <button
                onClick={() => setShowEditModal(false)}
                className="btn-close"
              ></button>
            </div>
            <div className="p-4 overflow-auto" style={{ maxHeight: "75vh" }}>
              <form onSubmit={handleUpdateSubmit}>
                {/* Name & Address */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    required
                  />
                </div>

                {/* District & Image */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-uppercase">
                      District
                    </label>
                    <select
                      className="form-select"
                      value={formData.district_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          district_id: Number(e.target.value),
                        })
                      }
                    >
                      {DISTRICTS.map((d) => (
                        <option key={d.districtId} value={d.districtId}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-uppercase">
                      Rating
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      className="form-control"
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rating: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase">
                    Image URL
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.picture}
                    onChange={(e) =>
                      setFormData({ ...formData, picture: e.target.value })
                    }
                  />
                </div>

                {/* Time */}
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <label className="form-label small fw-bold text-uppercase">
                      Open Time
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      value={formData.openTime}
                      onChange={(e) =>
                        setFormData({ ...formData, openTime: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold text-uppercase">
                      Close Time
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      value={formData.closeTime}
                      onChange={(e) =>
                        setFormData({ ...formData, closeTime: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Category Selection (Chip Grid) */}
                <div className="mb-4">
                  <label className="form-label small fw-bold text-uppercase d-block mb-2">
                    Categories
                  </label>
                  <div className="d-flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => {
                      const isSelected = formData.selectedCategories.includes(
                        cat.categoryId
                      );
                      return (
                        <button
                          key={cat.categoryId}
                          type="button"
                          onClick={() => toggleCategory(cat.categoryId)}
                          className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-pill transition-all`}
                          style={{
                            backgroundColor: isSelected ? "#b2744c" : "#f8f9fa",
                            color: isSelected ? "white" : "#6c757d",
                            border: isSelected
                              ? "1px solid #b2744c"
                              : "1px solid #dee2e6",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <i className={`fa ${cat.icon}`}></i> {cat.name}
                        </button>
                      );
                    })}
                  </div>
                  {formData.selectedCategories.length === 0 && (
                    <div className="text-danger small mt-2">
                      * Please select at least one category
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      backgroundColor: "#b2744c",
                      borderColor: "#b2744c",
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;
