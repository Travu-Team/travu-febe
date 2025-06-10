// src/components/layout/RekomendasiSection.jsx
import React, { useState, useEffect } from "react";
import RecommendationCard from "../RecommendationCard";
import { recommendationService } from "../../services/recommendationService";
import { authService } from "../../services/authService";
import toast from "react-hot-toast";

const RekomendasiSection = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Pastikan user sudah login
      if (!authService.isAuthenticated()) {
        setError("Anda harus login untuk melihat rekomendasi");
        setIsLoading(false);
        return;
      }

      const response = await recommendationService.getRecommendations();
      console.log("Recommendation Service Response:", response); // Debug log

      // Validasi response
      if (Array.isArray(response)) {
        console.log(
          "Valid recommendations array received:",
          response.length,
          "items"
        );
        setRecommendations(response);

        if (response.length === 0) {
          setError(
            "Tidak ada rekomendasi yang tersedia. Pastikan Anda sudah mengisi profil dengan interest dan alamat."
          );
        }
      } else {
        console.warn("Response is not an array:", typeof response, response);
        setRecommendations([]);
        setError("Format data rekomendasi tidak valid");
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(err.message || "Gagal memuat rekomendasi");
      setRecommendations([]);

      // Tampilkan toast error
      toast.error(
        err.message ||
          "Gagal memuat rekomendasi. Pastikan Anda sudah mengisi profil dengan interest dan alamat.",
        {
          duration: 5000,
          style: {
            background: "#fee",
            border: "1px solid #f87171",
            color: "#dc2626",
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    fetchRecommendations();
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center gap-6 px-4 md:px-8 lg:px-20 py-10">
        <div className="w-full max-w-screen-xl">
          <h2 className="text-[#3A59D1] text-2xl md:text-3xl lg:text-4xl font-semibold font-poppins mb-4">
            Rekomendasi Wisata
          </h2>
          <p className="text-[#0F0F0F] text-lg md:text-xl lg:text-xl font-medium font-poppins mb-8">
            Pilihan wisata yang cocok untuk Anda
          </p>
        </div>

        {/* Loading State */}
        <div className="w-full flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3A59D1] mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Memuat rekomendasi...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center gap-6 px-4 md:px-8 lg:px-20 py-10">
        <div className="w-full max-w-screen-xl">
          <h2 className="text-[#3A59D1] text-2xl md:text-3xl lg:text-4xl font-semibold font-poppins mb-4">
            Rekomendasi Wisata
          </h2>
          <p className="text-[#0F0F0F] text-lg md:text-xl lg:text-xl font-medium font-poppins mb-8">
            Pilihan wisata yang cocok untuk Anda
          </p>
        </div>

        {/* Error State */}
        <div className="w-full flex justify-center items-center py-12">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Oops! Terjadi Kesalahan
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-[#3A59D1] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#2d47b8] transition-colors duration-200"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(recommendations) || recommendations.length === 0) {
    return (
      <div className="w-full flex flex-col items-center gap-6 px-4 md:px-8 lg:px-20 py-10">
        <div className="w-full max-w-screen-xl">
          <h2 className="text-[#3A59D1] text-2xl md:text-3xl lg:text-4xl font-semibold font-poppins mb-4">
            Rekomendasi Wisata
          </h2>
          <p className="text-[#0F0F0F] text-lg md:text-xl lg:text-xl font-medium font-poppins mb-8">
            Pilihan wisata yang cocok untuk Anda
          </p>
        </div>

        {/* Empty State */}
        <div className="w-full flex justify-center items-center py-12">
          <div className="text-center max-w-md">
            <div className="text-gray-400 text-6xl mb-4">🏖️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Belum Ada Rekomendasi
            </h3>
            <p className="text-gray-600 mb-6">
              Untuk mendapatkan rekomendasi wisata yang personal, lengkapi
              profil Anda dengan interest dan alamat terlebih dahulu.
            </p>
            <button
              onClick={handleRetry}
              className="bg-[#3A59D1] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#2d47b8] transition-colors duration-200"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-6 px-4 md:px-8 lg:px-20 py-10">
      {/* Header */}
      <div className="w-full max-w-screen-xl">
        <h2 className="text-[#3A59D1] text-2xl md:text-3xl lg:text-4xl font-semibold font-poppins mb-4">
          Rekomendasi Wisata
        </h2>
        <p className="text-[#0F0F0F] text-lg md:text-xl lg:text-xl font-medium font-poppins mb-8">
          Pilihan wisata yang cocok untuk Anda ({recommendations.length}{" "}
          destinasi)
        </p>
      </div>

      {/* Carousel Style */}
      <div className="w-full overflow-x-auto scrollbar-hide px-1">
        <div className="flex gap-6 w-max snap-x snap-mandatory scroll-smooth px-1">
          {recommendations.map((recommendation, index) => (
            <RecommendationCard
              key={recommendation.id || recommendation.nama_wisata || index}
              recommendation={recommendation}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      {recommendations.length > 3 && (
        <div className="flex justify-center mt-4">
          <p className="text-sm text-gray-500">
            ← Geser untuk melihat lebih banyak rekomendasi →
          </p>
        </div>
      )}
    </div>
  );
};

export default RekomendasiSection;
