import React, { useState } from "react";
import classNames from "classnames";
import "../../../src/index.css";

const allData = [
  {
    nama: "Pantai Gili Trawangan",
    lokasi: "Nusa Tenggara Barat, Indonesia",
    gambar: "/image/pantai_gilitrawangan.jpg",
    kategori: "pantai",
  },
  {
    nama: "Pantai Laguna",
    lokasi: "Lampung, Indonesia",
    gambar: "/image/pantai_laguna.jpg",
    kategori: "pantai",
  },
  {
    nama: "Pantai Sanur",
    lokasi: "Bali, Indonesia",
    gambar: "/image/pantai_sanur.jpg",
    kategori: "pantai",
  },
  {
    nama: "Pantai Anyer",
    lokasi: "Banten, Indonesia",
    gambar: "/image/pantai_anyer.jpg",
    kategori: "pantai",
  },
  {
    nama: "Pantai Sawarna",
    lokasi: "Banten, Indonesia",
    gambar: "/image/pantai_sawarna.jpg",
    kategori: "pantai",
  },
  {
    nama: "Air Terjun Madakaripura",
    lokasi: "Jawa Timur, Indonesia",
    gambar: "/image/airterjun_madakaripura.webp",
    kategori: "air_terjun",
  },
  {
    nama: "Air Terjun Kanto Lampo",
    lokasi: "Bali, Indonesia",
    gambar: "/image/airterjun_kantolampo.webp",
    kategori: "air_terjun",
  },
  {
    nama: "Kawah Putih",
    lokasi: "Bandung, Indonesia",
    gambar: "/image/card3.png",
    kategori: "lainnya",
  },
  {
    nama: "Bukit Tinggi",
    lokasi: "Sumatera Barat, Indonesia",
    gambar: "/image/card4.png",
    kategori: "lainnya",
  },
];

const categories = [
  { label: "Pantai", value: "pantai" },
  { label: "Air Terjun", value: "air_terjun" },
  { label: "Lainnya", value: "lainnya" },
];

const RekomendasiSection = () => {
  const [kategoriAktif, setKategoriAktif] = useState("pantai");

  const dataFiltered = allData.filter(
    (item) => item.kategori === kategoriAktif
  );

  return (
    <div className="w-full flex flex-col items-center gap-6 px-4 md:px-8 lg:px-20 py-10">
      {/* Header */}
      <div className="w-full max-w-screen-xl flex flex-col lg:flex-row justify-between items-start gap-6">
        <div>
          <h2 className="text-[#3A59D1] text-2xl md:text-3xl lg:text-4xl font-semibold font-poppins">
            Rekomendasi Wisata
          </h2>
          <p className="text-[#0F0F0F] text-lg md:text-xl lg:text-xl font-medium font-poppins">
            Pilihan wisata lainnya yang cocok kamu kunjungi
          </p>
        </div>
            <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
                <button
                key={cat.value}
                onClick={() => setKategoriAktif(cat.value)}
                className={classNames(
                    "text-base md:text-lg font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl border transition-all duration-200",
                    kategoriAktif === cat.value
                    ? "bg-[#47BB8E] text-white border-transparent"
                    : "text-[#A2A2A2] border-[#A2A2A2]"
                )}
                >
                {cat.label}
                </button>
            ))}
            </div>
      </div>

      {/* Carousel Style Netflix */}
      <div className="w-full overflow-x-auto scrollbar-hide px-1">
        <div className="flex gap-6 w-max snap-x snap-mandatory scroll-smooth px-1">
          {dataFiltered.map((item, index) => (
            <div
              key={index}
              className="snap-start w-[250px] sm:w-[280px] md:w-[300px] lg:w-[309px] flex-shrink-0 shadow-md rounded-[30px] bg-white"
            >
              <img
                src={item.gambar}
                alt={item.nama}
                className="w-full h-[200px] md:h-[240px] object-cover rounded-t-[30px] border border-gray-300"
              />
              <div className="bg-[#F9F9F9] rounded-b-[30px] border border-gray-300 px-5 py-6 flex flex-col justify-between h-[180px]">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold font-poppins text-[#000]">
                    {item.nama}
                  </h2>
                  <p className="text-base text-[#4B4B4B] font-poppins">
                    {item.lokasi}
                  </p>
                </div>
                <button className="bg-[#3A59D1] text-white text-base md:text-lg font-medium py-2 rounded-xl w-full">
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RekomendasiSection;
