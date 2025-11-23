/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // State for inputs
    const [formData, setFormData] = useState({
        email: '',
        mobile_number: '',
        address: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        const payload = {
            email: formData.email,
            mobile_number: formData.mobile_number,
            address: formData.address,
            password: formData.password
        };

        try {
            // US-5: Register
            const response = await fetch('http://app.lemanh0902.id.vn/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.code === 1) {
                alert('Account created successfully! Please login.');
                navigate('/login');
            } else {
                setError(data.message || 'Registration failed.');
            }
        } catch (err) {
            setError('Network error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Create Account" subtitle="Join us and start ordering delicious food.">
            {error && <div className="alert alert-danger p-2 mb-3 small">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="modern-input-group">
                    <i className="fa fa-envelope"></i>
                    <input 
                        type="email" name="email" className="modern-input" placeholder="Email Address" 
                        value={formData.email} onChange={handleChange} required 
                    />
                </div>
                
                <div className="row">
                    <div className="col-md-6">
                         <div className="modern-input-group">
                            <i className="fa fa-phone"></i>
                            <input 
                                type="tel" name="mobile_number" className="modern-input" placeholder="Phone" 
                                value={formData.mobile_number} onChange={handleChange} required 
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="modern-input-group">
                            <i className="fa fa-map-marker"></i>
                            <input 
                                type="text" name="address" className="modern-input" placeholder="City/Address" 
                                value={formData.address} onChange={handleChange} required 
                            />
                        </div>
                    </div>
                </div>

                <div className="modern-input-group">
                    <i className="fa fa-lock"></i>
                    <input 
                        type="password" name="password" className="modern-input" placeholder="Password" 
                        value={formData.password} onChange={handleChange} required 
                    />
                </div>
                <div className="modern-input-group">
                    <i className="fa fa-check-circle"></i>
                    <input 
                        type="password" name="confirmPassword" className="modern-input" placeholder="Confirm Password" 
                        value={formData.confirmPassword} onChange={handleChange} required 
                    />
                </div>

                <button type="submit" className="btn-auth" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>

            <div className="auth-links">
                Already have an account? <Link to="/login">Sign in</Link>
            </div>
        </AuthLayout>
    );
};

export default Register;