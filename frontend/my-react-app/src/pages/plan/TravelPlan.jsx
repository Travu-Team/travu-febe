import { useEffect, useState } from "react";
import Papa from "papaparse";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const TravelPlan = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/data/travel-plans.csv")
      .then((res) => res.text())
      .then((data) => {
        const result = Papa.parse(data, { header: true, skipEmptyLines: true });
        setPlans(result.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching CSV:", err);
        setError("Gagal mengambil data perjalanan.");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="min-h-screen w-full bg-white">
        <header>
          <Navbar />
        </header>

        <main className="w-full min-h-screen bg-white px-6 md:px-20">
          {/* Header Section */}
          <div className="max-w-4xl mx-auto flex justify-between items-center mt-10">
            <h1 className="text-primary text-3xl font-semibold">Travel Plan</h1>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 flex items-center gap-2">
              ➕ Tambah Rencana Wisata
            </button>
          </div>

          {/* Handling Loading & Error States */}
          {loading && (
            <p className="text-center mt-5 text-gray-500">Loading data...</p>
          )}
          {error && <p className="text-center mt-5 text-red-500">{error}</p>}

          {/* List Travel Plans */}
          {!loading && !error && (
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={
                      plan.Image_Path && plan.Image_Path.startsWith("http")
                        ? plan.Image_Path
                        : `/images/${plan.Image_Path || "default.jpg"}`
                    }
                    alt={plan.Place_Name || "Destinasi"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      {plan.Place_Name || "Nama Tempat Tidak Tersedia"}
                    </h2>
                    <p className="text-gray-600 flex items-center space-x-2">
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="text-blue-600"
                      />
                      <span>{plan.City || "Lokasi Tidak Diketahui"}</span>
                    </p>
                    <div className="flex justify-end items-center mt-3">
                      <button className="text-red-500 hover:text-red-700 text-sm flex items-center space-x-2 transition-transform duration-200 hover:scale-110">
                        <FontAwesomeIcon icon={faTrash} />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <footer>
          <Footer />
        </footer>
      </div>
    </>
  );
};

export default TravelPlan;
