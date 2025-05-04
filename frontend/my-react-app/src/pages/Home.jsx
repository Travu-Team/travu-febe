import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-indigo-500 flex-1 py-16 px-4 flex justify-center">
        <div className="w-full max-w-screen-xl flex flex-col-reverse md:flex-row items-center gap-10">
          {/* Left Content */}
          <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left space-y-5">
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-snug">
              Perjalanan yang <span className="text-yellow-400">Baik</span> adalah perjalanan tanpa <span className="font-extrabold">Penyesalan</span>
            </h1>
            <p className="text-white text-base md:text-lg">
              Mulai perjalananmu bersama Travu hanya dengan login, pilih minat, dan temukan wisata yang paling cocok buat kamu
            </p>
            <div className="flex justify-center md:justify-start">
              <a
                href="/login"
                className="bg-white hover:bg-gray-100 text-indigo-500 font-bold py-2 px-6 rounded-full transition duration-300"
              >
                Login Yuk!
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="/image/karakter.png"
              alt="Karakter Travu"
              className="w-3/4 md:w-[300px] h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
