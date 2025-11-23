/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const form = e.currentTarget;
        // Postman API requires FormData for Login
        const formData = new FormData(form);

        try {
            const response = await fetch('http://localhost:1412/auth/login', {
                method: 'POST',
                body: formData, // Sending FormData directly
            });

            const data = await response.json();

            if (response.ok) {
                // Assuming data contains token based on typical flow, 
                // though specific response wasn't in the snippet provided for login,
                // usually it returns a token or user info.
                alert('Login Successful!');
                navigate('/'); 
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Unable to connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Welcome Back" subtitle="Please enter your details to sign in.">
            {error && <div className="alert alert-danger p-2 mb-3 small">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="modern-input-group">
                    <i className="fa fa-envelope"></i>
                    <input 
                        type="text" 
                        name="username" 
                        className="modern-input" 
                        placeholder="Email Address" 
                        required 
                    />
                </div>
                <div className="modern-input-group">
                    <i className="fa fa-lock"></i>
                    <input 
                        type="password" 
                        name="password" 
                        className="modern-input" 
                        placeholder="Password" 
                        required 
                    />
                </div>

                <div className="d-flex justify-content-end mb-3">
                    <Link to="/forgot-password" style={{fontSize: '13px', color: '#b2744c', textDecoration: 'none'}}>
                        Forgot Password?
                    </Link>
                </div>

                <button type="submit" className="btn-auth" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <div className="auth-links">
                Don't have an account? <Link to="/register">Create free account</Link>
            </div>
        </AuthLayout>
    );
};

export default Login;