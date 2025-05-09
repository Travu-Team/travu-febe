import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CardCustom } from '../components/Cards';
import { IconButtonCustom } from '../components/icon-button';
import { StarIcon } from '@heroicons/react/24/solid';

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-primary flex-1 py-16 px-4 flex justify-center">
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
                className="bg-white hover:bg-gray-100 text-primary font-bold py-2 px-6 rounded-full transition duration-300"
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

      {/* testing card */}
        {/* <CardCustom
          image="https://www.jonnymelon.com/wp-content/uploads/2021/07/pandawa-beach-10.jpg"
          title="Pantai Pandawa"
          description="Bali, Indonesia"
          buttonText="Lihat Detail"
        />
        <CardCustom
          variant="horizontal-1"
          image="https://cdn.idntimes.com/content-images/community/2023/07/beautiful-1203-2633-59e06127ef137cc19c312dc2d72a37fd.webp"
          title="Pantai Pandawa"
          category="Pantai"
          rating={4.5}
          location="Kuta, Bali"
          buttonText1= "Edit"
          buttonText2= "Hapus"
        />
        <CardCustom
          variant="horizontal-2"
          image="https://cdn.idntimes.com/content-images/community/2023/07/beautiful-1203-2633-59e06127ef137cc19c312dc2d72a37fd.webp"
          title="Trip Bali"
          
        />
        <CardCustom
          variant="horizontal-3"
          image="https://cdn.idntimes.com/content-images/community/2023/07/beautiful-1203-2633-59e06127ef137cc19c312dc2d72a37fd.webp"
          title="Pantai Pandawa"
          category="Pantai"
          rating={4.5}
          location="Kuta, Bali"
          buttonText1="Lihat Detail"
          buttonText2="Pesan Sekarang"
        /> */}
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;

<StarIcon className="h-5 w-5 text-yellow-800" />