import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// Define the interface locally if not fully matching global types, 
// or import from types.ts if it matches perfectly.
interface UserProfileData {
    userId: number;
    username: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    address: string;
    profilePictureUrl: string;
    joinDate: string; // Added for UI polish
}

const UserProfile: React.FC = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState<UserProfileData>({
        userId: 0,
        username: '',
        email: '',
        fullName: '',
        phoneNumber: '',
        address: '',
        profilePictureUrl: '',
        joinDate: ''
    });

    useEffect(() => {
        // Simulating API fetch
        setTimeout(() => {
            setFormData({
                userId: 4350,
                username: 'JohnDoe123',
                email: 'johndoe@example.com',
                fullName: 'John Doe',
                phoneNumber: '+84 90 123 4567',
                address: '123 Nguyen Hue, District 1, HCMC',
                profilePictureUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80',
                joinDate: 'November 2023'
            });
            setLoading(false);
        }, 600);
    }, []);

    const handleLogout = () => {
        // Clear tokens here
        navigate('/login');
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            alert('Profile updated successfully!');
            setIsEditing(false);
        }, 500);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100">
            <Navbar />
            
            {/* Banner Section */}
            <div 
                style={{
                    height: '250px',
                    background: 'linear-gradient(90deg, #b2744c 0%, #d4956a 100%)',
                    position: 'relative'
                }}
            ></div>

            <div className="container" style={{ marginTop: '-100px', marginBottom: '80px' }}>
                <div className="card border-0 shadow-lg overflow-hidden rounded-3">
                    <div className="card-body p-0">
                        <div className="row g-0">
                            {/* Left Sidebar - Profile Summary */}
                            <div className="col-lg-4 bg-white border-end text-center p-5">
                                <div className="position-relative d-inline-block mb-4">
                                    <img 
                                        src={formData.profilePictureUrl || 'https://via.placeholder.com/150'} 
                                        alt="Profile" 
                                        className="rounded-circle img-thumbnail shadow-sm"
                                        style={{ width: '180px', height: '180px', objectFit: 'cover' }}
                                    />
                                    {isEditing && (
                                        <div className="position-absolute bottom-0 end-0 bg-white rounded-circle p-2 shadow-sm border" style={{cursor: 'pointer'}}>
                                            <i className="fa fa-camera text-muted"></i>
                                        </div>
                                    )}
                                </div>
                                <h3 className="fw-bold mb-1">{formData.fullName}</h3>
                                <p className="text-muted mb-4">@{formData.username}</p>
                                
                                <div className="d-grid gap-2">
                                    {!isEditing ? (
                                        <button className="btn btn-outline-warning text-dark fw-bold" onClick={() => setIsEditing(true)}>
                                            <i className="fa fa-pencil me-2"></i> Edit Profile
                                        </button>
                                    ) : (
                                        <button className="btn btn-outline-secondary" onClick={() => setIsEditing(false)}>
                                            Cancel Editing
                                        </button>
                                    )}
                                    <button className="btn btn-danger" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>

                                <div className="mt-5 text-start">
                                    <small className="text-muted text-uppercase fw-bold ls-1">Member Info</small>
                                    <ul className="list-unstyled mt-3">
                                        <li className="mb-2"><i className="fa fa-calendar me-2 text-warning"></i> Joined {formData.joinDate}</li>
                                        <li className="mb-2"><i className="fa fa-id-card me-2 text-warning"></i> ID: #{formData.userId}</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Right Content - Details Form */}
                            <div className="col-lg-8 p-5">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="fw-bold m-0 text-secondary">
                                        {isEditing ? 'Update Information' : 'Account Details'}
                                    </h4>
                                </div>

                                <form onSubmit={handleSave}>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small fw-bold">Full Name</label>
                                            <input 
                                                type="text" 
                                                className={`form-control ${!isEditing ? 'bg-light border-0' : ''}`}
                                                value={formData.fullName}
                                                readOnly={!isEditing}
                                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small fw-bold">Email Address</label>
                                            <input 
                                                type="email" 
                                                className="form-control bg-light border-0"
                                                value={formData.email}
                                                readOnly
                                                disabled
                                            />
                                            {isEditing && <small className="text-muted" style={{fontSize: '10px'}}>Email cannot be changed</small>}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small fw-bold">Phone Number</label>
                                            <input 
                                                type="tel" 
                                                className={`form-control ${!isEditing ? 'bg-light border-0' : ''}`}
                                                value={formData.phoneNumber}
                                                readOnly={!isEditing}
                                                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small fw-bold">Username</label>
                                            <input 
                                                type="text" 
                                                className="form-control bg-light border-0"
                                                value={formData.username}
                                                readOnly
                                                disabled
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label text-muted small fw-bold">Address</label>
                                            <textarea 
                                                className={`form-control ${!isEditing ? 'bg-light border-0' : ''}`}
                                                rows={3}
                                                value={formData.address}
                                                readOnly={!isEditing}
                                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                            ></textarea>
                                        </div>
                                        
                                        {isEditing && (
                                            <div className="col-12">
                                                <label className="form-label text-muted small fw-bold">Profile Picture URL</label>
                                                <input 
                                                    type="url" 
                                                    className="form-control"
                                                    value={formData.profilePictureUrl}
                                                    onChange={(e) => setFormData({...formData, profilePictureUrl: e.target.value})}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {isEditing && (
                                        <div className="mt-4 text-end">
                                            <button type="submit" className="btn btn-warning text-white fw-bold px-4 py-2 rounded-pill shadow-sm">
                                                Save Changes
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UserProfile;