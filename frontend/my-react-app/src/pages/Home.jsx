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
import { jwtDecode } from "jwt-decode"; // pastikan ini sudah di-install

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      try {
        jwtDecode(token); // hanya memastikan token valid
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Invalid token:", err);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div className="min-h-screen w-screen bg-[#FDFDFD]">
      <Navbar />
      <HeroSection />
      <KategoriSection />
      {isLoggedIn ? <RekomendasiSection /> : <LoginSection />}
      <Footer />
    </div>
  );
}

export default Home;

{
  /* <StarIcon className="h-5 w-5 text-yellow-800" />; */
}
