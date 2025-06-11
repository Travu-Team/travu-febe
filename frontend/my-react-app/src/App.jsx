import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./register/RegisterPage";
import LoginPage from "./login/LoginPage";
import Home from "./pages/Home";
import Destinasi from "./pages/destinasi/DetailPage";
import DestinationPlan from "./pages/DestinationPlan";
import About from "./pages/About";
import ProfileUser from "./pages/ProfileUser";
import Search from "./pages/Search";
import TravelPlan from "./pages/plan/TravelPlan";
import NoteFund from "./components/NoteFund"; // Import komponen 404
import OfflineNavbar from "./components/OfflineNavbar";
import { Toaster } from "react-hot-toast";

const App = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Show offline navbar when offline
  if (!isOnline) {
    return <OfflineNavbar />;
  }

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
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<ProfileUser />} />
        <Route path="/plan" element={<TravelPlan />} />
        
        {/* Route 404 - harus di paling bawah */}
        <Route
          path="*"
          element={
            <NoteFund onNavigateHome={() => window.location.href = '/'} />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;