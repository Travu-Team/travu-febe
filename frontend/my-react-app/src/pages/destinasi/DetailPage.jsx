import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const DestinasiDetail = () => {
  const { placeName } = useParams();
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    fetch("/src/data/wisata_indonesia_final_fix.csv")
      .then((res) => res.text())
      .then((data) => {
        const result = Papa.parse(data, { header: true, skipEmptyLines: true });

        const found = result.data.find(
          (item) =>
            decodeURIComponent(placeName).trim().toLowerCase() ===
            item.nama_wisata.trim().toLowerCase()
        );

        if (found) {
          setDetail(found);
        }
      });
  }, [placeName]);

  if (!detail)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-red-600 text-2xl font-bold">
            Data tidak ditemukan!
          </h2>
          <p className="text-gray-600">
            Pastikan URL sudah benar atau coba kembali nanti.
          </p>
        </div>
      </div>
    );

  const imageSrc = detail.Image_Path.startsWith("http")
    ? detail.Image_Path
    : `/public/images/${detail.Image_Path}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${detail.latitude},${detail.longitude}`;

  return (
    <>
      <div className="min-h-screen w-full bg-[#FDFDFD]">
        <Navbar />
        <main className="p-6 max-w-full mx-auto bg-white rounded-xl shadow-md my-6 min-h-screen">
          {/* Gambar dan Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <img
              src={imageSrc}
              alt={detail.nama_wisata}
              className="w-full h-auto max-h-96 object-cover rounded-lg mb-4"
            />
            <div>
              <h1 className="text-3xl font-bold text-blue-800 mb-2">
                {detail.nama_wisata}
              </h1>
              <p className="text-sm text-gray-500 italic mb-4">
                {detail.kota_kabupaten}, {detail.provinsi}
              </p>
              <p className="text-gray-700 text-base">
                {detail.deskripsi_bersih}
              </p>

              <div className="mt-4 text-left">
                <h2 className="text-xl font-semibold text-gray-800">
                  📍 Alamat
                </h2>
                <p className="text-gray-600 pl-2">{detail.alamat}</p>
              </div>

              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Kategori Wisata
                </h2>
                <p className="text-gray-600">{detail.kategori}</p>
              </div>
            </div>
          </div>

          {/* Tampilan Google Maps */}
          <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-2">
                Lokasi Wisata
              </h2>
            </div>

            <div className="w-full flex justify-center mb-8">
              <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-xl border-4 border-white text-blue-600">
                <iframe
                  width="100%"
                  height="450"
                  frameBorder="0"
                  className="w-full "
                  src={`https://maps.google.com/maps?q=${detail.latitude},${detail.longitude}&hl=id&z=15&output=embed`}
                  allowFullScreen
                  title="Lokasi Destinasi"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white hover:text-white visited:text-white focus:text-white active:text-white font-bold px-8 py-4 rounded-xl text-center shadow-lg no-underline"
              >
                <span className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faLocationDot} className="text-xl" />
                  Buka di Google Maps
                </span>
              </a>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default DestinasiDetail;
