/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Restaurant } from "../lib/types";
import { CATEGORIES, DISTRICTS } from "../lib/constants";

// Extended Interface for local mock data to support categories/price
interface ExtendedRestaurant extends Restaurant {
  categories: string[];
  priceRange: string; // e.g., $$, $$$
}

// MOCK DATA (In a real app, this comes from an API with pagination params)
const MOCK_DATA: ExtendedRestaurant[] = [
  {
    restaurantId: 1,
    name: "The Deck Saigon",
    address: "38 Nguyen U Di, Thao Dien",
    district: "District 2",
    picture:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=60",
    rating: 4.8,
    openTime: "08:00",
    closeTime: "23:00",
    categories: ["Dinner", "Bar", "River View"],
    priceRange: "$$$",
  },
  {
    restaurantId: 2,
    name: "Pizza 4P's Ben Thanh",
    address: "8 Thu Khoa Huan",
    district: "District 1",
    picture:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=60",
    rating: 4.9,
    openTime: "10:00",
    closeTime: "22:00",
    categories: ["Dinner", "Italian", "Family"],
    priceRange: "$$",
  },
  {
    restaurantId: 3,
    name: "Secret Garden",
    address: "158 Pasteur",
    district: "District 1",
    picture:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=500&q=60",
    rating: 4.7,
    openTime: "07:00",
    closeTime: "22:00",
    categories: ["Dinner", "Traditional", "Vietnamese"],
    priceRange: "$$",
  },
  {
    restaurantId: 4,
    name: "The Workshop Coffee",
    address: "27 Ngo Duc Ke",
    district: "District 1",
    picture:
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=500&q=60",
    rating: 4.6,
    openTime: "08:00",
    closeTime: "21:00",
    categories: ["Cafe", "Brunch"],
    priceRange: "$$",
  },
  {
    restaurantId: 5,
    name: "Lush Nightclub",
    address: "2 Ly Tu Trong",
    district: "District 1",
    picture:
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=500&q=60",
    rating: 4.5,
    openTime: "21:00",
    closeTime: "04:00",
    categories: ["Club", "Bar", "Event"],
    priceRange: "$$$",
  },
  {
    restaurantId: 6,
    name: "Godmother Bake & Brunch",
    address: "Dong Khoi, Level 3",
    district: "District 1",
    picture:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=500&q=60",
    rating: 4.7,
    openTime: "08:00",
    closeTime: "16:00",
    categories: ["Brunch", "Cafe"],
    priceRange: "$$",
  },
  {
    restaurantId: 7,
    name: "Noir. Dining in the Dark",
    address: "178 Hai Ba Trung",
    district: "District 1",
    picture:
      "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?auto=format&fit=crop&w=500&q=60",
    rating: 4.9,
    openTime: "17:30",
    closeTime: "23:00",
    categories: ["Dinner", "Experience"],
    priceRange: "$$$$",
  },
  {
    restaurantId: 8,
    name: "Propaganda Vietnamese Bistro",
    address: "21 Han Thuyen",
    district: "District 1",
    picture:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=60",
    rating: 4.6,
    openTime: "07:30",
    closeTime: "23:00",
    categories: ["Bistro", "Vietnamese"],
    priceRange: "$$",
  },
];

const AllRestaurants: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  // State
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filterDistrict, setFilterDistrict] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [restaurants, setRestaurants] = useState<ExtendedRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setLoading(true);
    // Simulate API Fetch & Filtering
    setTimeout(() => {
      let filtered = MOCK_DATA;

      // 1. Filter by Search Term
      if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.name.toLowerCase().includes(lowerTerm) ||
            r.address.toLowerCase().includes(lowerTerm)
        );
      }

      // 2. Filter by District
      if (filterDistrict !== "All") {
        filtered = filtered.filter((r) => r.district === filterDistrict);
      }

      // 3. Filter by Category
      if (filterCategory !== "All") {
        filtered = filtered.filter((r) =>
          r.categories.includes(filterCategory)
        );
      }

      setRestaurants(filtered);
      setLoading(false);
      setCurrentPage(1); // Reset to page 1 on filter change
    }, 400);

    // Update URL params without reloading
    const params: any = {};
    if (searchTerm) params.search = searchTerm;
    setSearchParams(params);
  }, [searchTerm, filterDistrict, filterCategory, setSearchParams]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = restaurants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(restaurants.length / itemsPerPage);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      {/* --- HEADER --- */}
      <div className="bg-white border-bottom shadow-sm">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="fw-bold font-playfair display-5 mb-2">
                Find your table
              </h1>
              <p className="text-muted fs-5">
                {restaurants.length} restaurants match your criteria
              </p>
            </div>
            <div className="col-md-6">
              {/* Main Search Bar */}
              <div className="input-group input-group-lg shadow-sm">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="fa fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by name, address, or cuisine..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row">
          {/* --- SIDEBAR FILTERS (Desktop) --- */}
          <div className="col-lg-3 mb-4">
            <div
              className="card border-0 shadow-sm p-3 position-sticky"
              style={{ top: "100px" }}
            >
              <h5 className="fw-bold mb-3">
                <i className="fa fa-sliders me-2"></i>Filters
              </h5>

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

          {/* --- RESULTS GRID --- */}
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
                  {currentItems.map((restaurant) => (
                    <div className="col" key={restaurant.restaurantId}>
                      <div className="card h-100 border-0 shadow-sm hover-scale overflow-hidden">
                        <div className="position-relative">
                          <img
                            src={restaurant.picture}
                            alt={restaurant.name}
                            className="card-img-top"
                            style={{ height: "220px", objectFit: "cover" }}
                          />
                          <span className="position-absolute top-0 end-0 m-2 badge bg-white text-dark shadow-sm">
                            {restaurant.priceRange}
                          </span>
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
                              {restaurant.rating.toFixed(1)}{" "}
                              <i className="fa fa-star ms-1"></i>
                            </span>
                          </div>

                          <div className="mb-2">
                            {restaurant.categories
                              .slice(0, 3)
                              .map((cat, idx) => (
                                <span
                                  key={idx}
                                  className="badge bg-light text-secondary me-1 border"
                                >
                                  {cat}
                                </span>
                              ))}
                          </div>

                          <p className="text-muted small mb-1">
                            <i className="fa fa-map-marker me-2 text-danger"></i>
                            {restaurant.district}
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
                          key={i}
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
                <i className="fa fa-frown-o fa-4x text-muted mb-3 opacity-50"></i>
                <h3>No results found</h3>
                <p className="text-muted">
                  Try adjusting your search or filters.
                </p>
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
