import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            alert("Thank you! Your message has been sent. We will get back to you shortly.");
            setFormData({ name: '', email: '', subject: '', message: '' });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Navbar />

            {/* --- HERO SECTION --- */}
            <div 
                className="position-relative d-flex align-items-center justify-content-center text-center"
                style={{
                    height: '350px',
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1920&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="container text-white" style={{ zIndex: 2 }}>
                    <span className="badge bg-warning text-dark mb-3 text-uppercase fw-bold ls-1 px-3 py-2">Support</span>
                    <h1 className="display-3 fw-bold font-playfair mb-3">Get in Touch</h1>
                    <p className="lead opacity-90 fs-4">Questions? Partnership inquiries? We're here to help.</p>
                </div>
            </div>

            <div className="container py-5 mt-n5" style={{marginTop: '-50px', position: 'relative', zIndex: 5}}>
                
                {/* --- INFO CARDS --- */}
                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100 text-center py-4 hover-scale">
                            <div className="card-body">
                                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                                    <i className="fa fa-map-marker fs-3" style={{color: '#b2744c'}}></i>
                                </div>
                                <h5 className="fw-bold font-playfair">Visit Us</h5>
                                <p className="text-muted small mb-0">123 Nguyen Hue Street,<br/>District 1, Ho Chi Minh City</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100 text-center py-4 hover-scale">
                            <div className="card-body">
                                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                                    <i className="fa fa-envelope fs-3" style={{color: '#b2744c'}}></i>
                                </div>
                                <h5 className="fw-bold font-playfair">Email Us</h5>
                                <p className="text-muted small mb-0">support@vinatable.com<br/>partners@vinatable.com</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100 text-center py-4 hover-scale">
                            <div className="card-body">
                                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                                    <i className="fa fa-phone fs-3" style={{color: '#b2744c'}}></i>
                                </div>
                                <h5 className="fw-bold font-playfair">Call Us</h5>
                                <p className="text-muted small mb-0">+84 90 123 4567<br/>Mon - Fri, 9am - 6pm</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CONTACT FORM & MAP --- */}
                <div className="row g-4">
                    
                    {/* Form Section */}
                    <div className="col-lg-7">
                        <div className="card border-0 shadow-lg h-100">
                            <div className="card-body p-5">
                                <h3 className="fw-bold font-playfair mb-4">Send us a message</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input 
                                                    type="text" className="form-control bg-light border-0" id="name" placeholder="Name"
                                                    name="name" value={formData.name} onChange={handleChange} required 
                                                />
                                                <label htmlFor="name">Your Name</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input 
                                                    type="email" className="form-control bg-light border-0" id="email" placeholder="Email"
                                                    name="email" value={formData.email} onChange={handleChange} required 
                                                />
                                                <label htmlFor="email">Your Email</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <input 
                                                    type="text" className="form-control bg-light border-0" id="subject" placeholder="Subject"
                                                    name="subject" value={formData.subject} onChange={handleChange} required 
                                                />
                                                <label htmlFor="subject">Subject</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <textarea 
                                                    className="form-control bg-light border-0" placeholder="Message" id="message" style={{height: '150px'}}
                                                    name="message" value={formData.message} onChange={handleChange} required
                                                ></textarea>
                                                <label htmlFor="message">How can we help?</label>
                                            </div>
                                        </div>
                                        <div className="col-12 text-end mt-4">
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary px-5 py-3 fw-bold rounded-pill shadow-sm"
                                                style={{backgroundColor: '#b2744c', borderColor: '#b2744c'}}
                                                disabled={loading}
                                            >
                                                {loading ? <span>Sending...</span> : <span>Send Message <i className="fa fa-paper-plane ms-2"></i></span>}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="col-lg-5">
                        <div className="card border-0 shadow-lg h-100 overflow-hidden">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.424237128526!2d106.69874831480079!3d10.778782292319767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f487e467e23%3A0x633d74c86b1b70c6!2sNotre%20Dame%20Cathedral%20of%20Saigon!5e0!3m2!1sen!2s!4v1626232742935!5m2!1sen!2s" 
                                style={{border: 0, width: '100%', height: '100%', minHeight: '400px'}} 
                                allowFullScreen={true} 
                                loading="lazy"
                                title="VinaTable Location"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;