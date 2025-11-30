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

        // 1. Fetch Restaurants (to map ID to Name/Image)
        const restaurantData = await fetchRestaurantsData();
        if (restaurantData) {
          setRestaurants(restaurantData);
        }

        // 2. Fetch User Bookings
        const response = await apiRequest("/user/booking", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Sort by date (newest first)
          const sortedData = Array.isArray(data)
            ? data.sort(
                (a: Booking, b: Booking) =>
                  new Date(b.time).getTime() - new Date(a.time).getTime()
              )
            : [];
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

  // Helper: Get Restaurant Details
  const getRestaurantDetails = (id: string) => {
    return restaurants.find((r) => String(r.restaurantId) === String(id));
  };

  // Helper: Format Date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
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
      return { day: dateString, time: "" };
    }
  };

  // Helper: Get User Initial for Avatar
  const getUserInitial = () => {
    return user?.email ? user.email.charAt(0).toUpperCase() : "U";
  };

  // Helper: Status Badge Styling
  const getStatusBadge = (status: string) => {
    const s = status?.toUpperCase();
    switch (s) {
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
      case "CANCELLED":
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

  // Filter Logic
  const filteredBookings =
    activeTab === "ALL"
      ? bookings
      : bookings.filter(
          (b) => b.booking_status?.toUpperCase() === activeTab
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

      {/* Header Banner - Same as Profile */}
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
                {/* Avatar */}
                <div
                  className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3 shadow-sm border border-3 border-white"
                  style={{
                    width: "80px", // Slightly smaller avatar for narrower sidebar
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
                  {/* Profile Link (Inactive style) */}
                  <Link
                    to="/profile"
                    className="btn btn-white text-muted d-flex align-items-center justify-content-between hover-bg-light"
                  >
                    <span>
                      <i className="fa fa-user-circle me-2"></i> Profile
                    </span>
                  </Link>
                  
                  {/* Booking History Link (Active style) */}
                  <button className="btn btn-light fw-bold text-dark d-flex align-items-center justify-content-between active">
                    <span>
                      <i className="fa fa-history me-2 text-muted"></i> Booking History
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
                  {["ALL", "PENDING", "ACCEPTED"].map((tab) => (
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
                  <div className="list-group list-group-flush">
                    {filteredBookings.map((booking) => {
                      const restaurant = getRestaurantDetails(
                        booking.restaurant_id
                      );
                      const { day, time } = formatDate(booking.time);

                      return (
                        <div
                          key={booking.booking_id}
                          className="list-group-item p-4 border-bottom hover-bg-white transition-all"
                        >
                          <div className="row align-items-center g-4">
                            {/* Image Section */}
                            <div className="col-md-3 col-lg-2">
                              <img
                                src={
                                  restaurant?.picture ||
                                  "https://via.placeholder.com/150"
                                }
                                alt={restaurant?.name || "Restaurant"}
                                className="img-fluid rounded-3 shadow-sm object-fit-cover"
                                style={{
                                  height: "80px",
                                  width: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </div>

                            {/* Info Section */}
                            <div className="col-md-6 col-lg-6">
                              <div className="d-flex justify-content-between align-items-start mb-1">
                                <h5 className="fw-bold font-playfair mb-0">
                                  <Link
                                    to={`/booking/${booking.restaurant_id}`}
                                    className="text-decoration-none text-dark hover-color-primary"
                                  >
                                    {restaurant?.name || "Unknown Restaurant"}
                                  </Link>
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
                                <div className="bg-white p-2 rounded border small text-muted fst-italic">
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
                              {booking.booking_status === "ACCEPTED" && (
                                <Link
                                  to={`/booking/${booking.restaurant_id}`}
                                  className="btn btn-sm btn-outline-dark rounded-pill"
                                  style={{fontSize: '0.8rem'}}
                                >
                                  Book Again
                                </Link>
                              )}
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

      <Footer />
    </div>
  );
};

export default BookingHistory;