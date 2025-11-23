/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProfileData {
    userId: number;
    username: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    address: string;
    profilePictureUrl: string;
}

const UserProfile: React.FC = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // State for form data
    const [formData, setFormData] = useState<UserProfileData>({
        userId: 0,
        username: '',
        email: '',
        fullName: '',
        phoneNumber: '',
        address: '',
        profilePictureUrl: ''
    });

    // Simulate fetching user data
    useEffect(() => {
        // In a real app: fetch('/account/getUserInformation')
        setTimeout(() => {
            setFormData({
                userId: 4350,
                username: 'JohnDoe123',
                email: 'johndoe@example.com',
                fullName: 'John Doe',
                phoneNumber: '+1234567890',
                address: '123 Main St, Saigon, VN',
                profilePictureUrl: 'https://t4.ftcdn.net/jpg/09/28/14/51/360_F_928145187_1ztkJxvyComd8MhioRwGJ9iUnG1rE3Ab.jpg' // Mock image
            });
            setLoading(false);
        }, 500);
    }, []);

    const handleLogout = () => {
        // Perform logout logic here (clear tokens, etc.)
        navigate('/login');
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // In a real app: await fetch('/account/updateUserInformation', { method: 'PUT', body: JSON.stringify(formData) ... })
            alert('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            alert('Failed to update profile.');
        }
    };

    if (loading) {
        return <div className="text-center text-white mt-5">Loading profile...</div>;
    }

    return (
        <div className="card-3d-wrap">
            <div className="card-front" style={{ height: 'auto', minHeight: '450px' }}>
                <h3 className="text-center mb-4 fw-bold">
                    {isEditing ? 'Update Information' : 'User Profile'}
                </h3>

                {/* View Mode */}
                {!isEditing ? (
                    <div className="text-center">
                        <img 
                            src={formData.profilePictureUrl || 'https://via.placeholder.com/150'} 
                            alt="Profile" 
                            className="rounded-circle mb-3 border border-3 border-warning"
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <div className="account-details mb-4" style={{ color: '#c4c3ca' }}>
                            <p><strong>ID:</strong> <span className="text-white">{formData.userId}</span></p>
                            <p><strong>Username:</strong> <span className="text-white">{formData.username}</span></p>
                            <p><strong>Email:</strong> <span className="text-white">{formData.email}</span></p>
                            <p><strong>Full Name:</strong> <span className="text-white">{formData.fullName}</span></p>
                            <p><strong>Phone:</strong> <span className="text-white">{formData.phoneNumber}</span></p>
                            <p><strong>Address:</strong> <span className="text-white">{formData.address}</span></p>
                        </div>
                        
                        <div className="d-flex gap-2">
                            <button 
                                className="btn-custom" 
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </button>
                            <button 
                                className="btn btn-danger w-100 fw-bold text-uppercase" 
                                style={{ height: '48px' }}
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Edit Mode */
                    <form onSubmit={handleSave}>
                        <div className="form-group mb-3 position-relative">
                            <i className="fa fa-envelope position-absolute text-warning" style={{ left: '15px', top: '15px' }}></i>
                            <input 
                                type="email" 
                                className="form-style" 
                                value={formData.email}
                                readOnly
                                disabled
                                style={{ opacity: 0.7 }}
                            />
                        </div>

                        <div className="form-group mb-3 position-relative">
                            <i className="fa fa-user position-absolute text-warning" style={{ left: '15px', top: '15px' }}></i>
                            <input 
                                type="text" 
                                className="form-style" 
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                required 
                            />
                        </div>

                        <div className="form-group mb-3 position-relative">
                            <i className="fa fa-phone position-absolute text-warning" style={{ left: '15px', top: '15px' }}></i>
                            <input 
                                type="tel" 
                                className="form-style" 
                                placeholder="Phone Number"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                required 
                            />
                        </div>

                        <div className="form-group mb-3 position-relative">
                            <i className="fa fa-map-marker position-absolute text-warning" style={{ left: '15px', top: '15px' }}></i>
                            <input 
                                type="text" 
                                className="form-style" 
                                placeholder="Address"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                required 
                            />
                        </div>

                        <div className="form-group mb-3 position-relative">
                            <i className="fa fa-image position-absolute text-warning" style={{ left: '15px', top: '15px' }}></i>
                            <input 
                                type="url" 
                                className="form-style" 
                                placeholder="Profile Picture URL"
                                value={formData.profilePictureUrl}
                                onChange={(e) => setFormData({...formData, profilePictureUrl: e.target.value})}
                                required 
                            />
                        </div>

                        <div className="d-flex gap-2">
                            <button type="submit" className="btn-custom">Save Changes</button>
                            <button 
                                type="button" 
                                className="btn btn-secondary w-100 fw-bold text-uppercase" 
                                style={{ height: '48px' }}
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserProfile;