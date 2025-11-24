import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import BookingForm from "./pages/User/BookingForm";
import OwnerBookingOrder from "./pages/Admin/OwnerBookingOrder";
import CreateRestaurant from "./pages/Admin/CreateRestaurant";
import UserProfile from "./pages/User/UserProfile";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Blogs from "./pages/Blogs";
import ArticleDetail from "./pages/ArticleDetail";
import CategoryPage from "./pages/CategoryPage";
import AllCategories from "./pages/AllCategories";
import AllRestaurants from "./pages/AllRestaurants";
import About from "./pages/About";
import Contact from "./pages/Contact";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/about" element={<About />} />

        <Route path="/restaurants" element={<Navigate to="/restaurants/all" replace />} />
        <Route path="/restaurants/all" element={<AllRestaurants />} />
        <Route path="/booking/:restaurantId" element={<BookingForm />} />
        <Route path="/admin/bookings" element={<OwnerBookingOrder />} />
        <Route path="/admin/create-restaurant" element={<CreateRestaurant />} />

        <Route path="/categories" element={<AllCategories />} />
        <Route path="/category/:id" element={<CategoryPage />} />

        <Route path="/blogs" element={<Blogs />} />
        <Route path="/article/:id" element={<ArticleDetail />} />

        <Route path="/profile" element={<UserProfile />} />

        <Route path="/contact" element={<Contact />} />
        {/* Add routes for Register, Recover, etc. */}
        <Route
          path="*"
          element={
            <div className="text-center mt-5">
              <h1>404 - Not Found</h1>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
