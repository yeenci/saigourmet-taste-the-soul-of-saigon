import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="py-4 text-center" style={{ backgroundColor: '#b2744c', color: 'white' }}>
            <div className="mb-3">
                <img src="/assets/logo.png" alt="Logo" width="50" />
            </div>
            <div className="social-links mb-3">
                <a href="#" className="text-white mx-2"><i className="fa fa-facebook"></i></a>
                <a href="#" className="text-white mx-2"><i className="fa fa-instagram"></i></a>
                <a href="#" className="text-white mx-2"><i className="fa fa-youtube"></i></a>
            </div>
            <div className="copyright">
                &copy; Copyright <strong><span>Loving Food</span></strong>. All Rights Reserved
            </div>
        </footer>
    );
};

export default Footer;