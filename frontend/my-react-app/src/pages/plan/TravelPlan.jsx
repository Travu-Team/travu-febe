import { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen, faPlus, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import TravelPlanForm from "./TravelPlanForm";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TravelPlan = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [localPlans, setLocalPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk membuka koneksi IndexedDB
  const openIndexedDB = useCallback(() => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('travelPlanDB', 2);

      request.onerror = (event) => {
        console.error('Error membuka IndexedDB:', event.target.error);
        reject(event.target.error);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('rencanaWisata')) {
          const store = db.createObjectStore('rencanaWisata', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          // Tambahkan index untuk pencarian yang lebih efisien
          store.createIndex('planName', 'planName', { unique: false });
          store.createIndex('travelDate', 'travelDate', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
    });
  }, []);

  // Fungsi untuk mengambil semua data dari IndexedDB
  const fetchDataFromIndexedDB = useCallback(async () => {
    try {
      setLoading(true);
      const db = await openIndexedDB();
      
      if (!db.objectStoreNames.contains('rencanaWisata')) {
        console.log('Store rencanaWisata tidak ditemukan');
        setLocalPlans([]);
        setLoading(false);
        return;
      }

      const transaction = db.transaction(['rencanaWisata'], 'readonly');
      const store = transaction.objectStore('rencanaWisata');
      
      return new Promise((resolve, reject) => {
        const getAll = store.getAll();

        getAll.onsuccess = () => {
          const data = getAll.result || [];
          console.log('Data dari IndexedDB:', data);
          setLocalPlans(data);
          setLoading(false);
          resolve(data);
        };

        getAll.onerror = (error) => {
          console.error('Error saat mengambil data:', error);
          setLoading(false);
          reject(error);
        };

        transaction.oncomplete = () => {
          db.close();
        };
      });
    } catch (error) {
      console.error('Error dalam mengambil data:', error);
      setLoading(false);
    }
  }, [openIndexedDB]);

  // Fungsi untuk menyimpan data ke IndexedDB
  const saveDataToIndexedDB = useCallback(async (planData) => {
    try {
      const db = await openIndexedDB();
      const transaction = db.transaction(['rencanaWisata'], 'readwrite');
      const store = transaction.objectStore('rencanaWisata');
      
      // Menambahkan timestamp untuk tracking
      const dataToSave = {
        ...planData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return new Promise((resolve, reject) => {
        const request = store.add(dataToSave);

        request.onsuccess = () => {
          console.log('Data berhasil disimpan:', dataToSave);
          resolve(request.result);
        };

        request.onerror = (error) => {
          console.error('Error menyimpan data:', error);
          reject(error);
        };

        transaction.oncomplete = () => {
          db.close();
          // Refresh data setelah menyimpan
          fetchDataFromIndexedDB();
        };
      });
    } catch (error) {
      console.error('Error dalam menyimpan data:', error);
      throw error;
    }
  }, [openIndexedDB, fetchDataFromIndexedDB]);

  // Fungsi untuk menghapus data dari IndexedDB
  const deleteDataFromIndexedDB = useCallback(async (id) => {
    try {
      const db = await openIndexedDB();
      const transaction = db.transaction(['rencanaWisata'], 'readwrite');
      const store = transaction.objectStore('rencanaWisata');

      return new Promise((resolve, reject) => {
        const request = store.delete(id);

        request.onsuccess = () => {
          console.log('Data berhasil dihapus');
          resolve();
        };

        request.onerror = (error) => {
          console.error('Error menghapus data:', error);
          reject(error);
        };

        transaction.oncomplete = () => {
          db.close();
          // Refresh data setelah menghapus
          fetchDataFromIndexedDB();
        };
      });
    } catch (error) {
      console.error('Error dalam menghapus data:', error);
      throw error;
    }
  }, [openIndexedDB, fetchDataFromIndexedDB]);

  // Load data saat komponen dimount
  useEffect(() => {
    fetchDataFromIndexedDB();
  }, [fetchDataFromIndexedDB]);

  // Handle tutup modal dan refresh data
  const handleCloseModal = useCallback((newPlanData = null) => {
    setIsModalVisible(false);
    setEditingPlan(null);
    
    if (newPlanData) {
      fetchDataFromIndexedDB();
    }
  }, [fetchDataFromIndexedDB]);

  const handleEditPlan = useCallback((plan) => {
    setEditingPlan(plan);
    setIsModalVisible(true);
  }, []);

  // Komponen untuk konfirmasi penghapusan
 const DeleteConfirmationToast = ({ onConfirm, closeToast }) => (
  <div className="text-center ml-6">
    <div className="mb-3">
      <FontAwesomeIcon icon={faExclamationTriangle} className="text-orange-700 text-3xl" />
    </div>
    <div className="font-medium text-gray-900 mb-3">
      Yakin ingin menghapus item ini?
    </div>
    <div className="flex gap-2 justify-center">
      <button
        onClick={() => {
          closeToast();
        }}
        className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
      >
        Batal
      </button>
      <button
        onClick={() => {
          onConfirm();
          closeToast();
        }}
        className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
      >
        Hapus
      </button>
    </div>
  </div>
);

  // Handle untuk hapus plan
  const handleDeletePlan = useCallback(async (planId) => {
    toast.warning(
      <DeleteConfirmationToast
        onCancel={() => toast.dismiss()}
        onConfirm={async () => {
          toast.dismiss();
          try {
            await deleteDataFromIndexedDB(planId);
            toast.success('Rencana anda berhasil dihapus');
          } catch (error) {
            console.error("Error menghapus rencana wisata:", error);
            toast.error('Gagal menghapus rencana wisata');
          }
        }}
      />,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        icon: false,
        className: "rounded-lg shadow-lg",
      }
    );
  }, [deleteDataFromIndexedDB]);

  return (
    <>
      <div className="min-h-screen w-full bg-white">
        <ToastContainer position="top-center" autoClose={3000} style={{ top: '50px' }} />
        <header>
          <Navbar />
        </header>

        <main className="w-full min-h-screen bg-white px-6 md:px-20">
          {/* Header Section */}
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:justify-between items-center mt-10">
            <h1 className="text-primary text-3xl font-semibold mb-4 md:mb-0">Rencana Wisata</h1>
            <button className="bg-primary text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 flex items-center gap-2 transition-colors w-full md:w-auto justify-center" onClick={() => setIsModalVisible(true)}>
              <FontAwesomeIcon icon={faPlus} /> Tambah Rencana
            </button>
          </div>

          <TravelPlanForm
            visible={isModalVisible}
            onClose={handleCloseModal}
            onSave={saveDataToIndexedDB}
            editingPlan={editingPlan}
          />

          {/* Menampilkan data dari IndexedDB */}
          {loading ? (
            <div className="text-center mt-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2">Memuat data...</p>
            </div>
          ) : localPlans.length === 0 ? (
            <div className="text-center mt-10">
              <p className="text-gray-500 text-lg">Belum ada rencana wisata</p>
              <p className="text-gray-400">Klik tombol "Tambah Rencana Wisata" untuk membuat rencana wisatamu</p>
            </div>
          ) : (
            <div className="mt-8 max-w-4xl mx-auto ">
              <div className="mb-4">
                <p className="text-gray-600">Total rencana wisata saat ini: {localPlans.length}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                {localPlans.map((plan) => (
                  <div key={plan.id} className="border rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow">
                    <div className="p-4">
                      {/* Menampilkan Nama Rencana dan Tombol Aksi */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg text-black mb-1">{plan.planName}</h3>
                          <p className="text-black mb-2">
                            Tanggal: {plan.travelDate ? new Date(plan.travelDate).toLocaleDateString('id-ID') : 'Tidak ditentukan'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditPlan(plan)} className="text-blue-500 hover:text-blue-700" title="Edit rencana">
                            <FontAwesomeIcon icon={faPen} className="text-orange-500" />
                          </button>
                          <button onClick={() => handleDeletePlan(plan.id)} className="text-red-500 hover:text-red-700" title="Hapus rencana">
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>

                      {/* Menampilkan Grid Gambar Destinasi */}
                      {plan.destinations && plan.destinations.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {plan.destinations.slice(0, 4).map((dest, idx) => (
                            <div key={idx} className="aspect-video relative">
                              <img
                                src={dest.Image_Path || '/placeholder-image.jpg'}
                                alt={dest.nama_wisata || 'Destinasi'}
                                className="w-full h-full object-cover rounded"
                                onError={(e) => {
                                  e.target.src = '/placeholder-image.jpg';
                                }}
                              />
                            </div>
                          ))}
                          {plan.destinations.length > 4 && (
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                              +{plan.destinations.length - 4} lainnya
                            </div>
                          )}
                        </div>
                      )}

                      {/* Menampilkan Daftar Destinasi Wisata */}
                      {plan.destinations && plan.destinations.length > 0 && (
                        <div>
                          <p className="text-black text-sm mb-1">
                            Daftar Destinasi ({plan.destinations.length}):
                          </p>
                          <ul className="list-decimal text-black pl-4 max-h-24 overflow-y-auto">
                            {plan.destinations.map((dest, idx) => (
                              <li key={idx} className="text-black text-sm">
                                {dest.nama_wisata || 'Destinasi'} - {dest.provinsi || 'Provinsi tidak diketahui'}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {plan.createdAt && (
                        <p className="text-xs text-gray-400 mt-2">
                          Dibuat: {new Date(plan.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      )}
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