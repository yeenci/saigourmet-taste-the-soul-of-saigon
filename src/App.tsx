import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

// Context
import { AuthProvider } from "./context/AuthProvider";

// Components
import ScrollToTop from "./components/ScrollToTop";

// Pages - Public
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AllRestaurants from "./pages/AllRestaurants";
import AllCategories from "./pages/AllCategories";
import CategoryPage from "./pages/CategoryPage";
import Blogs from "./pages/AllBlogs";
import ArticleDetail from "./pages/ArticleDetail";

// Pages - Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";

// Pages - User / Protected
import UserProfile from "./pages/User/UserProfile";
import BookingForm from "./pages/User/BookingForm";
import BookingHistory from "./pages/User/BookingHistory";

// Pages - Admin
import CreateRestaurant from "./pages/Admin/CreateRestaurant";
import RestaurantDashboard from "./pages/Admin/RestaurantDashboard";
import NotFound from "./pages/NotFound";
import RestaurantBookings from "./pages/Admin/RestaurantBookings";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/restaurants"
            element={<Navigate to="/restaurants/all" replace />}
          />
          <Route path="/restaurants/all" element={<AllRestaurants />} />
          <Route path="/categories" element={<AllCategories />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<ArticleDetail />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Semi-Protected */}
          <Route path="/booking/:restaurantId" element={<BookingForm />} />

          {/* Protected Routes */}
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/booking-history" element={<BookingHistory />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<RestaurantDashboard />} />
          <Route
            path="/admin/create-restaurant"
            element={<CreateRestaurant />}
          />
          <Route
            path="/admin/restaurant/:restaurantId/bookings"
            element={<RestaurantBookings />}
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
