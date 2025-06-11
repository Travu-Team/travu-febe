import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faStar,
  faArrowLeft,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useSearchParams } from "react-router-dom"; // Tambahkan useSearchParams

const Search = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); // Untuk membaca dan mengatur parameter URL

  const csvFilePath = "/wisata_indonesia_final_fix.csv";

  useEffect(() => {
    // Muat data CSV
    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        console.log("✅ Data Loaded:", results.data.length, "items");
      },
    });
  }, []);

  useEffect(() => {
    // Inisialisasi searchTerm dari URL saat pertama kali dimuat
    const queryParam = searchParams.get("query");
    if (queryParam && !searchTerm) {
      const decodedQuery = decodeURIComponent(queryParam).trim();
      setSearchTerm(decodedQuery); // Set hanya jika searchTerm masih kosong
    }

    // Filter data berdasarkan searchTerm
    const filteredData = data.filter((item) => {
      const namaWisata = item.nama_wisata?.toLowerCase() || "";
      return namaWisata.includes(searchTerm.toLowerCase());
    });

    console.log("🎯 Filtered:", filteredData.length, "results");
    setFiltered(filteredData);
  }, [data, searchParams, searchTerm]); // Tambahkan searchParams untuk inisialisasi awal

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      setSearchParams({ query: encodeURIComponent(searchTerm.trim()) }); // Perbarui URL dengan query baru
    }
  };

  const handleBack = () => {
    navigate("/"); // Navigate to home page
  };

  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen">
        {/* Search Header */}
        <div className="bg-white px-4 py-4 shadow-sm border-b border-gray-100">
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="text-gray-700 text-lg"
              />
            </button>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="text-gray-400 text-sm"
                />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-500"
                placeholder="Cari tempat wisata..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchSubmit} // Trigger search on Enter
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600 text-sm">
              Menampilkan {filtered.length} hasil untuk "{searchTerm}"
            </p>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.length > 0
              ? filtered.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100"
                  >
                    {/* Image */}
                    <div className="relative">
                      <img
                        src={
                          item.Image_Path ||
                          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
                        }
                        alt={item.nama_wisata}
                        className="h-48 w-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Kategori */}
                      <span className="inline-block text-xs bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded-full mb-2">
                        {item.kategori
                          ? item.kategori.charAt(0).toUpperCase() +
                            item.kategori.slice(1).toLowerCase()
                          : "Tidak ada kategori"}
                      </span>

                      {/* Rating */}
                      <div className="flex items-center justify-between mb-2">
                        {/* Rating - Left aligned */}
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FontAwesomeIcon
                              key={i}
                              icon={faStar}
                              className="text-yellow-400 text-xs"
                            />
                          ))}
                          <span className="text-gray-600 text-sm ml-1">
                            (4.7)
                          </span>
                        </div>

                        {/* Verified icon - Right aligned */}
                        <div className="flex items-center text-green-500">
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="mr-1 text-xs"
                          />
                          <span className="text-sm">Verified</span>
                        </div>
                      </div>

                      {/* Nama wisata */}
                      <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2">
                        {item.nama_wisata || "Tidak ditemukan"}
                      </h3>

                      {/* Lokasi */}
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="text-red-500 text-xs"
                        />
                        <span className="truncate">
                          {item.provinsi || "Lokasi tidak tersedia"}
                        </span>
                      </div>

                      {/* Tombol lihat detail */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <button
                          onClick={() =>
                            navigate(
                              `/destinasi/${encodeURIComponent(
                                item.nama_wisata || "tidak-ditemukan"
                              ).toLowerCase()}`
                            )
                          }
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              : searchTerm && (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <FontAwesomeIcon icon={faSearch} className="text-4xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Tidak ada hasil ditemukan
                    </h3>
                    <p className="text-gray-600">
                      Coba gunakan kata kunci yang berbeda atau lebih umum
                    </p>
                  </div>
                )}
          </div>

          {/* Load More Button (Optional) */}
          {filtered.length > 12 && (
            <div className="text-center mt-8">
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Lihat Lebih Banyak
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Search;
