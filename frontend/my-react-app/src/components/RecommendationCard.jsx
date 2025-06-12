// src/components/RecommendationCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecommendationCard = ({ recommendation }) => {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    // Hanya kirim nama wisata saja, tanpa lokasi
    const destinationName = getCleanDestinationName();
    navigate(`/destinasi/${encodeURIComponent(destinationName)}`);
  };

  // Sesuaikan dengan struktur response backend
  const getImageUrl = () => {
    // Prioritaskan image_path dari backend response
    if (recommendation.image_path) {
      return recommendation.image_path;
    }
    
    // Fallback ke field lain jika ada
    if (recommendation.gambar) {
      return recommendation.gambar;
    }
    if (recommendation.Image_Path) {
      return recommendation.Image_Path;
    }
    if (recommendation.imageUrl) {
      return recommendation.imageUrl;
    }
    if (recommendation.image) {
      return recommendation.image;
    }
    
    // Default placeholder menggunakan data URL sebagai fallback
    return null; // Return null untuk menggunakan placeholder div
  };

  // Ambil nama lengkap sesuai struktur backend
  const getDestinationName = () => {
    return recommendation.nama_lengkap || 
           recommendation.nama_wisata || 
           recommendation.name || 
           recommendation.title ||
           'Nama tidak tersedia';
  };

  // Ambil nama bersih tanpa lokasi untuk navigasi
  const getCleanDestinationName = () => {
    let name = recommendation.nama_lengkap || 
               recommendation.nama_wisata || 
               recommendation.name || 
               recommendation.title ||
               'Nama tidak tersedia';
    
    // Bersihkan nama dari informasi lokasi
    // Hapus pattern seperti ", Kota, Provinsi" atau ", Kabupaten, Provinsi"
    name = name.replace(/,\s*[^,]+,\s*[^,]+$/i, ''); // Hapus ", Kota, Provinsi"
    name = name.replace(/,\s*[^,]+$/i, ''); // Hapus ", Provinsi" atau ", Kota"
    
    // Hapus pattern khusus untuk lokasi Indonesia
    name = name.replace(/,\s*(Bali|Jawa|Sumatra|Kalimantan|Sulawesi|Papua|Lombok|Sumbawa|Flores|Timor).*$/i, '');
    name = name.replace(/,\s*(Kabupaten|Kota|Provinsi)\s+[^,]+$/i, '');
    
    // Hapus spasi berlebih
    name = name.trim();
    
    return name;
  };

  // Ambil alamat sesuai struktur backend
  const getDestinationAddress = () => {
    // Sesuai dengan response backend, alamat ada di field 'alamat'
    if (recommendation.alamat) {
      return recommendation.alamat;
    }
    
    // Fallback ke field lain
    if (recommendation.address) {
      return recommendation.address;
    }
    if (recommendation.provinsi) {
      return recommendation.provinsi;
    }
    if (recommendation.lokasi) {
      return recommendation.lokasi;
    }
    if (recommendation.location) {
      return recommendation.location;
    }
    if (recommendation.city) {
      return recommendation.city;
    }
    if (recommendation.kota_kabupaten) {
      return `${recommendation.kota_kabupaten}, ${recommendation.provinsi || ''}`;
    }
    
    return 'Alamat tidak tersedia';
  };

  const imageUrl = getImageUrl();

  return (
    <div className="snap-start w-[280px] sm:w-[300px] md:w-[320px] lg:w-[340px] flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
      {/* Image Container - Konsisten dengan aspek rasio */}
      <div className="relative overflow-hidden aspect-[4/3] flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={getDestinationName()}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-2xl"
            onError={(e) => {
              // Hide the broken image and show placeholder div
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Placeholder div */}
        <div 
          className={`absolute inset-0 w-full h-full bg-gradient-to-br from-[#3A59D1] to-[#2d47b8] ${imageUrl ? 'hidden' : 'flex'} items-center justify-center text-white`}
          style={{ display: imageUrl ? 'none' : 'flex' }}
        >
          <div className="text-center">
            <div className="text-3xl mb-2">🏖️</div>
            <div className="text-sm font-medium">Gambar Tidak Tersedia</div>
          </div>
        </div>

        {/* Kategori Badge */}
        {recommendation.kategori && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-block bg-[#3A59D1] bg-opacity-90 text-white text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
              {recommendation.kategori}
            </span>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
      </div>

      {/* Content Container - Tinggi tetap dengan padding konsisten */}
      <div className="p-5 flex-1 flex flex-col justify-between min-h-[180px]">
        {/* Top Content */}
        <div className="flex-1">
          {/* Nama Wisata */}
          <div className="mb-3">
            <h3 className="text-lg font-bold font-poppins text-gray-900 leading-tight line-clamp-2">
              {getDestinationName()}
            </h3>
          </div>

          {/* Alamat */}
          <div className="mb-4">
            <div className="flex items-start gap-2">
              <span className="text-[#3A59D1] text-sm mt-0.5 flex-shrink-0">📍</span>
              <p className="text-sm text-gray-600 font-poppins leading-relaxed line-clamp-2">
                {getDestinationAddress()}
              </p>
            </div>
          </div>
        </div>

        {/* Button Selengkapnya - Selalu di bagian bawah */}
        <div className="mt-auto">
          <button 
            onClick={handleDetailClick}
            className="w-full bg-[#3A59D1] text-white text-sm font-semibold py-3 px-4 rounded-xl hover:bg-[#2d47b8] active:bg-[#1e3a8a] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#3A59D1] focus:ring-opacity-50"
          >
            Lihat Selengkapnya
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;