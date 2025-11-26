/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Restaurant } from "../lib/types";

// Extended interface for UI display purposes (optional tags/price)

const TopRestaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    // Mock Data
    const mockTop3: Restaurant[] = [
      {
        restaurantId: "1",
        name: "The Deck Saigon",
        address: "38 Nguyen U Di, Thao Dien",
        district: "District 2",
        picture:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        openTime: "08:00",
        closeTime: "23:00",
        categories: ["Activity", "Bar"],
      },
      {
        restaurantId: "2",
        name: "Pizza 4P's Ben Thanh",
        address: "8 Thu Khoa Huan",
        district: "District 1",
        picture:
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        openTime: "10:00",
        closeTime: "22:00",
        categories: ["Activity", "Bar"],
      },
      {
        restaurantId: "3",
        name: "Secret Garden",
        address: "158 Pasteur",
        district: "District 1",
        picture:
          "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        openTime: "07:00",
        closeTime: "22:00",
        categories: ["Activity", "Bar"],
      },
    ];
    setRestaurants(mockTop3);
  }, []);

  return (
    <div className="row row-cols-1 row-cols-md-3 g-4">
      {restaurants.map((restaurant) => (
        <div className="col" key={restaurant.restaurantId}>
          <div
            className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative"
            style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 0.125rem 0.25rem rgba(0,0,0,0.075)";
            }}
          >
            {/* Image Container */}
            <div
              className="position-relative overflow-hidden"
              style={{ height: "240px" }}
            >
              <img
                src={restaurant.picture}
                alt={restaurant.name}
                className="w-100 h-100 object-fit-cover"
                style={{ transition: "transform 0.5s ease" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1.0)")
                }
              />
              {/* Overlay Badges */}
              <div className="position-absolute top-0 start-0 w-100 p-3 d-flex justify-content-between">
                {restaurant.rating >= 4.0 && (
                  <span
                    className={`position-absolute top-0 end-0 m-2 badge shadow-sm ${
                      restaurant.rating >= 4.5
                        ? "bg-warning text-dark"
                        : "bg-white text-dark"
                    }`}
                  >
                    {restaurant.rating >= 4.5
                      ? "Highly Recommend"
                      : "Recommend"}
                  </span>
                )}
              </div>
            </div>

            {/* Card Body */}
            <div className="card-body p-4 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5
                  className="card-title fw-bold font-playfair mb-0 text-truncate"
                  style={{ fontSize: "1.25rem", maxWidth: "80%" }}
                >
                  {restaurant.name}
                </h5>
                <div className="d-flex align-items-center bg-success text-white px-2 py-1 rounded small fw-bold">
                  {restaurant.rating}{" "}
                  <i
                    className="fa fa-star ms-1"
                    style={{ fontSize: "0.8rem" }}
                  ></i>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-3">
                {restaurant.categories?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="badge bg-light text-secondary border me-1 fw-normal"
                    style={{ fontSize: "0.75rem" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Info Details */}
              <div className="text-muted small mb-3">
                <div className="d-flex align-items-center mb-2">
                  <i
                    className="fa fa-map-marker text-danger me-2"
                    style={{ width: "15px" }}
                  ></i>
                  <span className="text-truncate">
                    {restaurant.address}, {restaurant.district}
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <i
                    className="fa fa-clock-o text-primary me-2"
                    style={{ width: "15px" }}
                  ></i>
                  <span>
                    {restaurant.openTime} - {restaurant.closeTime}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-auto pt-3 border-top">
                <Link
                  to={`/booking/${
                    restaurant.restaurantId
                  }?restaurant_name=${encodeURIComponent(restaurant.name)}`}
                  className="btn btn-outline-dark w-100 rounded-pill fw-bold"
                  style={{
                    borderColor: "#b2744c",
                    color: "#b2744c",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#b2744c";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#b2744c";
                  }}
                >
                  Book Table
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopRestaurants;
