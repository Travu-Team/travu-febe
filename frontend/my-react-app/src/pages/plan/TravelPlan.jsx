import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import TravelPlanForm from "./TravelPlanForm";

const TravelPlan = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false); // Add this state
  const [localPlans, setLocalPlans] = useState([]); // State baru untuk data IndexedDB

  useEffect(() => {
    // Fetch travel plans from backend API instead of CSV
    const fetchPlans = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const response = await fetch('http://localhost:5000/api/travel-plans', {
          headers: {
            'Authorization': `Bearer ${userData?.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch travel plans');
        }
        const data = await response.json();
        setPlans(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError("Gagal mengambil data rencana perjalananmu");
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Fungsi untuk mengambil data dari IndexedDB
  const ambilDataDariIndexedDB = () => {
    const request = indexedDB.open('travelPlanDB', 2);

    request.onerror = (event) => {
      console.error('Error membuka IndexedDB:', event.target.error);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('rencanaWisata')) {
        db.createObjectStore('rencanaWisata', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      try {
        const db = event.target.result;
        const transaction = db.transaction(['rencanaWisata'], 'readonly');
        const store = transaction.objectStore('rencanaWisata');
        const getAll = store.getAll();

        getAll.onsuccess = () => {
          setLocalPlans(getAll.result || []);
        };

        transaction.oncomplete = () => {
          db.close();
        };
      } catch (error) {
        console.error('Error mengambil data:', error);
        setLocalPlans([]);
      }
    };
  };

  // Memanggil fungsi saat komponen dimount
  useEffect(() => {
    ambilDataDariIndexedDB();
  }, []);

  const closeModal = () => {
    setIsModalVisible(false);
    ambilDataDariIndexedDB(); // Refresh data setelah modal ditutup
  };

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
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 flex items-center gap-2"
              onClick={() => setIsModalVisible(true)} // Add this onClick handler
            >
              ➕ Tambah Rencana Wisata
            </button>
          </div>

          {/* Add Modal Form Component */}
          <TravelPlanForm
            visible={isModalVisible}
            onClose={closeModal} // Gunakan closeModal sebagai handler
            onSuccess={ambilDataDariIndexedDB}
          />

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

          {/* Tampilkan data dari IndexedDB */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Rencana Tersimpan Lokal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {localPlans.map((plan, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white shadow">
                  <h3 className="font-bold text-lg">{plan.namaRencana}</h3>
                  <p className="text-gray-600">
                    Tanggal: {new Date(plan.tanggal).toLocaleDateString()}
                  </p>
                  <div className="mt-2">
                    <p className="font-semibold">Destinasi:</p>
                    <ul className="list-disc ml-4">
                      {plan.destinasi.map((dest, idx) => (
                        <li key={idx}>{dest.nama_wisata}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Dibuat: {new Date(plan.waktuDibuat).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer>
          <Footer />
        </footer>
      </div>
    </>
  );
};

export default TravelPlan;
