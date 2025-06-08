// src/pages/DetailPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const DestinasiDetail = () => {
  const { placeName } = useParams();
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/src/data/wisata_indonesia_final_fix.csv");
        const data = await response.text();
        const result = Papa.parse(data, { header: true, skipEmptyLines: true });

        // Decode placeName dari URL dan cari data yang cocok
        const decodedPlaceName = decodeURIComponent(placeName).trim().toLowerCase();
        
        const found = result.data.find(item => {
          // Cek berbagai kemungkinan field nama dari CSV
          const namaWisata = (item.nama_wisata || '').trim().toLowerCase();
          const nama = (item.nama || '').trim().toLowerCase();
          const name = (item.name || '').trim().toLowerCase();
          
          return decodedPlaceName === namaWisata || 
                 decodedPlaceName === nama || 
                 decodedPlaceName === name;
        });

        if (found) {
          setDetail(found);
        } else {
          console.warn('Detail not found for:', decodedPlaceName);
        }
      } catch (error) {
        console.error('Error fetching detail:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (placeName) {
      fetchDetail();
    }
  }, [placeName]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a59d1] mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat detail destinasi...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!detail) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="text-center">
            <h2 className="text-red-600 text-2xl font-bold">Data tidak ditemukan!</h2>
            <p className="text-gray-600">Pastikan URL sudah benar atau coba kembali nanti.</p>
            <p className="text-sm text-gray-500 mt-2">
              Mencari: {decodeURIComponent(placeName)}
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Handle image path - bisa dari berbagai sumber
  const getImageSrc = () => {
    const imagePath = detail.Image_Path || detail.image_path || detail.gambar;
    
    if (!imagePath) {
      return null;
    }
    
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    
    return `/public/images/${imagePath}`;
  };

  const imageSrc = getImageSrc();
  
  // Handle koordinat untuk Google Maps
  const latitude = detail.latitude || detail.lat;
  const longitude = detail.longitude || detail.lng || detail.lon;
  const googleMapsUrl = latitude && longitude 
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detail.nama_wisata || detail.nama)}`;

  // Handle nama destinasi
  const destinationName = detail.nama_wisata || detail.nama || detail.name || 'Destinasi';
  
  return (
    <>
      <Navbar />
      <main className="p-6 max-w-full mx-auto bg-white rounded-xl shadow-md my-6 min-h-screen">
        {/* Gambar dan Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Container */}
          <div className="w-full">
            {imageSrc && !imageError ? (
              <img 
                src={imageSrc} 
                alt={destinationName} 
                className="w-full h-auto max-h-96 object-cover rounded-lg mb-4"
                onError={(e) => {
                  console.log('Image failed to load:', e.target.src);
                  setImageError(true);
                }}
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-[#3A59D1] to-[#2d47b8] rounded-lg mb-4 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏖️</div>
                  <div className="text-lg font-medium">Gambar Tidak Tersedia</div>
                  <div className="text-sm opacity-80 mt-1">{destinationName}</div>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-blue-800 mb-2">{destinationName}</h1>
            <p className="text-sm text-gray-500 italic mb-4">
              {detail.kota_kabupaten || detail.kota || detail.kabupaten || ''}, {detail.provinsi || ''}
            </p>
            <p className="text-gray-700 text-base">
              {detail.deskripsi_bersih || detail.deskripsi || detail.description || 'Deskripsi tidak tersedia'}
            </p>

            <div className="mt-4 text-left">
              <h2 className="text-xl font-semibold text-gray-800">📍 Alamat</h2>
              <p className="text-gray-600 pl-2">
                {detail.alamat || detail.address || 'Alamat tidak tersedia'}
              </p>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-800">Kategori Wisata</h2>
              <p className="text-gray-600">
                {detail.kategori || detail.category || 'Kategori tidak tersedia'}
              </p>
            </div>
          </div>
        </div>

        {/* Tampilan Google Maps */}
        {(latitude && longitude) && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800">Lokasi</h2>
            <div className="w-full overflow-hidden rounded-lg">
              <iframe
                width="100%"
                height="300"
                className="rounded-lg"
                frameBorder="0"
                src={`https://maps.google.com/maps?q=${latitude},${longitude}&hl=id&z=15&output=embed`}
                allowFullScreen
                title="Lokasi Destinasi"
              />
            </div>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 block text-center mt-4"
            >
              Buka di Google Maps
            </a>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default DestinasiDetail;
