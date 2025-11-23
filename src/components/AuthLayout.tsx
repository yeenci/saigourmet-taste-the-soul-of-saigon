import React from 'react';
import '../Auth.css';

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
    return (
        <div className="auth-container">
            {/* Left Side: Brand/Image */}
            <div className="auth-image-side">
                <div className="auth-overlay"></div>
                <div className="auth-quote">
                    <h1 className="font-playfair">VinaTable</h1>
                    <p className="lead fs-4">Reserve the best tables in town.<br/>Seamless. Fast. Delicious.</p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="auth-form-side">
                <div className="auth-form-container">
                    <h2 className="auth-title">{title}</h2>
                    <p className="auth-subtitle">{subtitle}</p>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;