import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/SaiGourmet.png";

const Footer: React.FC = () => {
  return (
    <footer
      className="pt-5 pb-4 text-center text-white"
      style={{ backgroundColor: "#1f2029", borderTop: "5px solid #b2744c" }}
    >
      <div className="container">
        <div className="mb-4">
          <img src={logo} alt="SaiGourmet Logo" width="70" className="mb-2" />
          <h3 className="fw-bold font-playfair mb-1">SaiGourmet</h3>
          <p className="text-light opacity-75 small">
            Your gateway to the best dining experiences in Saigon.
          </p>
        </div>

        <div className="social-links mb-4 d-flex justify-content-center gap-3">
          <a
            href="#"
            className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center hover-scale"
            style={{ width: "45px", height: "45px" }}
          >
            <i className="fa fa-facebook fs-5"></i>
          </a>
          <a
            href="#"
            className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center hover-scale"
            style={{ width: "45px", height: "45px" }}
          >
            <i className="fa fa-instagram fs-5"></i>
          </a>
          <a
            href="#"
            className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center hover-scale"
            style={{ width: "45px", height: "45px" }}
          >
            <i className="fa fa-youtube fs-5"></i>
          </a>
        </div>

        <div className="row justify-content-center mb-4 g-3">
          <div className="col-auto">
            <Link
              to="/"
              className="text-light text-decoration-none px-3 hover-opacity"
            >
              Home
            </Link>
          </div>
          <div className="col-auto">
            <Link
              to="/blogs"
              className="text-light text-decoration-none px-3 hover-opacity"
            >
              Blogs
            </Link>
          </div>
          <div className="col-auto">
            <Link
              to="/register"
              className="text-light text-decoration-none px-3 hover-opacity"
            >
              Join Us
            </Link>
          </div>
          <div className="col-auto">
            <Link
              to="/contact"
              className="text-light text-decoration-none px-3 hover-opacity"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="border-top border-secondary pt-4 mt-4">
          <p className="small text-light mb-0 opacity-75">
            &copy; {new Date().getFullYear()} <strong>SaiGourmet</strong>. All
            Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
