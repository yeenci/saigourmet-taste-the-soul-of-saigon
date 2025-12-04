/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { apiRequest, fetchRestaurantsData } from "../../lib/utils";
import type { Booking, Restaurant } from "../../lib/types";

const BookingHistory: React.FC = () => {
  const { user, token, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Booking>>({});

  // Brand color constant
  const brandColor = "#b2744c";

  // Check Auth
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [isLoading, user, navigate]);

  // Fetch Data
  useEffect(() => {
    const loadData = async () => {
      if (!token) return;

      try {
        setLoadingData(true);

        const restaurantData = await fetchRestaurantsData();
        if (restaurantData) {
          setRestaurants(restaurantData);
        }

        const response = await apiRequest("/user/booking", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const rawData = await response.json();
          const data: Booking[] = Array.isArray(rawData)
            ? rawData
            : rawData.data || [];

          const sortedData = data.sort(
            (a, b) =>
              new Date(b.reservation_time).getTime() -
              new Date(a.reservation_time).getTime()
          );

          setBookings(sortedData);
        } else {
          console.error("Failed to fetch bookings");
        }
      } catch (error) {
        console.error("Error loading history:", error);
      } finally {
        setLoadingData(false);
      }
    };

    if (user && token) {
      loadData();
    }
  }, [user, token]);

  // Delete
  const handleDelete = async (bookingId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel and delete this booking?"
      )
    )
      return;
    setIsDeleting(true);
    try {
      const response = await apiRequest(`/user/booking/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setBookings((prev) => prev.filter((b) => b.booking_id !== bookingId));
        setSelectedBooking(null);
        alert("Booking cancelled successfully.");
      } else {
        const err = await response.json();
        alert(err.detail || "Failed to delete booking.");
      }
    } catch (error) {
      console.error("Delete error", error);
      alert("Network error while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Edit
  const handleEditClick = (booking: Booking) => {
    setEditFormData({
      name: booking.name,
      phone: booking.phone,
      email: booking.email,
      reservation_time: booking.reservation_time,
      num_of_guests: booking.num_of_guests,
      note: booking.note,
    });
    setIsEditing(true);
  };

  const handleEdit = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    if (!selectedBooking) return;

    setIsSaving(true);

    try {
      const updatedTime = editFormData.reservation_time
        ? new Date(editFormData.reservation_time).toISOString()
        : selectedBooking.reservation_time;

      const payload = {
        customer_name: editFormData.name || selectedBooking.name,
        email: editFormData.email || selectedBooking.email,
        phone: editFormData.phone || selectedBooking.phone,
        reservation_time: updatedTime,
        num_of_guests: Number(
          editFormData.num_of_guests || selectedBooking.num_of_guests
        ),
        note:
          editFormData.note !== undefined
            ? editFormData.note
            : selectedBooking.note,
      };

      const response = await apiRequest(
        `/user/booking/${selectedBooking.booking_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const updatedBooking: Booking = {
          ...selectedBooking,
          name: payload.customer_name,
          email: payload.email,
          phone: payload.phone,
          reservation_time: payload.reservation_time,
          num_of_guests: payload.num_of_guests,
          note: payload.note,
        };

        setBookings((prev) =>
          prev.map((b) =>
            b.booking_id === selectedBooking.booking_id ? updatedBooking : b
          )
        );

        setSelectedBooking(updatedBooking);
        setIsEditing(false);
        alert("Booking updated successfully!");
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.detail || "Failed to update booking.";
        alert(Array.isArray(errorMessage) ? errorMessage[0].msg : errorMessage);
      }
    } catch (error) {
      console.error("Update error", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({});
  };

  const closePopup = () => {
    setSelectedBooking(null);
    setIsEditing(false);
  };

  // Helper
  const getRestaurantDetails = (id: string) => {
    return (
      restaurants.find((r) => String(r.restaurantId) === String(id)) ||
      restaurants.find((r) => r.name === id)
    );
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) throw new Error("No date provided");
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error("Invalid Date");

      return {
        day: date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        time: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } catch (e) {
      return { day: "Date N/A", time: "" };
    }
  };

  const getDateTimeLocalForInput = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    const localIso = new Date(date.getTime() - offset)
      .toISOString()
      .slice(0, 16);
    return localIso;
  };

  const getUserInitial = () => {
    return user?.email ? user.email.charAt(0).toUpperCase() : "U";
  };

  const getNormalizedStatus = (status: any): string => {
    if (status === 0 || status === "Pending") return "PENDING";
    if (status === 1 || status === "Accepted") return "ACCEPTED";
    if (status === 2 || status === "Denied") return "DENIED";
    return String(status || "UNKNOWN").toUpperCase();
  };

  // Helper: Status Badge Styling
  const getStatusBadge = (rawStatus: any) => {
    const status = getNormalizedStatus(rawStatus);

    switch (status) {
      case "ACCEPTED":
        return (
          <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2 rounded-pill">
            Confirmed <i className="fa fa-check-circle ms-1"></i>
          </span>
        );
      case "PENDING":
        return (
          <span className="badge bg-warning bg-opacity-10 text-warning border border-warning px-3 py-2 rounded-pill">
            Pending <i className="fa fa-clock-o ms-1"></i>
          </span>
        );
      case "DENIED":
        return (
          <span className="badge bg-danger bg-opacity-10 text-danger border border-danger px-3 py-2 rounded-pill">
            Cancelled <i className="fa fa-times-circle ms-1"></i>
          </span>
        );
      default:
        return (
          <span className="badge bg-secondary px-3 py-2 rounded-pill">
            {status}
          </span>
        );
    }
  };

  const filteredBookings =
    activeTab === "ALL"
      ? bookings
      : bookings.filter(
          (b) => getNormalizedStatus(b.booking_status) === activeTab
        );

  if (isLoading || loadingData) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="spinner-border"
          style={{ color: brandColor }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      {/* Header Banner */}
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
          {/* --- SIDEBAR CARD --- */}
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
                  {user?.email}
                </h6>
                <p className="text-muted small mb-4">Member</p>

                <div className="d-grid gap-2 text-start">
                  <Link
                    to="/profile"
                    className="btn btn-white text-muted d-flex align-items-center justify-content-between hover-bg-light"
                  >
                    <span>
                      <i className="fa fa-user-circle me-2"></i> Profile
                    </span>
                  </Link>

                  <button className="btn btn-light fw-bold text-dark d-flex align-items-center justify-content-between active">
                    <span>
                      <i className="fa fa-history me-2 text-muted"></i> History
                    </span>
                    <i className="fa fa-chevron-right small text-muted"></i>
                  </button>
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

          {/* --- MAIN CONTENT --- */}
          <div className="col-lg-9">
            <div className="card border-0 shadow-lg overflow-hidden h-100">
              <div className="card-header bg-white p-4 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                  <h4 className="fw-bold font-playfair mb-1">
                    Booking History
                  </h4>
                  <p className="text-muted small mb-0">
                    Track your past and upcoming reservations.
                  </p>
                </div>

                {/* Tabs */}
                <ul className="nav nav-pills custom-tabs d-flex gap-2">
                  {["ALL", "PENDING", "ACCEPTED", "DENIED"].map((tab) => (
                    <li className="nav-item" key={tab}>
                      <button
                        className={`btn btn-sm rounded-pill px-3 fw-bold ${
                          activeTab === tab
                            ? "text-white shadow-sm"
                            : "text-muted bg-light"
                        }`}
                        style={
                          activeTab === tab
                            ? { backgroundColor: brandColor }
                            : {}
                        }
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab === "ALL"
                          ? "All"
                          : tab.charAt(0) + tab.slice(1).toLowerCase()}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-body p-0 bg-light">
                {filteredBookings.length > 0 ? (
                  <div
                    className="list-group list-group-flush"
                    style={{
                      maxHeight: "450px", // Limits height to approx 3 items
                      overflowY: "auto", // Enables vertical scroll
                    }}
                  >
                    {filteredBookings.map((booking) => {
                      const restaurant = getRestaurantDetails(
                        booking.restaurant_id
                      );
                      const { day, time } = formatDate(
                        booking.reservation_time
                      );

                      return (
                        <div
                          key={booking.booking_id}
                          className="list-group-item p-4 border-bottom hover-bg-white transition-all"
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <div className="row align-items-center g-4">
                            {/* Image Section */}
                            <div className="col-md-3 col-lg-2">
                              <img
                                src={
                                  restaurant?.picture ||
                                  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                }
                                alt={restaurant?.name || "Restaurant"}
                                className="img-fluid rounded-3 shadow-sm object-fit-cover"
                                style={{
                                  height: "80px",
                                  width: "100%",
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?text=No+Image";
                                }}
                              />
                            </div>

                            {/* Info Section */}
                            <div className="col-md-6 col-lg-6">
                              <div className="d-flex justify-content-between align-items-start mb-1">
                                <h5 className="fw-bold font-playfair mb-0 text-dark">
                                  {restaurant?.name || "Unknown Restaurant"}
                                </h5>
                              </div>

                              <div className="text-muted small mb-2">
                                <span className="me-3">
                                  <i className="fa fa-calendar me-2 text-primary opacity-75"></i>
                                  {day}
                                </span>
                                <span className="me-3">
                                  <i className="fa fa-clock-o me-2 text-primary opacity-75"></i>
                                  {time}
                                </span>
                                <span>
                                  <i className="fa fa-user me-2 text-primary opacity-75"></i>
                                  {booking.num_of_guests} Guests
                                </span>
                              </div>

                              {booking.note && (
                                <div className="bg-white p-2 rounded border small text-muted fst-italic text-truncate">
                                  <i className="fa fa-quote-left me-2 opacity-50"></i>
                                  {booking.note}
                                </div>
                              )}
                            </div>

                            {/* Status Section */}
                            <div className="col-md-3 col-lg-4 text-md-end">
                              <div className="mb-2">
                                {getStatusBadge(booking.booking_status)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <i className="fa fa-calendar-times-o fa-3x text-muted opacity-25"></i>
                    </div>
                    <h5 className="fw-bold text-muted">No bookings found</h5>
                    <p className="text-muted mb-4 small">
                      {activeTab === "ALL"
                        ? "You haven't made any reservations yet."
                        : `You have no ${activeTab.toLowerCase()} bookings.`}
                    </p>
                    <Link
                      to="/restaurants/all"
                      className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm btn-sm"
                      style={{
                        backgroundColor: brandColor,
                        borderColor: brandColor,
                      }}
                    >
                      Find a Table
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- DETAIL POPUP MODAL --- */}
      {selectedBooking && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
            animation: "fadeIn 0.2s",
          }}
          onClick={closePopup}
        >
          <div
            className="bg-white rounded-4 shadow-lg overflow-hidden"
            style={{ width: "90%", maxWidth: "500px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom bg-light">
              <h5 className="fw-bold font-playfair mb-0">
                {isEditing ? "Edit Booking" : "Booking Details"}
              </h5>
              <button
                className="btn btn-link text-dark p-0 text-decoration-none"
                onClick={closePopup}
              >
                <i className="fa fa-times fa-lg"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div
              className="p-4"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              {!isEditing ? (
                /* READ ONLY VIEW */
                <>
                  <div className="text-center mb-4">
                    <h4 className="fw-bold text-primary mb-1">
                      {
                        getRestaurantDetails(selectedBooking.restaurant_id)
                          ?.name
                      }
                    </h4>
                    <div className="mb-3">
                      {getStatusBadge(selectedBooking.booking_status)}
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="text-uppercase small fw-bold text-muted">
                        Full Name
                      </label>
                      <p className="mb-0 fs-5">{selectedBooking.name}</p>
                    </div>
                    <div className="col-4">
                      <label className="text-uppercase small fw-bold text-muted">
                        Phone
                      </label>
                      <p className="mb-0">
                        <i className="fa fa-phone me-1 text-secondary"></i>
                        {selectedBooking.phone}
                      </p>
                    </div>
                    <div className="col-8">
                      <label className="text-uppercase small fw-bold text-muted">
                        Email
                      </label>
                      <p className="mb-0 text-truncate">
                        <i className="fa fa-envelope me-1 text-secondary"></i>
                        {selectedBooking.email}
                      </p>
                    </div>
                    <div className="col-4">
                      <label className="text-uppercase small fw-bold text-muted">
                        Guests
                      </label>
                      <p className="mb-0">
                        <i className="fa fa-users me-1 text-secondary"></i>
                        {selectedBooking.num_of_guests} People
                      </p>
                    </div>
                    <div className="col-8">
                      <label className="text-uppercase small fw-bold text-muted">
                        Date & Time
                      </label>
                      <p className="mb-0">
                        <span className="me-3">
                          <i className="fa fa-calendar me-1 text-secondary"></i>
                          {formatDate(selectedBooking.reservation_time).day}
                        </span>

                        {/* Display Time */}
                        <span className="text-nowrap">
                          <i className="fa fa-clock-o me-1 text-secondary"></i>
                          {formatDate(selectedBooking.reservation_time).time}
                        </span>
                      </p>
                    </div>
                    <div className="col-12">
                      <label className="text-uppercase small fw-bold text-muted">
                        Special Request
                      </label>
                      <div className="bg-light p-3 rounded border text-secondary fst-italic">
                        {selectedBooking.note || "No special requests"}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* EDIT FORM VIEW */
                <form className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={editFormData.name || ""}
                      onChange={handleEdit}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={editFormData.phone || ""}
                      onChange={handleEdit}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">
                      Guests
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="num_of_guests"
                      min={1}
                      max={20}
                      value={editFormData.num_of_guests || 1}
                      onChange={handleEdit}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="reservation_time"
                      value={getDateTimeLocalForInput(
                        editFormData.reservation_time as string
                      )}
                      onChange={(e) => {
                        setEditFormData((prev) => ({
                          ...prev,
                          reservation_time: e.target.value,
                        }));
                      }}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted">
                      Note
                    </label>
                    <textarea
                      className="form-control"
                      name="note"
                      rows={3}
                      value={editFormData.note || ""}
                      onChange={handleEdit}
                    ></textarea>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-top d-flex gap-3 bg-light">
              {!isEditing ? (
                <>
                  <button
                    className="btn btn-outline-primary flex-grow-1 fw-bold"
                    onClick={() => handleEditClick(selectedBooking)}
                    disabled={
                      selectedBooking.booking_status === "REJECTED" ||
                      selectedBooking.booking_status === "ACCEPTED"
                    }
                  >
                    <i className="fa fa-pencil me-2"></i> Update
                  </button>
                  <button
                    className="btn btn-danger flex-grow-1 fw-bold"
                    onClick={() => handleDelete(selectedBooking.booking_id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <i className="fa fa-spinner fa-spin"></i>
                    ) : (
                      <>
                        <i className="fa fa-trash me-2"></i> Delete
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-secondary flex-grow-1 fw-bold"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary flex-grow-1 fw-bold"
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    style={{
                      backgroundColor: brandColor,
                      borderColor: brandColor,
                    }}
                  >
                    {isSaving ? (
                      <i className="fa fa-spinner fa-spin me-2"></i>
                    ) : (
                      <i className="fa fa-save me-2"></i>
                    )}
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default BookingHistory;