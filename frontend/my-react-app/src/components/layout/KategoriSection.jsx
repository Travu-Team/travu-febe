import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import "../../../src/index.css";

const dataGambar = {
  Pantai: [
    "/image/pantai_sanur.jpg",
    "/image/pantai_anyer.jpg",
    "/image/pantai_sawarna.jpg",
    "/image/pantai_balekambang.jpg",
    "/image/pantai_amed.webp",
  ],
  "Air Terjun": [
    "/image/airterjun_madakaripura.webp",
    "/image/airterjun_kantolampo.webp",
    "/image/airterjun2.jpg",
    "/image/air-terjun-aling-aling.jpg",
    "/image/Air-Terjun-Mangku-Sakti.jpg",
  ],
  Lainnya: [
    "/image/candi1.jpg",
    "/image/candi2.jpg",
    "/image/candi3.jpg",
    "/image/candi4.jpg",
    "image/candi5.jpg",
  ],
};

// Buat kategori "Semua" dari gabungan semua
dataGambar["Semua"] = [
  ...dataGambar["Pantai"],
  ...dataGambar["Air Terjun"],
  ...dataGambar["Lainnya"],
];

const KategoriSection = () => {
  const [kategoriAktif, setKategoriAktif] = useState("Pantai");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const animationTimeout = useRef(null);

  const gambarAktif = dataGambar[kategoriAktif];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Trigger animasi saat kategori berubah
  useEffect(() => {
    // Bersihkan timeout sebelumnya
    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current);
    }

    // Sembunyikan konten sementara
    setIsContentVisible(false);

    // Atur ulang animasi setelah delay
    animationTimeout.current = setTimeout(() => {
      setIsContentVisible(true);
    }, 50); // Delay kecil untuk memastikan animasi terpicu

    // Bersihkan saat unmount
    return () => {
      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current);
      }
    };
  }, [kategoriAktif]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % gambarAktif.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + gambarAktif.length) % gambarAktif.length
    );
  };

  return (
    <div className="w-full px-4 lg:px-8 md:px- py-8 font-poppins">
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-2 lg:px-8">
        {/* Judul + Deskripsi */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-blue-600 mb-1">
            Kategori Minat Wisata
          </h1>
          <p className="text-[#0F0F0F] text-lg md:text-xl lg:text-xl font-medium font-poppins">
            Kamu mau wisata kemana, nih?
          </p>
        </div>

        {/* Tombol Kategori */}
        <div className="flex flex-wrap gap-2 lg:gap-3 flex-shrink-0">
          {["Pantai", "Air Terjun", "Lainnya"].map((kategori) => (
            <button
              key={kategori}
              onClick={() => {
                setKategoriAktif(kategori);
                setCurrentIndex(0);
              }}
              className={`text-base md:text-lg font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl border transition-all duration-200
    ${
      kategoriAktif === kategori
        ? "bg-[#47BB8E] text-white border-transparent"
        : "bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200"
    }`}
            >
              {kategori}
            </button>
          ))}
        </div>
      </div>

      {/* Gambar */}
      {isMobile ? (
        <div className="pt-6">
          <div className="relative w-full max-w-sm mx-auto">
            <img
              src={gambarAktif[currentIndex]}
              alt={`Gambar ${kategoriAktif}`}
              className={classNames(
                "w-full h-64 rounded-2xl shadow-lg",
                isContentVisible ? "animate-fade-in" : "opacity-0"
              )}
            />
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 bg-[#3A59D1] text-white p-3 rounded-full shadow-md hover:bg-[#2a449b] transition"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 bg-[#3A59D1] text-white p-3 rounded-full shadow-md hover:bg-[#2a449b] transition"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-4 items-start pt-8 px-3 lg:px-5">
          {/* Gambar Utama */}
          <div className="flex-shrink-0">
            <img
              src={gambarAktif[0]}
              className={classNames(
                "w-[640px] h-[410px] rounded-2xl shadow-lg",
                isContentVisible ? "animate-fade-in" : "opacity-0"
              )}
              alt="Gambar utama"
            />
          </div>

          {/* Grid Gambar Kecil */}
          <div className="grid grid-cols-2 gap-3 w-[560px]">
            {gambarAktif.slice(1).map((img, i) => (
              <img
                key={i}
                src={img}
                className={classNames(
                  "w-full h-[196px] rounded-2xl shadow-md",
                  isContentVisible ? "animate-fade-in" : "opacity-0"
                )}
                alt={`Gambar ${i + 2}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KategoriSection;
