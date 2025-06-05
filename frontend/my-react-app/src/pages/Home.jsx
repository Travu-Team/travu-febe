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
import { Toaster } from "react-hot-toast";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = authService.getToken();

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isTokenExpired = decoded.exp < Date.now() / 1000;

        if (isTokenExpired) {
          setIsLoggedIn(false);
          authService.logout();
        } else {
          setIsLoggedIn(true);
        }
      } catch {
        setIsLoggedIn(false);
        authService.logout();
      }
    } else {
      setIsLoggedIn(false);
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
