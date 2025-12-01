import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Restaurant } from "../lib/types";
import { fetchRestaurantsData } from "../lib/utils";
import { CATEGORIES } from "../lib/constants";

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // This is now expected to be the CategoryID (e.g., "8")
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDistrict, setFilterDistrict] = useState("All");

  // 1. Resolve the Category Name from the URL ID
  // We use useMemo so this doesn't recalculate on every render
  const currentCategory = useMemo(() => {
    if (!id) return null;

    // Try to find by ID first (e.g., id="8" -> found "Event")
    const foundById = CATEGORIES.find((c) => c.categoryId.toString() === id);
    if (foundById) return foundById;

    // Fallback: If id isn't a number or not found, maybe the URL is actually a name (legacy support)
    const foundByName = CATEGORIES.find(
      (c) => c.name.toLowerCase() === id.toLowerCase()
    );
    return foundByName || { name: id, image: "", categoryId: 0, icon: "" }; // Fallback object
  }, [id]);

  const categoryName = currentCategory?.name;

  const getHeaderImage = (catName: string | undefined) => {
    if (!catName)
      return "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1500&q=80";

    // 1. Check if the resolved category object has an image
    if (currentCategory && currentCategory.image) {
      return currentCategory.image;
    }

    // 2. Fallback switch for specific keywords
    switch (catName.toLowerCase()) {
      case "cafe":
        return "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1500&q=80";
      case "bar":
        return "https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&w=1500&q=80";
      case "club":
        return "https://images.unsplash.com/photo-1574155376612-c84efdd3a64f?auto=format&fit=crop&w=1500&q=80";
      default:
        return "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1500&q=80";
    }
  };

  useEffect(() => {
    const loadCategoryData = async () => {
      setLoading(true);

      const allRestaurants = await fetchRestaurantsData();

      if (allRestaurants && categoryName) {
        // Filter restaurants by checking if their category list includes the resolved Name
        const filtered = allRestaurants.filter(
          (r) =>
            r.categories &&
            r.categories.some(
              (c) => c.toLowerCase() === categoryName.toLowerCase()
            )
        );
        setRestaurants(filtered);
      } else {
        setRestaurants([]);
      }

      setLoading(false);
    };

    loadCategoryData();

    window.scrollTo(0, 0);
  }, [categoryName]); // Dependency is now the resolved name, not just the raw ID

  // Client-side District Filtering
  const displayedRestaurants =
    filterDistrict === "All"
      ? restaurants
      : restaurants.filter((r) => r.district === filterDistrict);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      {/* --- HEADER BANNER --- */}
      <div
        className="position-relative d-flex align-items-center justify-content-center text-center"
        style={{
          height: "350px",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("${getHeaderImage(
            categoryName
          )}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container text-white" style={{ zIndex: 2 }}>
          <p className="text-uppercase ls-1 fw-bold mb-2 text-warning">
            Explore
          </p>
          <h1 className="display-3 fw-bold font-playfair">
            {categoryName} Collection
          </h1>
          <p className="lead opacity-90">
            The best spots for {categoryName?.toLowerCase()} in Ho Chi Minh City
          </p>
        </div>
      </div>

      <div className="container py-5">
        {/* --- FILTERS & BREADCRUMB --- */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5">
          <nav aria-label="breadcrumb" className="mb-3 mb-md-0">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none text-muted">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link
                  to="/categories"
                  className="text-decoration-none text-muted"
                >
                  Categories
                </Link>
              </li>
              <li
                className="breadcrumb-item active text-dark fw-bold"
                aria-current="page"
              >
                {categoryName}
              </li>
            </ol>
          </nav>

          <div className="d-flex align-items-center gap-2">
            <label className="fw-bold text-muted small me-1">
              Filter by District:
            </label>
            <select
              className="form-select form-select-sm"
              style={{ width: "150px", borderColor: "#b2744c" }}
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
            >
              <option value="All">All Districts</option>
              <option value="District 1">District 1</option>
              <option value="District 2">District 2</option>
              <option value="District 3">District 3</option>
              <option value="District 7">District 7</option>
              <option value="Binh Thanh District">Binh Thanh</option>
            </select>
          </div>
        </div>

        {/* --- CONTENT --- */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : displayedRestaurants.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {displayedRestaurants.map((restaurant, index) => (
              <div
                className="col"
                key={
                  restaurant.restaurantId
                    ? `${restaurant.restaurantId}-${index}`
                    : index
                }
              >
                <div className="card h-100 border-0 shadow-sm hover-scale overflow-hidden">
                  <div className="position-relative">
                    <img
                      src={restaurant.picture}
                      alt={restaurant.name}
                      className="card-img-top"
                      style={{ height: "240px", objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/500x300?text=No+Image";
                      }}
                    />
                    <span className="position-absolute top-0 end-0 m-3 badge bg-success shadow">
                      {restaurant.rating.toFixed(1)}{" "}
                      <i className="fa fa-star ms-1"></i>
                    </span>
                  </div>
                  <div className="card-body d-flex flex-column p-4">
                    <h5 className="card-title fw-bold font-playfair mb-2">
                      {restaurant.name}
                    </h5>

                    <div className="mb-3">
                      <p className="text-muted small mb-1">
                        <i className="fa fa-map-marker me-2 text-danger"></i>
                        {restaurant.district}
                      </p>
                      <p className="text-muted small mb-0">
                        <i className="fa fa-clock-o me-2 text-primary"></i>
                        {restaurant.openTime} - {restaurant.closeTime}
                      </p>
                    </div>

                    <p className="text-muted small mb-3 flex-grow-1 text-truncate">
                      {restaurant.address}
                    </p>

                    <div className="d-grid">
                      <Link
                        to={`/booking/${
                          restaurant.restaurantId
                        }?restaurant_name=${encodeURIComponent(
                          restaurant.name
                        )}`}
                        className="btn btn-outline-dark fw-bold rounded-pill"
                      >
                        Book Table
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-5">
            <i className="fa fa-cutlery fa-4x text-muted mb-3 opacity-50"></i>
            <h3 className="fw-bold text-muted">No restaurants found</h3>
            <p className="text-muted">
              We couldn't find any {categoryName} spots in{" "}
              {filterDistrict === "All" ? "Saigon" : filterDistrict} at the
              moment.
            </p>
            <button
              className="btn btn-outline-warning mt-2"
              onClick={() => setFilterDistrict("All")}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
