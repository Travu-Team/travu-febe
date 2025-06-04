import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./register/RegisterPage";
import LoginPage from "./login/LoginPage";
import Home from "./pages/Home";
import Destinasi from "./pages/destinasi/DetailPage";
import DestinationPlan from "./pages/DestinationPlan";
import About from "./pages/About";
import ProfileUser from "./pages/ProfileUser";
import TravelPlan from "./pages/plan/TravelPlan";
import ForgotPassword from "./utils/LupaSandi";
import ResetPassword from "./utils/resetPasword";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} /> {/* Default halaman */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/destinasi/:placeName" element={<Destinasi />} />
        <Route path="/destination" element={<DestinationPlan />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<ProfileUser />} />
        <Route path="/plan" element={<TravelPlan />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="*"
          element={
            <h1 className="text-center text-red-600 text-3xl mt-10">
              404: Not Found
            </h1>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
