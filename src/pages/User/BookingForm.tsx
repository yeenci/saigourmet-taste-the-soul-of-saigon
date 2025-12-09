/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  useSearchParams,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiRequest, fetchRestaurantsData } from "../../lib/utils";
import type { Restaurant } from "../../lib/types";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AttentionModal from "../../components/modals/AttentionModal";
import SuccessModal from "../../components/modals/SuccessModal";
import ErrorModal from "../../components/modals/ErrorModal";

interface ModalConfig {
  type: "success" | "error" | "attention" | null;
  title: string;
  content: string;
  button: string;
  path?: string; // Primary path
  onConfirm?: () => void; // For actions that don't just navigate (like Try Again)
  secondaryPath?: string;
  secondaryButton?: string;
}

const BookingForm: React.FC = () => {
  const { user, token } = useAuth();

  const [searchParams] = useSearchParams();
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  // Specific state for the Login Interception Modal
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Unified state for Result Modals (Success, Error, Attention)
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    type: null,
    title: "",
    content: "",
    button: "",
  });

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [timeError, setTimeError] = useState<string>("");

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    restaurantName: "",
    name: "",
    phone: "",
    email: "",
    time: "",
    guests: 2,
    note: "",
    booking_status: -1,
  });

  // Fetch restaurant details
  useEffect(() => {
    const loadRestaurantDetails = async () => {
      if (!restaurantId) return;
      const data = await fetchRestaurantsData();
      if (data) {
        const found = data.find((r) => String(r.restaurantId) === restaurantId);
        if (found) {
          setRestaurant(found);
          if (!searchParams.get("restaurant_name")) {
            setFormData((prev) => ({ ...prev, restaurantName: found.name }));
          }
        }
      }
    };
    loadRestaurantDetails();
  }, [restaurantId, searchParams]);

  useEffect(() => {
    const savedDraft = sessionStorage.getItem("bookingFormDraft");
    if (savedDraft) {
      const parsedDraft = JSON.parse(savedDraft);
      setFormData((prev) => ({ ...prev, ...parsedDraft }));
    }

    const rName = searchParams.get("restaurant_name");
    if (rName) {
      setFormData((prev) => ({
        ...prev,
        restaurantName: decodeURIComponent(rName),
      }));
    }

    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.email.split("@")[0],
        email: user.email,
        phone: user.phone_number || prev.phone,
      }));
    }
  }, [searchParams, user]);

  // --- TIME VALIDATION LOGIC ---
  const validateTime = (selectedTimeStr: string) => {
    if (!selectedTimeStr) return;

    const selectedDate = new Date(selectedTimeStr);
    const now = new Date();

    const diffInMs = selectedDate.getTime() - now.getTime();
    const diffInMinutes = diffInMs / (1000 * 60);

    if (diffInMinutes < 60) {
      setTimeError(
        "Please book at least 1 hour in advance from the current time."
      );
      return false;
    }

    if (!restaurant) return true;

    const selectedMinutesOfDay =
      selectedDate.getHours() * 60 + selectedDate.getMinutes();

    const [openH, openM] = restaurant.openTime.split(":").map(Number);
    const openMinutes = openH * 60 + openM;

    const [closeH, closeM] = restaurant.closeTime.split(":").map(Number);
    let closeMinutes = closeH * 60 + closeM;

    if (closeMinutes < openMinutes) {
      closeMinutes += 24 * 60;
    }

    if (selectedMinutesOfDay < openMinutes) {
      setTimeError(
        `Restaurant is not open yet. Opens at ${restaurant.openTime}.`
      );
      return false;
    }

    if (selectedMinutesOfDay >= closeMinutes) {
      setTimeError(`Restaurant is closed. Closes at ${restaurant.closeTime}.`);
      return false;
    }

    if (closeMinutes - selectedMinutesOfDay < 60) {
      setTimeError(
        `Please select a time at least 1 hour before closing (${restaurant.closeTime}) to allow for service.`
      );
      return false;
    }

    setTimeError("");
    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "time") {
      validateTime(value);
    }
  };

  const handleLoginRedirect = () => {
    sessionStorage.setItem("bookingFormDraft", JSON.stringify(formData));
    const returnPath = location.pathname + location.search;
    navigate("/login", { state: { from: returnPath } });
  };

  const closeModal = () => {
    setModalConfig({ ...modalConfig, type: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (timeError) {
      setModalConfig({
        type: "error",
        title: "Invalid Time",
        content: "Please fix the reservation time error before confirming.",
        button: "Okay",
        onConfirm: closeModal,
      });
      return;
    }

    if (!validateTime(formData.time)) {
      return;
    }

    if (!user || !token) {
      setShowLoginModal(true);
      return;
    }

    // --- CASE: Invalid Restaurant ID ---
    if (!restaurantId || restaurantId === "undefined") {
      setModalConfig({
        type: "attention",
        title: "Missing Information",
        content: "Invalid Restaurant ID. We cannot proceed with the booking.",
        button: "Go Back",
        path: "/restaurants", // Return to list
        secondaryButton: "Home",
        secondaryPath: "/",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await apiRequest("/user/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          reservation_time: new Date(formData.time).toISOString(),
          num_of_guests: Number(formData.guests),
          note: formData.note,
        }),
      });

      // --- CASE: Success ---
      if (response.ok || response.status === 200 || response.status === 201) {
        sessionStorage.removeItem("bookingFormDraft");

        setModalConfig({
          type: "success",
          title: "Booking Confirmed!",
          content: `Your table at ${formData.restaurantName} has been reserved successfully.`,
          button: "View My Bookings",
          path: "/booking-history",
          secondaryButton: "Back to Home",
          secondaryPath: "/",
        });
      } else {
        // --- CASE: API Error ---
        const data = await response.json();
        console.error("Booking Error:", data);

        setModalConfig({
          type: "error",
          title: "Booking Failed",
          content:
            data.detail ||
            "We couldn't process your reservation. Please try again.",
          button: "Try Again",
          onConfirm: closeModal, // Close modal to let user fix form
          secondaryButton: "Cancel & Exit",
          secondaryPath: "/restaurants",
        });
      }
    } catch (error) {
      // --- CASE: Network/Unexpected Error ---
      console.error(error);
      setModalConfig({
        type: "error",
        title: "Connection Error",
        content:
          "A network error occurred. Please check your connection and try again.",
        button: "Try Again",
        onConfirm: closeModal, // Close modal to let user retry
        secondaryButton: "Back to Home",
        secondaryPath: "/",
      });
    } finally {
      setLoading(false);
    }
  };

  if (user && user.isAdmin) {
    return (
      <AttentionModal
        title="Administrator Access"
        content="Administrator accounts are restricted from creating personal reservations. Please log in with a customer account to continue."
        button="Return to Home"
        path="/"
      />
    );
  }

  if (showLoginModal) {
    return (
      <AttentionModal
        title="Hold On!"
        content="Please log in first to continue booking your table. We'll save your progress."
        button="Login & Continue"
        onConfirm={handleLoginRedirect}
        secondaryButton="Cancel"
        secondaryPath={location.pathname} // Stays here but logic essentially cancels flow
      />
    );
  }

  // Helper to render the active result modal
  const renderResultModal = () => {
    if (!modalConfig.type) return null;

    if (modalConfig.type === "success") {
      return (
        <SuccessModal
          title={modalConfig.title}
          content={modalConfig.content}
          button={modalConfig.button}
          path={modalConfig.path || "/"}
          secondaryButton={modalConfig.secondaryButton}
          secondaryPath={modalConfig.secondaryPath}
        />
      );
    }

    if (modalConfig.type === "error") {
      return (
        <ErrorModal
          title={modalConfig.title}
          content={modalConfig.content}
          button={modalConfig.button}
          path={modalConfig.path}
          onConfirm={modalConfig.onConfirm}
          secondaryButton={modalConfig.secondaryButton}
          secondaryPath={modalConfig.secondaryPath}
        />
      );
    }

    if (modalConfig.type === "attention") {
      return (
        <AttentionModal
          title={modalConfig.title}
          content={modalConfig.content}
          button={modalConfig.button}
          path={modalConfig.path}
          onConfirm={modalConfig.onConfirm}
          secondaryButton={modalConfig.secondaryButton}
          secondaryPath={modalConfig.secondaryPath}
        />
      );
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      {/* Render the unified modal if active */}
      {renderResultModal()}

      <div
        className="flex-grow-1 d-flex align-items-center py-5"
        style={{
          backgroundImage:
            'url("https://www.transparenttextures.com/patterns/cubes.png")',
          backgroundColor: "#f8f9fa",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card border-0 shadow-lg overflow-hidden rounded-3">
                <div className="row g-0">
                  <div className="col-md-5 d-none d-md-block position-relative">
                    <img
                      src={
                        restaurant?.picture ||
                        "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80"
                      }
                      alt="Restaurant Interior"
                      className="w-100 h-100 object-fit-cover"
                      style={{ filter: "brightness(0.7)" }}
                    />
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center p-5 text-white">
                      <h4 className="font-playfair display-6 mb-3">
                        Reservation Summary
                      </h4>
                      <div className="mb-4">
                        <small className="text-uppercase ls-1 opacity-75">
                          Restaurant
                        </small>
                        <h3 className="fw-bold">
                          {formData.restaurantName || "Loading..."}
                        </h3>
                        {/* Show Open Hours Hint */}
                        {restaurant && (
                          <p className="small text-white-50">
                            Open: {restaurant.openTime} - {restaurant.closeTime}
                          </p>
                        )}
                      </div>
                      <div className="d-flex gap-3 mb-4">
                        <div>
                          <small className="text-uppercase ls-1 opacity-75 d-block">
                            Guests
                          </small>
                          <span className="fs-4 fw-bold">
                            <i className="fa fa-users me-2"></i>
                            {formData.guests}
                          </span>
                        </div>
                      </div>
                      <p className="small opacity-75 mt-auto">
                        *Please arrive within 15 minutes of your reservation
                        time.
                      </p>
                    </div>
                  </div>

                  <div className="col-md-7 bg-white p-5">
                    <div className="d-flex align-items-center mb-4">
                      <div
                        className="bg-warning rounded-circle d-flex align-items-center justify-content-center text-white me-3"
                        style={{ width: "50px", height: "50px" }}
                      >
                        <i className="fa fa-calendar-check-o fs-4"></i>
                      </div>
                      <div>
                        <h3 className="fw-bold font-playfair mb-0">
                          Secure your table
                        </h3>
                        <p className="text-muted small mb-0">
                          Fill in your details below
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="row g-3">
                        <div className="col-12">
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control bg-light border-0"
                              id="name"
                              placeholder="Your Name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                            />
                            <label htmlFor="name" className="text-muted">
                              Full Name
                            </label>
                          </div>
                        </div>

                        <div className="col-md-5">
                          <div className="form-floating">
                            <input
                              type="tel"
                              className="form-control bg-light border-0"
                              id="phone"
                              placeholder="Phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                            />
                            <label htmlFor="phone" className="text-muted">
                              Phone Number
                            </label>
                          </div>
                        </div>
                        <div className="col-md-7">
                          <div className="form-floating">
                            <input
                              type="email"
                              className="form-control bg-light border-0"
                              id="email"
                              placeholder="Email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              disabled={!!user}
                            />
                            <label htmlFor="email" className="text-muted">
                              Email Address
                            </label>
                          </div>
                        </div>
                        <div className="col-md-7">
                          <div className="form-floating">
                            <input
                              type="datetime-local"
                              className={`form-control border-0 ${
                                timeError
                                  ? "bg-danger bg-opacity-10"
                                  : "bg-light"
                              }`}
                              id="datetime"
                              placeholder="Date & Time"
                              name="time"
                              min={getCurrentDateTime()}
                              value={formData.time}
                              onChange={handleChange}
                              required
                            />
                            <label htmlFor="datetime" className="text-muted">
                              Date & Time
                            </label>
                          </div>
                        </div>
                        <div className="col-md-5">
                          <div className="form-floating">
                            <input
                              type="number"
                              className="form-control bg-light border-0"
                              id="guests"
                              name="guests"
                              value={formData.guests}
                              onChange={handleChange}
                              min={1}
                              max={20}
                              required
                            />
                            <label htmlFor="guests" className="text-muted">
                              Num. of Guests
                            </label>
                          </div>
                        </div>

                        <div className="col-12 mt-3">
                          <div className="form-floating">
                            <textarea
                              className="form-control bg-light border-0"
                              placeholder="Notes"
                              id="note"
                              style={{ height: "100px" }}
                              name="note"
                              value={formData.note}
                              onChange={handleChange}
                            ></textarea>
                            <label htmlFor="note" className="text-muted">
                              Special Requests
                            </label>
                          </div>
                        </div>

                        {/* Error Message Display (Inline) */}
                        {timeError && (
                          <div className="text-danger small mt-2 ms-1">
                            <i className="fa fa-exclamation-circle me-1"></i>
                            {timeError}
                          </div>
                        )}
                        <div className="col-12 mt-2">
                          <button
                            type="submit"
                            className="btn btn-primary w-100 py-3 fw-bold shadow-sm hover-scale"
                            style={{
                              backgroundColor: "#b2744c",
                              borderColor: "#b2744c",
                              borderRadius: "50px",
                            }}
                            disabled={loading || !!timeError}
                          >
                            {loading ? (
                              <span>
                                <i className="fa fa-spinner fa-spin me-2"></i>
                                Processing...
                              </span>
                            ) : (
                              <span>Confirm Reservation</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingForm;
