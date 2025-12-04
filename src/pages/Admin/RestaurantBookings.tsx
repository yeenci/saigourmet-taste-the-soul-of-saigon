/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { apiRequest, fetchRestaurantsData } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import type { Booking } from "../../lib/types";

const RestaurantBookings: React.FC = () => {
  const { restaurantId } = useParams();
  const { token, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [restaurantName, setRestaurantName] = useState<string>("");

  // Modal State
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const brandColor = "#b2744c";

  // Helper to normalize status to number
  const normalizeStatus = (status: any): number => {
    // If it's already a number or a numeric string (e.g. "1", "-1")
    const num = Number(status);
    if (!isNaN(num) && typeof status !== "string") return num;

    // Check string values
    const s = String(status).toLowerCase();
    if (s === "confirmed" || s === "accepted" || s === "1") return 1;
    if (s === "rejected" || s === "denied" || s === "0") return 0;
    if (s === "pending" || s === "-1") return -1;

    return -1;
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user || !user.isAdmin) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  // Fetch Restaurant Name
  useEffect(() => {
    const loadRestaurantName = async () => {
      const data = await fetchRestaurantsData();
      if (data && restaurantId) {
        const found = data.find(
          (r: any) => r.restaurantId === restaurantId || r.id === restaurantId
        );
        if (found) setRestaurantName(found.name);
      }
    };
    loadRestaurantName();
  }, [restaurantId]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let url = `/admin/restaurant/${restaurantId}/booking`;

      // Define target status for API and Client-side check
      let targetStatus: number | null = null;
      if (filterStatus === "pending") targetStatus = -1;
      if (filterStatus === "confirmed" || filterStatus === "accepted")
        targetStatus = 1;
      if (filterStatus === "rejected") targetStatus = 0;

      // Append to URL if not 'all'
      if (targetStatus !== null) {
        url += `?booking_status=${targetStatus}`;
      }

      const response = await apiRequest(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const result = await response.json();
        let dataArray = Array.isArray(result) ? result : result.data || [];

        // --- FIX: Client-side Filtering Fallback ---
        // Some backends treat param=0 as false/null and return all data.
        // We filter here to ensure the view is correct.
        if (targetStatus !== null) {
          dataArray = dataArray.filter((b: any) => {
            return normalizeStatus(b.booking_status) === targetStatus;
          });
        }
        // -------------------------------------------

        // Sort by date (newest first)
        const sorted = dataArray.sort(
          (a: any, b: any) =>
            new Date(b.reservation_time).getTime() -
            new Date(a.reservation_time).getTime()
        );
        setBookings(Array.isArray(sorted) ? sorted : []);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error(error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.isAdmin && restaurantId && token) {
      fetchBookings();
    }
  }, [restaurantId, token, filterStatus, authLoading, user]);

  const handleAction = async (
    bookingId: string,
    action: "accept" | "reject",
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();

    if (
      !window.confirm(
        `${action === "accept" ? "Accept" : "Reject"} this booking?`
      )
    )
      return;

    setProcessingId(bookingId);
    try {
      const response = await apiRequest(
        `/admin/booking/${bookingId}/${action}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        if (selectedBooking?.booking_id === bookingId) setSelectedBooking(null);
        fetchBookings(); // Refresh list
      } else {
        const err = await response.json();
        alert(err.detail || `Failed to ${action} booking.`);
      }
    } catch (e) {
      console.error(e);
      alert("Network error.");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return {
        day: d.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        time: d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } catch {
      return { day: "N/A", time: "" };
    }
  };

  if (authLoading) return null;

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      {/* --- HEADER GRADIENT WITH BREADCRUMBS --- */}
      <div
        className="position-relative d-flex align-items-center"
        style={{
          height: "260px",
          background: `linear-gradient(135deg, ${brandColor} 0%, #d4956a 100%)`,
        }}
      >
        <div className="container pb-5">
          {/* Breadcrumbs */}
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-3">
              <li className="breadcrumb-item">
                <Link
                  to="/admin/dashboard"
                  className="text-white text-decoration-none opacity-75 hover-opacity-100"
                >
                  Dashboard
                </Link>
              </li>
              <li
                className="breadcrumb-item active text-white fw-bold"
                aria-current="page"
              >
                Bookings
              </li>
            </ol>
          </nav>

          {/* Page Title */}
          <h2 className="display-5 fw-bold text-white font-playfair mb-2">
            Booking Management
          </h2>
          <div className="text-white text-opacity-90 lead fs-6 mb-0 d-flex flex-wrap align-items-center gap-2">
            <span className="fw-bold">{restaurantName || "Loading..."}</span>
            <span className="opacity-50 mx-1">|</span>
            <small className="opacity-75 font-monospace bg-white bg-opacity-10 px-2 py-1 rounded">
              ID: {restaurantId}
            </small>
          </div>
        </div>
      </div>

      <div
        className="container flex-grow-1"
        style={{ marginTop: "-80px", marginBottom: "60px" }}
      >
        <div className="card border-0 shadow-lg overflow-hidden h-100">
          {/* --- CARD HEADER --- */}
          <div className="card-header bg-white p-4 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h4 className="fw-bold font-playfair mb-1">Request List</h4>
              <p className="text-muted small mb-0">
                Review and update reservation status.
              </p>
            </div>

            {/* --- TABS --- */}
            <ul className="nav nav-pills custom-tabs d-flex gap-2 flex-wrap">
              {[
                { id: "all", label: "All" },
                { id: "pending", label: "Pending" },
                { id: "confirmed", label: "Accepted" },
                { id: "rejected", label: "Rejected" },
              ].map((tab) => (
                <li className="nav-item" key={tab.id}>
                  <button
                    className={`btn btn-sm rounded-pill px-3 fw-bold ${
                      filterStatus === tab.id
                        ? "text-white shadow-sm"
                        : "text-muted bg-light"
                    }`}
                    style={
                      filterStatus === tab.id
                        ? { backgroundColor: brandColor }
                        : {}
                    }
                    onClick={() => setFilterStatus(tab.id)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* --- LIST BODY --- */}
          <div className="card-body p-0 bg-light">
            {loading ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border"
                  style={{ color: brandColor }}
                  role="status"
                ></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="fa fa-inbox fa-3x text-muted opacity-25"></i>
                </div>
                <h5 className="fw-bold text-muted">No bookings found</h5>
                <p className="text-muted mb-0 small">
                  {filterStatus === "all"
                    ? "This restaurant has no bookings history."
                    : `There are no ${filterStatus} bookings.`}
                </p>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {bookings.map((booking) => {
                  const { day, time } = formatDate(booking.reservation_time);
                  const displayName = booking.name || "Guest";

                  const status = normalizeStatus(booking.booking_status);
                  const isPending = status === -1;
                  const isAccepted = status === 1;
                  const isRejected = status === 0;

                  return (
                    <div
                      key={booking.booking_id}
                      className="list-group-item p-4 border-bottom hover-bg-white transition-all position-relative"
                      style={{
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                      onClick={() => setSelectedBooking(booking)}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#fafafa")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "white")
                      }
                    >
                      <div className="row align-items-center g-3">
                        {/* Avatar / Icon */}
                        <div className="col-auto">
                          <div
                            className="rounded-circle bg-light d-flex align-items-center justify-content-center text-primary"
                            style={{
                              width: "50px",
                              height: "50px",
                              fontSize: "1.2rem",
                            }}
                          >
                            <i className="fa fa-user"></i>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="col-md-4">
                          <h6 className="fw-bold mb-1 text-dark">
                            {displayName}
                          </h6>
                          <div className="text-muted small">
                            <i className="fa fa-phone me-1 text-secondary opacity-75"></i>{" "}
                            {booking.phone}
                          </div>
                        </div>

                        {/* Date & Guests */}
                        <div className="col-md-3">
                          <div className="d-flex flex-column">
                            <span className="fw-bold text-dark mb-1">
                              <i className="fa fa-calendar me-2 text-warning"></i>{" "}
                              {day}
                            </span>
                            <span className="small text-muted">
                              <i className="fa fa-clock-o me-2"></i> {time}
                              <span className="mx-2">•</span>
                              <i className="fa fa-users me-1"></i>{" "}
                              {booking.num_of_guests}
                            </span>
                          </div>
                        </div>

                        {/* Actions / Status */}
                        <div className="col-md-3 ms-auto text-end">
                          {isPending && (
                            <div className="d-flex justify-content-end gap-2">
                              <button
                                className="btn btn-sm btn-success fw-bold px-3 shadow-sm"
                                onClick={(e) =>
                                  handleAction(booking.booking_id, "accept", e)
                                }
                                disabled={processingId === booking.booking_id}
                                title="Accept"
                              >
                                <i className="fa fa-check"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger fw-bold px-3 shadow-sm"
                                onClick={(e) =>
                                  handleAction(booking.booking_id, "reject", e)
                                }
                                disabled={processingId === booking.booking_id}
                                title="Reject"
                              >
                                <i className="fa fa-times"></i>
                              </button>
                            </div>
                          )}
                          {isAccepted && (
                            <span className="badge px-3 py-2 rounded-pill bg-success bg-opacity-10 text-success border border-success">
                              Accepted
                            </span>
                          )}
                          {isRejected && (
                            <span className="badge px-3 py-2 rounded-pill bg-danger bg-opacity-10 text-danger border border-danger">
                              Rejected
                            </span>
                          )}
                          {/* Fallback for other status */}
                          {!isPending && !isAccepted && !isRejected && (
                            <span className="badge bg-secondary">
                              Unknown ({status})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- DETAIL MODAL --- */}
      {selectedBooking && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-white rounded-4 shadow-lg overflow-hidden animate-up"
            style={{ width: "90%", maxWidth: "500px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom bg-light">
              <h5 className="fw-bold font-playfair mb-0">Booking Details</h5>
              <button
                className="btn-close"
                onClick={() => setSelectedBooking(null)}
              ></button>
            </div>

            <div className="p-4">
              <div className="row g-3">
                <div className="col-12 text-center mb-3">
                  <div className="d-inline-block p-3 rounded-circle bg-light mb-2">
                    <i className="fa fa-user fa-2x text-primary"></i>
                  </div>
                  <h4 className="fw-bold">{selectedBooking.name || "Guest"}</h4>
                  <p className="text-muted small">{selectedBooking.email}</p>

                  <div className="mt-2">
                    {normalizeStatus(selectedBooking.booking_status) === -1 && (
                      <span className="badge bg-warning text-dark">
                        Pending Review
                      </span>
                    )}
                    {normalizeStatus(selectedBooking.booking_status) === 1 && (
                      <span className="badge bg-success">Confirmed</span>
                    )}
                    {normalizeStatus(selectedBooking.booking_status) === 0 && (
                      <span className="badge bg-danger">Rejected</span>
                    )}
                  </div>
                </div>

                <div className="col-6">
                  <label className="text-uppercase small fw-bold text-muted">
                    Date
                  </label>
                  <p className="fw-bold text-dark">
                    {formatDate(selectedBooking.reservation_time).day}
                  </p>
                </div>
                <div className="col-6">
                  <label className="text-uppercase small fw-bold text-muted">
                    Time
                  </label>
                  <p className="fw-bold text-dark">
                    {formatDate(selectedBooking.reservation_time).time}
                  </p>
                </div>
                <div className="col-6">
                  <label className="text-uppercase small fw-bold text-muted">
                    Phone
                  </label>
                  <p className="fw-bold text-dark">{selectedBooking.phone}</p>
                </div>
                <div className="col-6">
                  <label className="text-uppercase small fw-bold text-muted">
                    Guests
                  </label>
                  <p className="fw-bold text-dark">
                    {selectedBooking.num_of_guests} People
                  </p>
                </div>
                <div className="col-12">
                  <label className="text-uppercase small fw-bold text-muted">
                    Note
                  </label>
                  <div className="bg-light p-3 rounded border text-secondary fst-italic">
                    {selectedBooking.note || "No special requests."}
                  </div>
                </div>
              </div>
            </div>

            {normalizeStatus(selectedBooking.booking_status) === -1 && (
              <div className="p-4 border-top bg-light d-flex gap-2">
                <button
                  className="btn btn-outline-danger flex-fill fw-bold py-2"
                  onClick={() =>
                    handleAction(selectedBooking.booking_id, "reject")
                  }
                >
                  Reject
                </button>
                <button
                  className="btn btn-success flex-fill fw-bold py-2 shadow-sm"
                  onClick={() =>
                    handleAction(selectedBooking.booking_id, "accept")
                  }
                >
                  Accept Booking
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RestaurantBookings;
