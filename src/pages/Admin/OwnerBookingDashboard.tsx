/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { apiRequest } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

interface Booking {
  booking_id: string;
  customer_name?: string; // API schema says 'customer_name', create says 'name'
  name?: string;          // Fallback
  email: string;
  phone: string;
  reservation_time: string; // or 'time' per different API responses
  time?: string;            // Fallback
  num_of_guests: number;
  note: string;
  booking_status: number | string; // -1: Pending, 1: Accept, 0/2: Reject
}

const OwnerBookingDashboard: React.FC = () => {
  const { restaurantId } = useParams();
  const { token } = useAuth();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<number>(-1); // Default to Pending (-1)

  // Fetch Bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      // API: GET /admin/restaurant/{restaurant_id}/booking?booking_status={status}
      const response = await apiRequest(
        `/admin/restaurant/${restaurantId}/booking?booking_status=${filterStatus}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Ensure data is array
        setBookings(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch bookings");
        // For development fallback if API fails
        setBookings([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantId && token) {
      fetchBookings();
    }
  }, [restaurantId, token, filterStatus]);

  // Handle Accept
  const handleAccept = async (bookingId: string) => {
    if (!window.confirm("Accept this booking?")) return;
    try {
      const response = await apiRequest(`/admin/booking/${bookingId}/accept`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        alert("Booking Accepted!");
        fetchBookings(); // Refresh list
      } else {
        alert("Failed to accept booking.");
      }
    } catch (e) {
      console.error(e);
      alert("Network error.");
    }
  };

  // Handle Reject
  const handleReject = async (bookingId: string) => {
    if (!window.confirm("Reject this booking?")) return;
    try {
      const response = await apiRequest(`/admin/booking/${bookingId}/reject`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        alert("Booking Rejected.");
        fetchBookings(); // Refresh list
      } else {
        alert("Failed to reject booking.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Helper to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      <div className="bg-white border-bottom shadow-sm">
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold font-playfair mb-1">Restaurant Dashboard</h2>
                    <p className="text-muted mb-0">Manage your incoming reservations</p>
                </div>
                <Link to="/profile" className="btn btn-outline-secondary btn-sm">
                    <i className="fa fa-arrow-left me-2"></i> Back to Profile
                </Link>
            </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
            {/* Filter Sidebar / Topbar */}
            <div className="col-12 mb-4">
                <div className="card border-0 shadow-sm p-2 d-inline-block">
                    <div className="d-flex gap-2">
                        <button 
                            className={`btn ${filterStatus === -1 ? 'btn-warning text-dark fw-bold' : 'btn-light text-muted'}`}
                            onClick={() => setFilterStatus(-1)}
                        >
                            Pending Request
                        </button>
                        <button 
                            className={`btn ${filterStatus === 1 ? 'btn-success text-white fw-bold' : 'btn-light text-muted'}`}
                            onClick={() => setFilterStatus(1)}
                        >
                            Confirmed
                        </button>
                        <button 
                            className={`btn ${filterStatus === 0 ? 'btn-danger text-white fw-bold' : 'btn-light text-muted'}`}
                            onClick={() => setFilterStatus(0)}
                        >
                            Rejected
                        </button>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="col-12">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-warning" role="status"></div>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-5 bg-white rounded shadow-sm">
                        <i className="fa fa-calendar-times-o fa-3x text-muted mb-3 opacity-50"></i>
                        <h4>No bookings found</h4>
                        <p className="text-muted">There are no bookings with this status.</p>
                    </div>
                ) : (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                        {bookings.map((booking) => (
                            <div className="col" key={booking.booking_id}>
                                <div className="card h-100 border-0 shadow-sm hover-scale">
                                    <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 className="fw-bold mb-1">{booking.customer_name || booking.name || "Guest"}</h5>
                                            <small className="text-muted"><i className="fa fa-phone me-1"></i> {booking.phone}</small>
                                        </div>
                                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                            <i className="fa fa-user text-secondary"></i>
                                        </div>
                                    </div>
                                    <div className="card-body px-4">
                                        <hr className="my-2 opacity-10"/>
                                        <div className="py-2">
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="fa fa-calendar text-warning me-3" style={{width: '20px'}}></i>
                                                <span className="fw-bold text-dark">
                                                    {formatDate(booking.reservation_time || booking.time)}
                                                </span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="fa fa-users text-warning me-3" style={{width: '20px'}}></i>
                                                <span>{booking.num_of_guests} Guests</span>
                                            </div>
                                            <div className="d-flex align-items-start">
                                                <i className="fa fa-sticky-note text-warning me-3 mt-1" style={{width: '20px'}}></i>
                                                <span className="text-muted small fst-italic">
                                                    "{booking.note || "No special requests"}"
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Action Footer - Only show if status is Pending (-1) */}
                                    {filterStatus === -1 && (
                                        <div className="card-footer bg-white border-0 pb-4 px-4 pt-0">
                                            <div className="d-flex gap-2">
                                                <button 
                                                    className="btn btn-success flex-grow-1 fw-bold"
                                                    onClick={() => handleAccept(booking.booking_id)}
                                                >
                                                    <i className="fa fa-check me-2"></i> Accept
                                                </button>
                                                <button 
                                                    className="btn btn-outline-danger flex-grow-1 fw-bold"
                                                    onClick={() => handleReject(booking.booking_id)}
                                                >
                                                    <i className="fa fa-times me-2"></i> Reject
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {/* Status Indicator for other tabs */}
                                    {filterStatus !== -1 && (
                                        <div className="card-footer bg-white border-0 pb-4 px-4 pt-0">
                                            <div className={`alert ${filterStatus === 1 ? 'alert-success' : 'alert-danger'} mb-0 py-2 text-center fw-bold`}>
                                                {filterStatus === 1 ? 'Confirmed' : 'Rejected'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OwnerBookingDashboard;