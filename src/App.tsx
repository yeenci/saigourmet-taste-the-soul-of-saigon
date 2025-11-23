import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/blogs" element={<Blogs />} />

        <Route path="/booking/:restaurantId" element={<BookingForm />} />
        <Route path="/admin/bookings" element={<OwnerBookingOrder />} />
        <Route path="/admin/create-restaurant" element={<CreateRestaurant />} />
        <Route path="/profile" element={<UserProfile />} />
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
