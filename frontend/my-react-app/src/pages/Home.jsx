// import React from "react";
// import Footer from "../components/Footer";
// import { CardCustom } from "../components/Cards";
// import { IconButtonCustom } from "../components/IconButton";
// import { StarIcon } from "@heroicons/react/24/solid";

import React, { useEffect, useState } from "react";
import HeroSection from "../components/layout/HeroSection";
import LoginSection from "../components/layout/LoginSection";
import KategoriSection from "../components/layout/KategoriSection";
import RekomendasiSection from "../components/layout/RekomendasiSection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authService } from "../services/authService";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = authService.getToken();

    if (token) {
      try {
        jwtDecode(token);
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);

      // Delay 1,8 detik lalu tampilkan toast
      const timeoutId = setTimeout(() => {
        toast(
          (t) => (
            <div className="flex items-start space-x-3">
              <span className="text-xl">🔐</span>
              <div className="text-sm">
                <p className="font-medium">Login untuk akses penuh.</p>
                <p className="text-xs text-gray-500">
                  Scroll ke bawah untuk login.
                </p>
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="ml-auto text-[#d13a3a] text-xl font-bold leading-none"
                aria-label="Close notification"
              >
                ×
              </button>
            </div>
          ),
          {
            duration: 10000,
            style: {
              background: "#fff",
              border: "1px solid #3a59d1",
              padding: "14px 18px",
              color: "#3a59d1",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            },
          }
        );
      }, 1800);

      return () => clearTimeout(timeoutId);
    }
  }, []);

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
