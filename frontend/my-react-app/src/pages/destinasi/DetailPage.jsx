// src/pages/DetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const DestinasiDetail = () => {
  const { placeName } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Path yang benar untuk file di folder public
        const response = await fetch("/wisata_indonesia_final_fix.csv");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.text();
        const result = Papa.parse(data, { 
          header: true, 
          skipEmptyLines: true,
          dynamicTyping: true,
          delimitersToGuess: [',', '\t', '|', ';']
        });

        if (result.errors && result.errors.length > 0) {
          console.warn("CSV parsing warnings:", result.errors);
        }

        // Decode placeName dari URL dan cari data yang cocok
        const decodedPlaceName = decodeURIComponent(placeName)
          .trim()
          .toLowerCase();

        const found = result.data.find((item) => {
          if (!item) return false;
          
          // Cek berbagai kemungkinan field nama dari CSV
          const namaWisata = (item.nama_wisata || "").toString().trim().toLowerCase();
          const nama = (item.nama || "").toString().trim().toLowerCase();
          const name = (item.name || "").toString().trim().toLowerCase();

          return (
            decodedPlaceName === namaWisata ||
            decodedPlaceName === nama ||
            decodedPlaceName === name
          );
        });

        if (found) {
          setDetail(found);
        } else {
          console.warn("Detail not found for:", decodedPlaceName);
          setError("Data destinasi tidak ditemukan");
        }
      } catch (error) {
        console.error("Error fetching detail:", error);
        setError("Gagal memuat data destinasi");
      } finally {
        setIsLoading(false);
      }
    };

    if (placeName) {
      fetchDetail();
    }
  }, [placeName]);

  // Handle image path - bisa dari berbagai sumber
  const getImageSrc = () => {
    if (!detail) return null;
    
    const imagePath = detail.Image_Path || detail.image_path || detail.gambar;

    if (!imagePath) {
      return null;
    }

    // Jika sudah URL lengkap
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Path relatif ke folder public/images
    return `/images/${imagePath}`;
  };

  // Handle koordinat untuk Google Maps
  const getMapData = () => {
    if (!detail) return null;
    
    const latitude = parseFloat(detail.latitude || detail.lat);
    const longitude = parseFloat(detail.longitude || detail.lng || detail.lon);
    
    const destinationName = detail.nama_wisata || detail.nama || detail.name || "Destinasi";
    
    const googleMapsUrl = (latitude && longitude && !isNaN(latitude) && !isNaN(longitude))
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destinationName)}`;

    return {
      latitude: !isNaN(latitude) ? latitude : null,
      longitude: !isNaN(longitude) ? longitude : null,
      googleMapsUrl,
      destinationName
    };
  };

  // Helper function untuk capitalize first letter
  const capitalizeFirstLetter = (string) => {
    if (!string) return "Kategori Tidak Tersedia";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-white">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen px-3 py-4">
          <div className="text-center bg-white p-4 rounded-2xl shadow-lg max-w-md w-full mx-3">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg font-medium">Memuat detail destinasi...</p>
            <div className="mt-4 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-red-50 to-white">
        <Navbar />
        <div className="flex justify-center items-center min-h-screen px-3 py-4">
          <div className="text-center max-w-md mx-auto bg-white p-4 rounded-2xl shadow-lg border border-red-100">
            <div className="text-red-500 text-7xl mb-6 animate-pulse">⚠️</div>
            <h2 className="text-red-600 text-2xl font-bold mb-4">
              {error || "Data tidak ditemukan!"}
            </h2>
            <p className="text-gray-600 mb-3 leading-relaxed">
              Pastikan URL sudah benar atau coba kembali nanti.
            </p>
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-gray-500">
                Mencari: <span className="font-mono text-gray-700">{decodeURIComponent(placeName)}</span>
              </p>
            </div>
            <button
              onClick={handleBackClick}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              ← Kembali
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const imageSrc = getImageSrc();
  const mapData = getMapData();
  const destinationName = mapData?.destinationName || "Destinasi";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navbar />
      <main className="container mx-auto px-3 py-4 max-w-7xl">
        {/* Enhanced Back Button */}
        <button
          onClick={handleBackClick}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-all duration-200 group bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow-md"
        >
          <span className="mr-2 group-hover:-translate-x-1 transition-transform duration-200">←</span>
          <span className="font-medium">Kembali</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header Section with Enhanced Design */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            {/* Enhanced Image Container */}
            <div className="w-full">
              {imageSrc && !imageError ? (
                <div className="relative group">
                  <img
                    src={imageSrc}
                    alt={destinationName}
                    className="w-full h-80 lg:h-96 object-cover rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      console.log("Image failed to load:", e.target.src);
                      setImageError(true);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : (
                <div className="w-full h-80 lg:h-96 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl shadow-lg flex items-center justify-center text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                  <div className="text-center relative z-10">
                    <div className="text-7xl mb-4 animate-bounce">🏖️</div>
                    <div className="text-xl font-semibold mb-2">
                      Gambar Tidak Tersedia
                    </div>
                    <div className="text-sm opacity-90 bg-white/20 px-3 py-1 rounded-full">
                      {destinationName}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Info Container */}
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl shadow-lg">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  {destinationName}
                </h1>
                <div className="flex items-center text-blue-100">
                  <span className="mr-2">📍</span>
                  <p className="text-lg">
                    {[
                      detail.kota_kabupaten || detail.kota || detail.kabupaten,
                      detail.provinsi
                    ].filter(Boolean).join(", ") || "Lokasi tidak tersedia"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-xl border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="mr-2 text-2xl">📝</span>
                    <span>Deskripsi</span>
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {detail.deskripsi_bersih ||
                      detail.deskripsi ||
                      detail.description ||
                      "Deskripsi tidak tersedia"}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-green-50 p-3 rounded-xl border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="mr-2 text-2xl">📍</span>
                    <span>Alamat</span>
                  </h2>
                  <p className="text-gray-700 text-base">
                    {detail.alamat || detail.address || "Alamat tidak tersedia"}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-3 rounded-xl border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="mr-2 text-2xl">🏷️</span>
                    <span>Kategori Wisata</span>
                  </h2>
                  <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                    {capitalizeFirstLetter(detail.kategori || detail.category)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Map Section */}
          {mapData && (mapData.latitude && mapData.longitude) && (
            <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 p-4">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-3 text-4xl">🗺️</span>
                <span>Lokasi</span>
              </h2>
              <div className="w-full overflow-hidden rounded-xl shadow-lg mb-4 border-4 border-white">
                <iframe
                  width="100%"
                  height="450"
                  className="rounded-lg"
                  frameBorder="0"
                  src={`https://maps.google.com/maps?q=${mapData.latitude},${mapData.longitude}&hl=id&z=15&output=embed`}
                  allowFullScreen
                  title="Lokasi Destinasi"
                  loading="lazy"
                />
              </div>
              <a
                href={mapData.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="mr-3 text-xl">🗺️</span>
                <span>Buka di Google Maps</span>
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DestinasiDetail;