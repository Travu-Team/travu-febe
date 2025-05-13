import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const DestinasiDetail = () => {
  const { placeName } = useParams();
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    fetch("/data/data-destinasi-wisata.csv")
      .then((res) => res.text())
      .then((data) => {
        const result = Papa.parse(data, { header: true, skipEmptyLines: true });

        console.log("Parsed CSV Data:", result.data); // Debugging - cek isi CSV

        const found = result.data.find(item =>
          decodeURIComponent(placeName).trim().toLowerCase() === item.Place_Name.trim().toLowerCase()
        );

        console.log("Found Item:", found); // Debugging - cek apakah data ditemukan berdasarkan URL parameter

        setDetail(found);
      });
  }, [placeName]);

  if (!detail) return (
    <div className="text-center mt-10">
      <h2 className="text-red-600 text-2xl">Data tidak ditemukan!</h2>
      <p className="text-gray-600">Pastikan URL sudah benar atau coba kembali nanti.</p>
    </div>
  );

  const imageSrc = detail.Image_Path.startsWith("http") ? detail.Image_Path : `/images/${detail.Image_Path}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${detail.Lat},${detail.Long}`;

  return (
    <>
      <Navbar />
      <main className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md my-6">
        {/* Gambar dan Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <img src={imageSrc} alt={detail.Place_Name} className="w-full h-64 object-cover rounded-lg mb-4" />
          <div>
            <h1 className="text-3xl font-bold text-blue-800 mb-2">{detail.Place_Name}</h1>
            <p className="text-sm text-gray-500 italic mb-4">{detail.City}</p>
            <p className="text-gray-700 text-base">{detail.Description}</p>

            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-bold text-green-600">Rp {detail.Price}</span>
              <span className="text-yellow-500 text-lg">⭐ {detail.Rating} / 5</span>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-800">Kategori</h2>
              <p className="text-gray-600">{detail.Category}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800">Estimasi Waktu</h2>
              <p className="text-gray-600">{detail.Time_Minutes} menit</p>
            </div>
          </div>
        </div>

        {/* Tampilan Google Maps */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800">Lokasi</h2>
          <iframe
            width="100%"
            height="300"
            style={{ borderRadius: "8px" }}
            frameBorder="0"
            src={`https://maps.google.com/maps?q=${detail.Lat},${detail.Long}&hl=id&z=15&output=embed`}
            allowFullScreen
            title="Lokasi Destinasi"
            className="rounded-lg mb-4"
          />
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 block text-center"
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