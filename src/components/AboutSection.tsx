import React from "react";

const AboutSection: React.FC = () => {
  return (
    <div className="container section-white">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h1 style={{ color: "#b2744c", fontFamily: "Playfair Display" }}>
            Discover Saigon's Food
          </h1>
          <p className="fst-italic">
            Welcome to <strong>SaiGourmet</strong>, your ultimate guide to
            exploring vibrant cafes.
          </p>
          <ul className="list-unstyled">
            <li>✅ Explore rich varieties of cafes.</li>
            <li>✅ View detailed menus and ratings.</li>
            <li>✅ Book tables remotely.</li>
          </ul>
        </div>
        <div className="col-md-6">
          <img
            src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/33/10/3e/manila-bay-kitchen-is.jpg?w=600&h=400&s=1"
            alt="Saigon Cafe"
            className="img-fluid rounded shadow"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
