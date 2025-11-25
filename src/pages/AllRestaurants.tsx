/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
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
    const apiUrl = import.meta.env.VITE_API_URL || "/api";

    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/restaurant/`);

        // Safety check for HTML response
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Server returned HTML");
          return;
        }

        const result = await response.json();

        if (result.data) {
          const safeData = result.data.map((item: any) => ({
            ...item,
            categories: item.categories || [],
          }));

          setAllRestaurants(safeData);
          setRestaurants(safeData);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // --- FILTER DATA ---
  useEffect(() => {
    let filtered = allRestaurants;

    // 1. Filter by Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          (r.name || "").toLowerCase().includes(lowerTerm) ||
          (r.address || "").toLowerCase().includes(lowerTerm)
      );
    }

    // 2. Filter by District (FIXED)
    if (filterDistrict !== "All") {
      // The select box returns a string "1", convert to number if needed
      // const targetId = Number(filterDistrict);

      filtered = filtered.filter((r) => {
        // Access the ID inside the district object
        return r.district?.id === filterDistrict;
      });
    }

    // 3. Filter by Category
    if (filterCategory !== "All") {
      filtered = filtered.filter((r) =>
        (r.categories || []).some(
          (cat) => String(cat.id) === String(filterCategory)
        )
      );
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

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = restaurants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(restaurants.length / itemsPerPage);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      {/* Header code... (omitted for brevity, keep your existing header) */}
      <div className="bg-white border-bottom shadow-sm">
        <div className="container py-5">
          <h1 className="fw-bold font-playfair display-5 mb-2">
            Find your table
          </h1>
          {/* ... search input ... */}
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
          {/* SIDEBAR FILTERS */}
          <div className="col-lg-3 mb-4">
            <div
              className="card border-0 shadow-sm p-3 position-sticky"
              style={{ top: "100px" }}
            >
              <h5 className="fw-bold mb-3">Filters</h5>

              {/* District Filter */}
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
                    // Value is the ID (e.g., 1)
                    <option key={dist.districtId} value={dist.districtId}>
                      {dist.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
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
{/* FIX KEY WARNING: Use ID or Index fallback */}
                  {currentItems.map((restaurant, index) => (
                    <div 
className="col" 
key={restaurant.restaurantId || `rest-${index}`}
>
                      <div className="card h-100 border-0 shadow-sm hover-scale overflow-hidden">
                        {/* Image section... */}
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

                          {/* Categories */}
                          <div className="mb-2">
                            {(restaurant.categories || [])
                              .slice(0, 3)
                              .map((cat, idx) => (
                                // FIX: Use cat.id OR fallback to index (idx) to prevent key warning
                                <span
                                  key={cat.id || idx}
                                  className="badge bg-light text-secondary me-1 border"
                                >
                                  {cat.name}
                                </span>
                              ))}
                          </div>

                          {/* --- FIX IS HERE (Rendering District) --- */}
                          <p className="text-muted small mb-1">
                            <i className="fa fa-map-marker me-2 text-danger"></i>
                            {/* Check if district is an object, if so, print .name */}
                            {typeof restaurant.district === "object"
                              ? restaurant.district.name
                              : restaurant.district}
                          </p>

                          <p className="text-muted small mb-3 flex-grow-1">
                            {restaurant.address}
                          </p>

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

                {/* Pagination (keep your existing code) */}
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
                      {/* ... */}
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
