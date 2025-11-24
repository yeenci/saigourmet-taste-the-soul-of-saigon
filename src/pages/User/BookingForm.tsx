/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const BookingForm: React.FC = () => {
    const [searchParams] = useSearchParams();
    // const { restaurantId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Get current date/time for min attribute to prevent past bookings
    const getCurrentDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const [formData, setFormData] = useState({
        restaurantName: '',
        name: '',
        phone: '',
        email: '',
        time: '',
        guests: 2, // Default to 2 guests
        note: ''
    });

    useEffect(() => {
        const rName = searchParams.get('restaurant_name');
        if (rName) {
            setFormData(prev => ({ ...prev, restaurantName: decodeURIComponent(rName) }));
        }
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // US-10: Booking Flow (Mock API Call)
            // const response = await fetch(`/user/createOrder`, { ... });
            
            // Simulate network delay
            setTimeout(() => {
                alert(`Booking confirmed for ${formData.restaurantName}!\nWe have sent a confirmation to ${formData.email}.`);
                navigate('/');
            }, 1500);
            
        } catch (error) {
            alert('Booking failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Navbar />

            <div className="flex-grow-1 d-flex align-items-center py-5" 
                style={{
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', // Subtle texture
                    backgroundColor: '#f8f9fa'
                }}
            >
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="card border-0 shadow-lg overflow-hidden rounded-3">
                                <div className="row g-0">
                                    
                                    {/* LEFT SIDE: Visuals & Summary */}
                                    <div className="col-md-5 d-none d-md-block position-relative">
                                        <img 
                                            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80" 
                                            alt="Restaurant Interior" 
                                            className="w-100 h-100 object-fit-cover"
                                            style={{ filter: 'brightness(0.7)' }}
                                        />
                                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center p-5 text-white">
                                            <h4 className="font-playfair display-6 mb-3">Reservation Summary</h4>
                                            <div className="mb-4">
                                                <small className="text-uppercase ls-1 opacity-75">Restaurant</small>
                                                <h3 className="fw-bold">{formData.restaurantName || "Loading..."}</h3>
                                            </div>
                                            <div className="d-flex gap-3 mb-4">
                                                <div>
                                                    <small className="text-uppercase ls-1 opacity-75 d-block">Guests</small>
                                                    <span className="fs-4 fw-bold"><i className="fa fa-users me-2"></i>{formData.guests}</span>
                                                </div>
                                                {formData.time && (
                                                    <div>
                                                        <small className="text-uppercase ls-1 opacity-75 d-block">Date & Time</small>
                                                        <span className="fs-5 fw-bold">
                                                            {new Date(formData.time).toLocaleDateString()} <br/>
                                                            {new Date(formData.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="small opacity-75 mt-auto">
                                                *Please arrive within 15 minutes of your reservation time to guarantee seating.
                                            </p>
                                        </div>
                                    </div>

                                    {/* RIGHT SIDE: The Form */}
                                    <div className="col-md-7 bg-white p-5">
                                        <div className="d-flex align-items-center mb-4">
                                            <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center text-white me-3" style={{width: '50px', height: '50px'}}>
                                                <i className="fa fa-calendar-check-o fs-4"></i>
                                            </div>
                                            <div>
                                                <h3 className="fw-bold font-playfair mb-0">Secure your table</h3>
                                                <p className="text-muted small mb-0">Fill in your details below</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleSubmit}>
                                            <div className="row g-3">
                                                
                                                {/* Name */}
                                                <div className="col-12">
                                                    <div className="form-floating">
                                                        <input 
                                                            type="text" className="form-control bg-light border-0" id="name" placeholder="Your Name" 
                                                            name="name" value={formData.name} onChange={handleChange} required 
                                                        />
                                                        <label htmlFor="name" className="text-muted">Full Name</label>
                                                    </div>
                                                </div>

                                                {/* Phone & Email */}
                                                <div className="col-md-6">
                                                    <div className="form-floating">
                                                        <input 
                                                            type="tel" className="form-control bg-light border-0" id="phone" placeholder="Phone" 
                                                            name="phone" value={formData.phone} onChange={handleChange} required 
                                                        />
                                                        <label htmlFor="phone" className="text-muted">Phone Number</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating">
                                                        <input 
                                                            type="email" className="form-control bg-light border-0" id="email" placeholder="Email" 
                                                            name="email" value={formData.email} onChange={handleChange} required 
                                                        />
                                                        <label htmlFor="email" className="text-muted">Email Address</label>
                                                    </div>
                                                </div>

                                                {/* Date/Time & Guests */}
                                                <div className="col-md-7">
                                                    <label className="form-label text-muted small fw-bold ms-1">Date & Time</label>
                                                    <input 
                                                        type="datetime-local" 
                                                        className="form-control form-control-lg bg-light border-0" 
                                                        name="time" 
                                                        min={getCurrentDateTime()}
                                                        value={formData.time} 
                                                        onChange={handleChange} 
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-5">
                                                    <label className="form-label text-muted small fw-bold ms-1">Guests</label>
                                                    <div className="input-group input-group-lg">
                                                        <button 
                                                            type="button" className="btn btn-outline-secondary"
                                                            onClick={() => setFormData(prev => ({...prev, guests: Math.max(1, prev.guests - 1)}))}
                                                        >-</button>
                                                        <input 
                                                            type="number" className="form-control text-center bg-light border-top-0 border-bottom-0" 
                                                            name="guests" value={formData.guests} readOnly
                                                        />
                                                        <button 
                                                            type="button" className="btn btn-outline-secondary"
                                                            onClick={() => setFormData(prev => ({...prev, guests: Math.min(20, prev.guests + 1)}))}
                                                        >+</button>
                                                    </div>
                                                </div>

                                                {/* Notes */}
                                                <div className="col-12 mt-3">
                                                    <div className="form-floating">
                                                        <textarea 
                                                            className="form-control bg-light border-0" placeholder="Notes" id="note" style={{height: '100px'}}
                                                            name="note" value={formData.note} onChange={handleChange}
                                                        ></textarea>
                                                        <label htmlFor="note" className="text-muted">Special Requests (Allergies, Occasion...)</label>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="col-12 mt-4">
                                                    <button 
                                                        type="submit" 
                                                        className="btn btn-primary w-100 py-3 fw-bold shadow-sm hover-scale" 
                                                        style={{backgroundColor: '#b2744c', borderColor: '#b2744c', borderRadius: '50px'}}
                                                        disabled={loading}
                                                    >
                                                        {loading ? (
                                                            <span><i className="fa fa-spinner fa-spin me-2"></i>Processing...</span>
                                                        ) : (
                                                            <span>Confirm Reservation</span>
                                                        )}
                                                    </button>
                                                    <div className="text-center mt-3">
                                                        <button type="button" onClick={() => navigate(-1)} className="btn btn-link text-muted text-decoration-none small">
                                                            Cancel & Go Back
                                                        </button>
                                                    </div>
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