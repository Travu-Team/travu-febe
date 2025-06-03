import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const DestinasiDetail = () => {
  const { placeName } = useParams();
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    fetch("/src/data/wisata_indonesia_final_fix.csv")
      .then((res) => res.text())
      .then((data) => {
        const result = Papa.parse(data, { header: true, skipEmptyLines: true });

        const found = result.data.find(item =>
          decodeURIComponent(placeName).trim().toLowerCase() === item.nama_wisata.trim().toLowerCase()
        );

        if (found) {
          setDetail(found);
        }
      });
  }, [placeName]);

  if (!detail) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h2 className="text-red-600 text-2xl font-bold">Data tidak ditemukan!</h2>
        <p className="text-gray-600">Pastikan URL sudah benar atau coba kembali nanti.</p>
      </div>
    </div>
  );

  const imageSrc = detail.Image_Path.startsWith("http") ? detail.Image_Path : `/public/images/${detail.Image_Path}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${detail.latitude},${detail.longitude}`;

  return (
    <>
      <Navbar />
      <main className="p-6 max-w-full mx-auto bg-white rounded-xl shadow-md my-6 min-h-screen">
        {/* Gambar dan Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <img src={imageSrc} alt={detail.nama_wisata} className="w-full h-auto max-h-96 object-cover rounded-lg mb-4" />
          <div>
            <h1 className="text-3xl font-bold text-blue-800 mb-2">{detail.nama_wisata}</h1>
            <p className="text-sm text-gray-500 italic mb-4">{detail.kota_kabupaten}, {detail.provinsi}</p>
            <p className="text-gray-700 text-base">{detail.deskripsi_bersih}</p>

            <div className="mt-4 text-left">
              <h2 className="text-xl font-semibold text-gray-800">📍 Alamat</h2>
              <p className="text-gray-600 pl-2">{detail.alamat}</p>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-800">Kategori Wisata</h2>
              <p className="text-gray-600">{detail.kategori}</p>
            </div>
          </div>
        </div>

        {/* Tampilan Google Maps */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800">Lokasi</h2>
          <div className="w-full overflow-hidden rounded-lg">
            <iframe
              width="100%"
              height="300"
              className="rounded-lg"
              frameBorder="0"
              src={`https://maps.google.com/maps?q=${detail.latitude},${detail.longitude}&hl=id&z=15&output=embed`}
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
      </main>
      <Footer />
    </>
  );
};

export default DestinasiDetail;