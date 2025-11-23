import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    // Mock user state - in real app use Context or Redux
    const user = null; 

    return (
        <nav className="navbar navbar-expand-lg sticky-top px-4">
            <Link className="navbar-brand fw-bold" to="/">
                <img src="/assets/logo.png" alt="" width="40px" className="me-2" /> 
                Dine Saigon
            </Link>
            <div className="collapse navbar-collapse justify-content-between">
                <ul className="navbar-nav mx-auto">
                    <li className="nav-item"><a href="#home" className="nav-link">Home</a></li>
                    <li className="nav-item"><a href="#about" className="nav-link">About</a></li>
                    <li className="nav-item"><a href="#category" className="nav-link">Category</a></li>
                    <li className="nav-item"><a href="#restaurant" className="nav-link">Restaurant</a></li>
                    <li className="nav-item"><a href="#blogs" className="nav-link">Blogs</a></li>
                </ul>
                <div className="d-flex gap-2">
                    {user ? (
                        <>
                            <Link to="/profile" className="btn btn-outline-light rounded-pill">Profile</Link>
                            <button className="btn btn-outline-light rounded-pill">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline-light rounded-pill">Login</Link>
                            <Link to="/register" className="btn btn-outline-light rounded-pill">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;