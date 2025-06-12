// src/components/layout/RekomendasiSection.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import RecommendationCard from "../RecommendationCard";
import { recommendationService } from "../../services/recommendationService";
import { authService } from "../../services/authService";
import toast from "react-hot-toast";

const RekomendasiSection = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileStatus, setProfileStatus] = useState({
    isComplete: false,
    isIncomplete: false,
    hasError: false
  });
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  // Check scroll position untuk enable/disable navigation buttons
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Update scroll position saat recommendations berubah
  useEffect(() => {
    if (recommendations.length > 0) {
      setTimeout(() => {
        checkScrollPosition();
      }, 100);
    }
  }, [recommendations]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 320; // Approximate width of one card + gap
      scrollContainerRef.current.scrollBy({
        left: -cardWidth * 2, // Scroll 2 cards at a time
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 320; // Approximate width of one card + gap
      scrollContainerRef.current.scrollBy({
        left: cardWidth * 2, // Scroll 2 cards at a time
        behavior: 'smooth'
      });
    }
  };

  const checkUserProfile = async () => {
    try {
      // Cek apakah user sudah mengisi interest dan domisili
      const userProfile = await authService.getUserProfile();
      
      const hasInterests = userProfile?.interests && userProfile.interests.length > 0;
      const hasDomicile = userProfile?.domicile || userProfile?.alamat || userProfile?.address;
      
      if (!hasInterests || !hasDomicile) {
        setProfileStatus({
          isComplete: false,
          isIncomplete: true,
          hasError: false
        });
        
        // Show alert hanya sekali saat pertama kali akses
        const hasShownAlert = localStorage.getItem('profileAlertShown');
        if (!hasShownAlert) {
          setShowProfileAlert(true);
          localStorage.setItem('profileAlertShown', 'true');
        }
        
        return false;
      }
      
      setProfileStatus({
        isComplete: true,
        isIncomplete: false,
        hasError: false
      });
      return true;
    } catch (err) {
      console.error('Error cek profile anda:', err);
      setProfileStatus({
        isComplete: true, // Assume complete if error, to proceed with recommendation fetch
        isIncomplete: false,
        hasError: true
      });
      return true;
    }
  };

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setProfileStatus({
        isComplete: false,
        isIncomplete: false,
        hasError: false
      });

      // Pastikan user sudah login
      if (!authService.isAuthenticated()) {
        setError("Silakan masuk ke akun Anda terlebih dahulu untuk melihat rekomendasi wisata yang sesuai dengan preferensi Anda.");
        setIsLoading(false);
        return;
      }

      // Cek kelengkapan profil user
      const profileComplete = await checkUserProfile();
      if (!profileComplete) {
        setIsLoading(false);
        return;
      }

      const response = await recommendationService.getRecommendations();
      
      // Validasi response
      if (Array.isArray(response)) {
        setRecommendations(response);
      } else {
        setRecommendations([]);
        // Jangan set error di sini, biarkan komponen menampilkan empty state
      }
      
    } catch (err) {
      console.error('Fetch recommendations error:', err);
      
      // Cek apakah error karena profil tidak lengkap atau error lainnya
      if (err.message && (
        err.message.includes("profil") || 
        err.message.includes("interest") || 
        err.message.includes("domisili") ||
        err.message.includes("alamat") ||
        err.message.includes("address")
      )) {
        setProfileStatus({
          isComplete: false,
          isIncomplete: true,
          hasError: false
        });
      } else {
        setError("Gagal memuat rekomendasi wisata. Pastikan koneksi internet Anda stabil dan coba lagi.");
        
        // Tampilkan toast error hanya untuk error teknis
        toast.error("Gagal memuat rekomendasi wisata. Silakan periksa koneksi internet dan coba lagi.", {
          duration: 4000,
          style: {
            background: "#fee2e2",
            border: "1px solid #f87171",
            color: "#dc2626",
          },
        });
      }
      
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    fetchRecommendations();
  };

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  const handleCloseAlert = () => {
    setShowProfileAlert(false);
  };

  // Alert untuk mengisi profil
  const ProfileAlert = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          <div className="text-5xl mb-4">👤</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Lengkapi Profil Anda
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Untuk mendapatkan rekomendasi wisata yang sesuai dengan minat Anda, 
            silakan lengkapi terlebih dahulu informasi domisili dan minat di bagian profil.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleCloseAlert}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200"
            >
              Nanti Saja
            </button>
            <button
              onClick={() => {
                handleCloseAlert();
                handleGoToProfile();
              }}
              className="flex-1 bg-[#3A59D1] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#2d47b8] transition-colors duration-200"
            >
              Ke Profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (showProfileAlert) {
    return <ProfileAlert />;
  }

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
            <p className="text-gray-600 text-lg">Sedang memuat rekomendasi wisata untuk Anda...</p>
          </div>
        </div>
      </div>
    );
  }

  // State: Profil belum lengkap
  if (profileStatus.isIncomplete) {
    return (
      <div className="w-full flex flex-col items-center gap-6 px-4 md:px-8 lg:px-20 py-10">
        <div className="w-full max-w-screen-xl">
          <h2 className="text-[#3A59D1] text-2xl md:text-3xl lg:text-4xl font-semibold font-poppins mb-4">
            Rekomendasi Wisata
          </h2>
          <p className="text-[#0F0F0F] text-lg md:text-xl lg:text-xl font-medium font-poppins mb-8">
            Lengkapi profil untuk mendapatkan rekomendasi
          </p>
        </div>
        
        {/* Profile Incomplete State */}
        <div className="w-full flex justify-center items-center py-12">
          <div className="text-center max-w-lg">
            <div className="text-[#3A59D1] text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Profil Belum Lengkap
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Anda belum mengisi <strong>lokasi destinasi</strong> dan <strong>minat wisata</strong> di profil Anda. 
              Silakan lengkapi informasi ini untuk mendapatkan rekomendasi wisata yang sesuai dengan preferensi Anda.
            </p>
            <button
              onClick={handleGoToProfile}
              className="bg-[#3A59D1] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#2d47b8] transition-colors duration-200"
            >
              Lengkapi Profil Sekarang
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State: Error teknis (koneksi, server, dll)
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
        
        {/* Technical Error State */}
        <div className="w-full flex justify-center items-center py-12">
          <div className="text-center max-w-lg">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Ups! Ada Kendala Teknis
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {error}
            </p>
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

  return (
    <div className="w-full flex flex-col items-center gap-6 px-4 md:px-8 lg:px-20 py-10" id="recommendations-section">
      {/* Header */}
      <div className="w-full max-w-screen-xl">
        <h2 className="text-[#3A59D1] text-2xl md:text-3xl lg:text-4xl font-semibold font-poppins mb-4">
          Rekomendasi Wisata
        </h2>
        <p className="text-[#0F0F0F] text-lg md:text-xl lg:text-xl font-medium font-poppins mb-8">
          {recommendations.length === 0 && profileStatus.isComplete
            ? "Belum ada rekomendasi yang sesuai dengan preferensi Anda" 
            : recommendations.length === 0
            ? "Mengumpulkan rekomendasi wisata untuk Anda" 
            : `Pilihan wisata yang cocok untuk Anda (${recommendations.length} destinasi)`
          }
        </p>
      </div>

      {/* State: Profil lengkap tapi tidak ada rekomendasi */}
      {recommendations.length === 0 && profileStatus.isComplete ? (
        <div className="w-full flex justify-center items-center py-12">
          <div className="text-center max-w-lg">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Belum Ada Rekomendasi
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Maaf, saat ini belum ada rekomendasi wisata yang sesuai dengan <strong>minat</strong> dan <strong>lokasi</strong> yang Anda pilih. 
              Coba ubah preferensi di profil Anda atau periksa kembali nanti.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200"
              >
                Muat Ulang
              </button>
              <button
                onClick={handleGoToProfile}
                className="bg-[#3A59D1] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#2d47b8] transition-colors duration-200"
              >
                Ubah Preferensi
              </button>
            </div>
          </div>
        </div>
      ) : recommendations.length === 0 ? (
        // State: Loading atau initial state
        <div className="w-full flex justify-center items-center py-12">
          <div className="text-center max-w-lg">
            <div className="text-gray-400 text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Menyiapkan Rekomendasi
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Kami sedang mengumpulkan rekomendasi wisata terbaik berdasarkan preferensi Anda. 
              Mohon tunggu sebentar...
            </p>
            <button
              onClick={handleRetry}
              className="bg-[#3A59D1] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#2d47b8] transition-colors duration-200"
            >
              Muat Rekomendasi
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Carousel dengan Navigation Buttons untuk Desktop */}
          <div className="w-full relative">
            {/* Navigation Buttons - Hidden on mobile */}
            <div className="hidden lg:block">
              {/* Previous Button */}
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
                  canScrollLeft
                    ? 'bg-[#3A59D1] hover:bg-[#2d47b8] text-white hover:shadow-xl cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                style={{ marginLeft: '-24px' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
                  canScrollRight
                    ? 'bg-[#3A59D1] hover:bg-[#2d47b8] text-white hover:shadow-xl cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                style={{ marginRight: '-24px' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Scrollable Container */}
            <div 
              ref={scrollContainerRef}
              className="w-full overflow-x-auto scrollbar-hide px-1"
              onScroll={checkScrollPosition}
            >
              <div className="flex gap-6 w-max snap-x snap-mandatory scroll-smooth px-1">
                {recommendations.map((recommendation, index) => (
                  <RecommendationCard 
                    key={recommendation.id || recommendation.nama_wisata || index} 
                    recommendation={recommendation} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Scroll Indicator - Updated untuk desktop/mobile */}
          {recommendations.length > 3 && (
            <div className="flex justify-center mt-4">
              <p className="text-sm text-gray-500">
                <span className="lg:hidden">← Geser untuk melihat lebih banyak rekomendasi →</span>
                <span className="hidden lg:inline">Gunakan tombol navigasi untuk melihat lebih banyak rekomendasi</span>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RekomendasiSection;