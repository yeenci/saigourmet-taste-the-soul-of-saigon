import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About: React.FC = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <div 
                className="position-relative d-flex align-items-center justify-content-center text-center"
                style={{
                    height: '400px',
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1920&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="container text-white" style={{ zIndex: 2 }}>
                    <span className="badge bg-warning text-dark mb-3 text-uppercase fw-bold ls-1 px-3 py-2">Our Story</span>
                    <h1 className="display-3 fw-bold font-playfair mb-3">About SaiGourmet</h1>
                    <p className="lead opacity-90 fs-4">Connecting food lovers with the soul of Saigon's culinary scene.</p>
                </div>
            </div>

            {/* --- MISSION SECTION --- */}
            <section className="py-5 bg-white">
                <div className="container py-4">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <div className="position-relative">
                                <img 
                                    src="https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?auto=format&fit=crop&w=800&q=80" 
                                    alt="Dining Experience" 
                                    className="img-fluid rounded-3 shadow-lg"
                                />
                                <div className="position-absolute bottom-0 start-0 bg-white p-4 rounded-3 shadow-lg m-4 d-none d-md-block" style={{borderLeft: '5px solid #b2744c'}}>
                                    <h5 className="fw-bold font-playfair m-0">"Food is the ingredient that binds us together."</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <small className="text-uppercase text-muted fw-bold ls-1">Who We Are</small>
                            <h2 className="display-5 fw-bold font-playfair mb-4 mt-2">
                                We simplified dining <br/> <span style={{color: '#b2744c'}}>reservations.</span>
                            </h2>
                            <p className="text-secondary fs-5" style={{lineHeight: '1.8'}}>
                                Founded in 2025, SaiGourmet was born from a simple frustration: finding a great table in Saigon was harder than it should be. 
                            </p>
                            <p className="text-muted mb-4">
                                Ho Chi Minh City is a culinary paradise, from street-side plastic stools to Michelin-star fine dining. Our mission is to bridge the gap between hungry diners and the amazing restaurants that feed this city.
                            </p>
                            
                            <div className="row g-4 mb-4">
                                <div className="col-6">
                                    <div className="d-flex align-items-center">
                                        <i className="fa fa-check-circle text-success fs-4 me-3"></i>
                                        <span className="fw-bold">Instant Booking</span>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="d-flex align-items-center">
                                        <i className="fa fa-check-circle text-success fs-4 me-3"></i>
                                        <span className="fw-bold">Curated Venues</span>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="d-flex align-items-center">
                                        <i className="fa fa-check-circle text-success fs-4 me-3"></i>
                                        <span className="fw-bold">Verified Reviews</span>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="d-flex align-items-center">
                                        <i className="fa fa-check-circle text-success fs-4 me-3"></i>
                                        <span className="fw-bold">Exclusive Offers</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- STATS BANNER --- */}
            <section className="py-5" style={{backgroundColor: '#b2744c'}}>
                <div className="container">
                    <div className="row text-center text-white g-4">
                        <div className="col-md-3">
                            <h2 className="display-4 fw-bold font-playfair">500+</h2>
                            <p className="text-uppercase ls-1 opacity-75">Partner Restaurants</p>
                        </div>
                        <div className="col-md-3">
                            <h2 className="display-4 fw-bold font-playfair">10k+</h2>
                            <p className="text-uppercase ls-1 opacity-75">Monthly Diners</p>
                        </div>
                        <div className="col-md-3">
                            <h2 className="display-4 fw-bold font-playfair">24</h2>
                            <p className="text-uppercase ls-1 opacity-75">Districts Covered</p>
                        </div>
                        <div className="col-md-3">
                            <h2 className="display-4 fw-bold font-playfair">4.9</h2>
                            <p className="text-uppercase ls-1 opacity-75">App Store Rating</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- VALUES SECTION --- */}
            <section className="py-5 bg-light">
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <small className="text-uppercase text-muted fw-bold ls-1">Why Choose Us</small>
                        <h2 className="fw-bold display-6 font-playfair mt-2">Our Core Values</h2>
                        <div className="mx-auto mt-3" style={{width: '60px', height: '3px', background: '#b2744c'}}></div>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm p-4 text-center hover-scale">
                                <div className="mb-3">
                                    <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                                        <i className="fa fa-heart fa-2x text-danger"></i>
                                    </div>
                                </div>
                                <h4 className="fw-bold mb-3">Passion for Food</h4>
                                <p className="text-muted">We don't just list restaurants; we celebrate them. Every venue on SaiGourmet is vetted for quality.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm p-4 text-center hover-scale">
                                <div className="mb-3">
                                    <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                                        <i className="fa fa-users fa-2x text-primary"></i>
                                    </div>
                                </div>
                                <h4 className="fw-bold mb-3">Community First</h4>
                                <p className="text-muted">We believe dining is about connection. We build features that help people come together.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm p-4 text-center hover-scale">
                                <div className="mb-3">
                                    <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                                        <i className="fa fa-star fa-2x text-warning"></i>
                                    </div>
                                </div>
                                <h4 className="fw-bold mb-3">Excellence</h4>
                                <p className="text-muted">From our app design to our customer support, we strive for a seamless, premium experience.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="py-5 bg-white">
                <div className="container text-center py-4">
                    <h2 className="display-6 fw-bold font-playfair mb-4">Ready to taste the best of Saigon?</h2>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/restaurants/all" className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow-sm" style={{backgroundColor: '#b2744c', borderColor: '#b2744c'}}>
                            Find a Table
                        </Link>
                        <Link to="/contact" className="btn btn-outline-dark btn-lg rounded-pill px-5 py-3 fw-bold">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;