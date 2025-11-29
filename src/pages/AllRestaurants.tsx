/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Restaurant } from "../lib/types";
import { CATEGORIES, DISTRICTS } from "../lib/constants";

const AllRestaurants: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filterDistrict, setFilterDistrict] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");

  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);

      const cachedData = sessionStorage.getItem("restaurantsData");
      if (cachedData) {
        console.log("Loading from cache...");
        const parsedData = JSON.parse(cachedData);
        setAllRestaurants(parsedData);
        setRestaurants(parsedData);
        setLoading(false);
        return;
      }

      let rawResult: any = null;

      try {
        console.log("Fetching https...");
        const response = await fetch(
          "https://app.lemanh0902.id.vn:2025/restaurants"
        );
        if (!response.ok) throw new Error("Direct link error");
        rawResult = await response.json();
      } catch (e) {
        console.warn(
          "Direct fetch failed (likely unsafe/SSL error). Switching to fallback..."
        );

        try {
          const apiUrl = import.meta.env.VITA_API_URL || "/api";
          const response = await fetch(`${apiUrl}/restaurant`);
          if (!response.ok) throw new Error("Fallback link error");
          rawResult = await response.json();
        } catch (fE) {
          console.error("Both fetch attempts failed:", fE);
        }
      }

      if (rawResult) {
        const dataArray = Array.isArray(rawResult)
          ? rawResult
          : rawResult.data || [];

        const safeData = dataArray.map((item: any) => ({
          ...item,
          categories: item.categories || [],
        }));

        sessionStorage.setItem("restaurantData", JSON.stringify(safeData));
        setAllRestaurants(safeData);
        setRestaurants(safeData);
      }

      setLoading(false);
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    let filtered = allRestaurants;

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          (r.name || "").toLowerCase().includes(lowerTerm) ||
          (r.address || "").toLowerCase().includes(lowerTerm)
      );
    }

    if (filterDistrict !== "All") {
      const selectedDistObj = DISTRICTS.find(
        (d) => String(d.districtId) === String(filterDistrict)
      );

      if (selectedDistObj) {
        filtered = filtered.filter((r) => r.district === selectedDistObj.name);
      }
    }

    if (filterCategory !== "All") {
      const selectedCatObj = CATEGORIES.find(
        (c) => String(c.categoryId) === String(filterCategory)
      );

      if (selectedCatObj) {
        filtered = filtered.filter((r) =>
          (r.categories || []).includes(selectedCatObj.name)
        );
      }
    }

    setRestaurants(filtered);
    setCurrentPage(1);

    const params: any = {};
    if (searchTerm) params.search = searchTerm;
    setSearchParams(params);
  }, [
    searchTerm,
    filterDistrict,
    filterCategory,
    setSearchParams,
    allRestaurants,
  ]);

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
            onChange={(e) => setSearchTerm(e.target.value)}
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
                  onChange={(e) => setFilterDistrict(e.target.value)}
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
                  onChange={(e) => setFilterCategory(e.target.value)}
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
                onClick={() => {
                  setSearchTerm("");
                  setFilterDistrict("All");
                  setFilterCategory("All");
                }}
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
                              "https://via.placeholder.com/300"
                            }
                            alt={restaurant.name}
                            className="card-img-top"
                            style={{ height: "220px", objectFit: "cover" }}
                            onError={(e) =>
                              (e.currentTarget.src =
                                "https://via.placeholder.com/300")
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

                          <Link
                            to={`/booking/${
                              restaurant.restaurantId
                            }?restaurant_name=${encodeURIComponent(
                              restaurant.name
                            )}`}
                            className="btn btn-outline-primary w-100 fw-bold rounded-pill"
                            style={{ borderColor: "#b2744c", color: "#b2744c" }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = "#b2744c";
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
