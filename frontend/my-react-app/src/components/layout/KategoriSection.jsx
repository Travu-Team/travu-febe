import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const dataGambar = {
  Pantai: ["/image/pantai1.png", "/image/pantai2.png"],
  "Air Terjun": ["/image/airterjun1.png", "/image/airterjun2.png"],
  Lainnya: ["/image/candi.png"],
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

  const gambarAktif = dataGambar[kategoriAktif];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % gambarAktif.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + gambarAktif.length) % gambarAktif.length
    );
  };

  return (
    <div className="w-full px-4 lg:px-8 py-8 font-poppins">
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-2 lg:px-8">
        {/* Judul + Deskripsi */}
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-1">
            Kategori Minat Wisata
          </h2>
          <p className="text-gray-700 text-base md:text-lg">
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
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                kategoriAktif === kategori
                  ? "bg-green-500 text-white shadow-md"
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
        <div className=" pt-6">
          <div className="relative w-full max-w-sm mx-auto">
            <img
              src={gambarAktif[currentIndex]}
              alt={`Gambar ${kategoriAktif}`}
              className="w-full h-64 object-cover rounded-2xl shadow-lg"
            />
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md text-gray-600 hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md text-gray-600 hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-4 items-start pt-8">
          {/* Gambar Utama */}
          <div className="flex-shrink-0">
            <img
              src={gambarAktif[0]}
              className="w-[580px] h-[400px] object-cover rounded-2xl shadow-lg"
              alt="Gambar utama"
            />
          </div>

          {/* Grid Gambar Kecil */}
          <div className="grid grid-cols-2 gap-3 w-[480px]">
            {gambarAktif.slice(1).map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-full h-[196px] object-cover rounded-2xl shadow-md"
                alt={`Gambar ${i + 2}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Lihat selengkapnya */}
      <div className="text-blue-600 underline text-sm md:text-base text-center mt-8 cursor-pointer hover:text-blue-800 transition-colors">
        Lihat selengkapnya &gt;&gt;
      </div>
    </div>
  );
};

export default KategoriSection;
