/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Restaurant } from "../lib/types";
import { CATEGORIES, DISTRICTS } from "../lib/constants";
import { fetchRestaurantsData } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

const AllRestaurants: React.FC = () => {
  const { user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filterDistrict, setFilterDistrict] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");

  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchRestaurantsData();

      if (data) {
        setAllRestaurants(data);
      }

      setLoading(false);
    };
    loadData();
  }, []);

  const restaurants = useMemo(() => {
    let filtered = allRestaurants;

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          (r.name || "").toLowerCase().includes(lowerTerm) ||
          (r.address || "").toLowerCase().includes(lowerTerm)
      );
    }

    console.log("District: ", filterDistrict);

    if (filterDistrict !== "All") {
      const selectedDistObj = DISTRICTS.find(
        (c) => String(c.districtId) === String(filterDistrict)
      );

      if (selectedDistObj) {
        filtered = filtered.filter(
          (r) => r.district?.trim() === selectedDistObj.name
        );
      }
    }

    if (filterCategory !== "All") {
      console.log("Category: ", filterCategory);
      const selectedCatObj = CATEGORIES.find(
        (c) => String(c.categoryId) === String(filterCategory)
      );

      if (selectedCatObj) {
        filtered = filtered.filter((r) =>
          (r.categories || []).includes(selectedCatObj.name)
        );
      }
    }

    return filtered;
  }, [searchTerm, filterDistrict, filterCategory, allRestaurants]);

  // Handle Search Input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle District Filter
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterDistrict(e.target.value);
    setCurrentPage(1);
  };

  // Handle Category Filter
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(e.target.value);
    setCurrentPage(1);
  };

  // Handle Reset Button
  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterDistrict("All");
    setFilterCategory("All");
    setCurrentPage(1);
  };

  useEffect(() => {
    const params: any = {};
    if (searchTerm) params.search = searchTerm;
    setSearchParams(params);
  }, [searchTerm, filterCategory, filterDistrict, setSearchParams]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = restaurants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(restaurants.length / itemsPerPage);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      <div className="bg-white border-bottom shadow-sm">
        <div className="container py-5">
          <h1 className="fw-bold font-playfair display-5 mb-2">
            Find your table
          </h1>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="container py-4">
        <div className="row">
          <div className="col-lg-3 mb-4">
            <div
              className="card border-0 shadow-sm p-3 position-sticky"
              style={{ top: "100px" }}
            >
              <h5 className="fw-bold mb-3">Filters</h5>

              <div className="mb-4">
                <label className="form-label fw-bold small text-muted text-uppercase">
                  District
                </label>
                <select
                  className="form-select"
                  value={filterDistrict}
                  onChange={handleDistrictChange}
                >
                  <option value="All">All Districts</option>
                  {DISTRICTS.map((dist) => (
                    <option key={dist.districtId} value={dist.districtId}>
                      {dist.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold small text-muted text-uppercase">
                  Category
                </label>
                <select
                  className="form-select"
                  value={filterCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="btn btn-outline-secondary w-100 btn-sm"
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* RESTAURANT LIST */}
          <div className="col-lg-9">
            {loading ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-warning"
                  role="status"
                ></div>
              </div>
            ) : currentItems.length > 0 ? (
              <>
                <div className="row row-cols-1 row-cols-md-2 g-4 mb-5">
                  {currentItems.map((restaurant, index) => (
                    <div
                      className="col"
                      key={restaurant.restaurantId || `rest-${index}`}
                    >
                      <div className="card h-100 border-0 shadow-sm hover-scale overflow-hidden">
                        <div className="position-relative">
                          <img
                            src={
                              restaurant.picture ||
                              "https://placehold.co/600x400?text=No+Image+Available"
                            }
                            alt={restaurant.name}
                            className="card-img-top"
                            style={{ height: "220px", objectFit: "cover" }}
                            onError={(e) =>
                              (e.currentTarget.src =
                                "https://placehold.co/600x400?text=No+Image+Available")
                            }
                          />

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

                        <div className="card-body d-flex flex-column p-4">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5
                              className="card-title fw-bold font-playfair mb-0 text-truncate"
                              style={{ maxWidth: "75%" }}
                            >
                              {restaurant.name}
                            </h5>
                            <span className="badge bg-success">
                              {restaurant.rating?.toFixed(1)}{" "}
                              <i className="fa fa-star ms-1"></i>
                            </span>
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

                          <div className="text-muted small mb-3">
                            <div className="d-flex align-items-center mb-2">
                              <i
                                className="fa fa-map-marker text-danger me-2"
                                style={{ width: "15px" }}
                              ></i>
                              <span className="text-truncate">
                                {restaurant.address}
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

                          {user?.isAdmin ? (
                            <button
                              className="btn btn-secondary w-100 rounded-pill fw-bold"
                              disabled
                              style={{
                                cursor: "not-allowed",
                                opacity: 0.7,
                                backgroundColor: "#e9ecef",
                                color: "#6c757d",
                                borderColor: "#dee2e6",
                              }}
                              title="Administrators cannot make bookings"
                            >
                              <i className="fa fa-ban me-2"></i>
                              View Only
                            </button>
                          ) : (
                            <Link
                              to={`/booking/${
                                restaurant.restaurantId
                              }?restaurant_name=${encodeURIComponent(
                                restaurant.name
                              )}`}
                              className="btn btn-outline-primary w-100 fw-bold rounded-pill"
                              style={{
                                borderColor: "#b2744c",
                                color: "#b2744c",
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#b2744c";
                                e.currentTarget.style.color = "white";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "transparent";
                                e.currentTarget.style.color = "#b2744c";
                              }}
                            >
                              Book Table
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <nav>
                    <ul className="pagination justify-content-center">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage((p) => p - 1)}
                        >
                          Previous
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, i) => (
                        <li
                          key={i} // Ensure this key is present here
                          className={`page-item ${
                            currentPage === i + 1 ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(i + 1)}
                            style={
                              currentPage === i + 1
                                ? {
                                    backgroundColor: "#b2744c",
                                    borderColor: "#b2744c",
                                  }
                                : {}
                            }
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li
                        className={`page-item ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage((p) => p + 1)}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            ) : (
              <div className="text-center py-5">
                <h3>No results found</h3>
                <button
                  className="btn btn-link text-warning fw-bold"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterDistrict("All");
                    setFilterCategory("All");
                  }}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllRestaurants;
