// import React from "react";
// import Footer from "../components/Footer";
// import { CardCustom } from "../components/Cards";
// import { IconButtonCustom } from "../components/IconButton";
// import { StarIcon } from "@heroicons/react/24/solid";

import React from "react";
import HeroSection from "../components/layout/HeroSection";
import LoginSection from "../components/layout/LoginSection";
import KategoriSection from "../components/layout/KategoriSection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen w-screen bg-[#FDFDFD]">
      <Navbar />
      <HeroSection />
      <LoginSection />
      <KategoriSection />
      <Footer />
    </div>
  );
}

export default Home;
{
  /* <StarIcon className="h-5 w-5 text-yellow-800" />; */
}
