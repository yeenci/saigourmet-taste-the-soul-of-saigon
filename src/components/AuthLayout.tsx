import React from 'react';
import '../Auth.css'; // Make sure to import the CSS

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
                    <h1>Dine Saigon</h1>
                    <p className="lead">Experience the authentic taste of Vietnam with just a few clicks.</p>
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