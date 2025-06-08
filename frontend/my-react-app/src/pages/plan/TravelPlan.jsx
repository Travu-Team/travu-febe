import { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TravelPlanForm from "./TravelPlanForm";

const TravelPlan = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localPlans, setLocalPlans] = useState([]);
  const [loading, setLoading] = useState(true);


  const ambilDataDariIndexedDB = useCallback(() => {
  const request = indexedDB.open('travelPlanDB', 2);

    request.onerror = (event) => {
      console.error('Error membuka IndexedDB:', event.target.error);
      setLoading(false);
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
        if (!db.objectStoreNames.contains('rencanaWisata')) {
          console.log('Store rencanaWisata tidak ditemukan');
          setLoading(false);
          return;
        }

        const transaction = db.transaction(['rencanaWisata'], 'readonly');
        const store = transaction.objectStore('rencanaWisata');
        const getAll = store.getAll();

        getAll.onsuccess = () => {
          console.log('Data dari IndexedDB:', getAll.result); // Debug log
          setLocalPlans(getAll.result || []);
          setLoading(false);
        };

        getAll.onerror = (error) => {
          console.error('Error saat mengambil data:', error);
          setLoading(false);
        };

        transaction.oncomplete = () => {
          db.close();
        };
      } catch (error) {
        console.error('Error dalam transaksi:', error);
        setLoading(false);
      }
    };
  }, []);

  useEffect(() => {
    ambilDataDariIndexedDB();
  }, [ambilDataDariIndexedDB]);

  const handleCloseModal = () => {
    setIsModalVisible(false);
    ambilDataDariIndexedDB(); // Refresh data setelah modal ditutup
  };

  // Menambahkan effect untuk memanggil fungsi ambil data setiap kali modal ditutup
  useEffect(() => {
    if (!isModalVisible) {
      ambilDataDariIndexedDB();
    }
  }, [isModalVisible, ambilDataDariIndexedDB]);

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
              onClick={() => setIsModalVisible(true)}
            >
              ➕ Tambah Rencana Wisata
            </button>
          </div>

          <TravelPlanForm
            visible={isModalVisible}
            onClose={handleCloseModal}
          />

          {/* Menampilkan data dari IndexedDB */}
          {loading ? (
            <div className="text-center mt-10">Loading...</div>
          ) : (
            <div className="mt-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {localPlans.map((plan, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden bg-white shadow">
                    {/* Grid untuk gambar destinasi */}
                    <div className="grid grid-cols-2 gap-2 p-2">
                      {plan.destinations.slice(0, 4).map((dest, idx) => (
                        <div key={idx} className="aspect-video relative">
                          <img
                            src={dest.Image_Path}
                            alt={dest.nama_wisata}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Informasi Rencana Wisata */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg">{plan.planName}</h3>
                      <p className="text-gray-600">
                        Tanggal: {new Date(plan.travelDate).toLocaleDateString()}
                      </p>
                      <div className="mt-2">
                        <p className="font-semibold">Destinasi:</p>
                        <ul className="list-disc ml-4">
                          {plan.destinations.map((dest, idx) => (
                            <li key={idx} className="text-gray-700">
                              {dest.nama_wisata} - {dest.provinsi}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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