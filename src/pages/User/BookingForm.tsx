/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../lib/utils";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const BookingForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);

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
  });

  useEffect(() => {
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
        phone: user.phoneNumber || "",
      }));
    }
  }, [searchParams, user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user || !token) {
      alert("You must be logged in to book a table.");
      navigate("/login");
      return;
    }

    if (!restaurantId) {
      alert("Restaurant ID missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await apiRequest("/user/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurant_id: restaurantId,
          time: formData.time,
          num_of_guests: Number(formData.guests),
          note: formData.note,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
        }),
      });

      if (response.ok || response.status === 201) {
        alert(`Booking confirmed for ${formData.restaurantName}!`);
        navigate("/profile");
      } else {
        const data = await response.json();
        alert(data.detail || "Booking failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

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
                      src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80"
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
                              className="form-control bg-light border-0"
                              id="datetime"
                              placeholder="Date & Time"
                              name="time"
                              min={getCurrentDateTime()}
                              value={formData.time}
                              onChange={handleChange}
                              required
                              // disabled={!!user}
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
                              onWheel={(e) => {
                                e.preventDefault();
                                setFormData((prev) => ({
                                  ...prev,
                                  guests: Math.min(
                                    20,
                                    Math.max(
                                      1,
                                      Number(prev.guests || 0) +
                                        (e.deltaY < 0 ? 1 : -1)
                                    )
                                  ),
                                }));
                              }}
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

                        <div className="col-12 mt-4">
                          <button
                            type="submit"
                            className="btn btn-primary w-100 py-3 fw-bold shadow-sm hover-scale"
                            style={{
                              backgroundColor: "#b2744c",
                              borderColor: "#b2744c",
                              borderRadius: "50px",
                            }}
                            disabled={loading}
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
