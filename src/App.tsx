import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

// Context
import { AuthProvider } from "./context/AuthContext";

// Components
import ScrollToTop from "./components/ScrollToTop";

// Pages - Public (Accessible to everyone)
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AllRestaurants from "./pages/AllRestaurants";
import AllCategories from "./pages/AllCategories";
import CategoryPage from "./pages/CategoryPage";
import Blogs from "./pages/AllBlogs";
import ArticleDetail from "./pages/ArticleDetail";

// Pages - Auth (Public)
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";

// Pages - User / Protected (Requires Login - Logic inside component)
import UserProfile from "./pages/User/UserProfile";
import BookingForm from "./pages/User/BookingForm";

// Pages - Admin (Should be protected)
import OwnerBookingOrder from "./pages/Admin/OwnerBookingOrder";
import CreateRestaurant from "./pages/Admin/CreateRestaurant";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />

        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          {/* Anyone can view these pages without logging in */}

          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Restaurants & Categories */}
          <Route
            path="/restaurants"
            element={<Navigate to="/restaurants/all" replace />}
          />
          <Route path="/restaurants/all" element={<AllRestaurants />} />
          <Route path="/categories" element={<AllCategories />} />
          <Route path="/category/:id" element={<CategoryPage />} />

          {/* Blogs / Articles */}
          <Route path="/blogs" element={<Blogs />} />
          {/* Support both URL patterns just in case */}
          <Route path="/blog/:id" element={<ArticleDetail />} />
          <Route path="/article/:id" element={<ArticleDetail />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ================= SEMI-PROTECTED ROUTES ================= */}
          {/* Users can view the form, but need to login to submit */}

          <Route path="/booking/:restaurantId" element={<BookingForm />} />

          {/* ================= PROTECTED ROUTES ================= */}
          {/* These components contain logic to redirect if not logged in */}

          <Route path="/profile" element={<UserProfile />} />

          {/* ================= ADMIN ROUTES ================= */}
          {/* Ideally these should be wrapped in a specific AdminGuard */}

          <Route path="/admin/bookings" element={<OwnerBookingOrder />} />
          <Route
            path="/admin/create-restaurant"
            element={<CreateRestaurant />}
          />

          {/* ================= 404 FALLBACK ================= */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
