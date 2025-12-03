/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { apiRequest } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import { DISTRICTS } from "../../lib/constants";

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

const RestaurantDashboard: React.FC = () => {
  const { token, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState<AdminRestaurant[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRest, setEditingRest] = useState<AdminRestaurant | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }
    fetchRestaurants();
  }, [user, token, authLoading]);

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

  const handleDelete = async (restaurantId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this restaurant? This cannot be undone."
      )
    )
      return;

    try {
      const response = await apiRequest(`/admin/restaurant/${restaurantId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        alert("Restaurant deleted successfully.");
        fetchRestaurants();
      } else {
        alert("Failed to delete restaurant.");
      }
    } catch (e) {
      console.error(e);
      alert("Network error.");
    }
  };

  const handleEditClick = (rest: AdminRestaurant) => {
    setEditingRest(rest);
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for Update Logic
    alert(`Update functionality for ${editingRest?.name} would go here.`);
    setShowEditModal(false);
  };

  const formatTimeDisplay = (isoString: string) => {
    if (!isoString) return "N/A";
    try {
      if (isoString.includes("T")) {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      return isoString.substring(0, 5);
    } catch {
      return isoString;
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
                    {/* <div className="text-muted small mb-2 text-truncate">
                      <i className="fa fa-map-marker me-2 text-danger"></i>
                      {rest.address}
                    </div> */}
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
                    {/* Booking Button (Text + Icon) */}
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

                    {/* Spacer (Vertical line only on Desktop) */}
                    <div className="vr mx-1 text-muted d-none d-md-block" style={{height: '20px'}}></div>

                    {/* Edit Button (Icon Only) */}
                    <button
                      className="btn btn-sm btn-white border bg-white shadow-sm text-primary"
                      onClick={() => handleEditClick(rest)}
                      title="Edit Restaurant"
                      style={{ width: "38px", height: "38px" }}
                    >
                      <i className="fa fa-pencil"></i>
                    </button>

                    {/* Delete Button (Icon Only) */}
                    <button
                      className="btn btn-sm btn-white border bg-white shadow-sm text-danger"
                      onClick={() => handleDelete(rest.restaurant_id)}
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

      {/* Edit Modal (UI Only - Functional Logic Placeholder) */}
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
            style={{ width: "95%", maxWidth: "600px", maxHeight: "90vh" }}
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
                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={editingRest.name}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={editingRest.address}
                  />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-12">
                    <label className="form-label small fw-bold text-uppercase">
                      District
                    </label>
                    <select className="form-select" defaultValue={1}>
                      {DISTRICTS.map((d) => (
                        <option key={d.districtId} value={d.districtId}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase">
                    Image URL
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={editingRest.picture}
                  />
                </div>
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label small fw-bold text-uppercase">
                      Open Time
                    </label>
                    <input type="time" className="form-control" />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold text-uppercase">
                      Close Time
                    </label>
                    <input type="time" className="form-control" />
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-4">
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