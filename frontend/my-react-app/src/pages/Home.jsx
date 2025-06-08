// src/pages/Home.jsx
import React, { useEffect, useState, useRef } from "react";
import HeroSection from "../components/layout/HeroSection";
import LoginSection from "../components/layout/LoginSection";
import KategoriSection from "../components/layout/KategoriSection";
import RekomendasiSection from "../components/layout/RekomendasiSection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authService } from "../services/authService";
import { jwtDecode } from "jwt-decode";
import { Toaster, toast } from "react-hot-toast";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toastShown = useRef(false);

  useEffect(() => {
    let cleanupTimeout;

    const checkAuthStatus = () => {
      const token = authService.getToken();

      if (token) {
        try {
          const decoded = jwtDecode(token);
          
          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if (decoded.exp && decoded.exp < currentTime) {
            // Token expired
            authService.clearToken();
            setIsLoggedIn(false);
            cleanupTimeout = showLoginPrompt();
          } else {
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          authService.clearToken();
          setIsLoggedIn(false);
          cleanupTimeout = showLoginPrompt();
        }
      } else {
        setIsLoggedIn(false);
        cleanupTimeout = showLoginPrompt();
      }
      
      setIsLoading(false);
    };

    const showLoginPrompt = () => {
      if (toastShown.current) return;
      toastShown.current = true;

      // Delay 1,8 detik lalu tampilkan toast
      const timeoutId = setTimeout(() => {
        toast.custom(
          (t) => (
            <div className="flex items-center p-4 space-x-3 bg-white rounded-lg shadow-xl">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50">
                <span className="text-xl text-blue-600">🔐</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-blue-800">
                  Login untuk akses penuh
                </p>
                <p className="text-sm text-blue-600">
                  Scroll ke bawah untuk masuk ke akun Anda
                </p>
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close notification"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ),
          {
            id: "login-toast", // ID unik untuk mencegah duplikasi
            duration: 10000,
            position: "top-center",
            style: {
              background: "transparent",
              border: "none",
              padding: 0,
              boxShadow: "none",
              maxWidth: "500px",
              width: "90%",
              animation: "slideInUp 0.5s ease-out",
            },
          }
        );
      }, 1800);

      return timeoutId;
    };

    checkAuthStatus();

    // Listen for storage changes (untuk sync antar tab)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === null) {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (cleanupTimeout) {
        clearTimeout(cleanupTimeout);
      }
      toastShown.current = false;
    };
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#FDFDFD] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a59d1] mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FDFDFD]">
      <Navbar />
      <HeroSection />
      <KategoriSection />
      {isLoggedIn ? <RekomendasiSection /> : <LoginSection />}
      <Footer />
    </div>
  );
}

export default Home;