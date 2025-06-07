import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import Papa from 'papaparse';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const TravelPlanForm = ({ visible, onClose}) => {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [wisataData, setWisataData] = useState([]);
  const [travelPlan, setTravelPlan] = useState({
    name: '',
    date: '',
    items: []
  });
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mengambil data dari file CSV saat modal terbuka
  useEffect(() => {
    if (visible) {
      fetch('/src/data/wisata_indonesia_final_fix.csv')
        .then(res => res.text())
        .then(csvText => {
          const result = Papa.parse(csvText, { header: true });
          setWisataData(result.data);
          const uniqueCategories = [...new Set(result.data.map(item => item.kategori))];
          setCategories(uniqueCategories);
        });
    }
  }, [visible]);

  // Inisialisasi IndexedDB
  useEffect(() => {
    const initDB = () => {
      const request = indexedDB.open('travelPlanDB', 2); // Increment version number
      
      request.onerror = (event) => {
        console.error('Error membuka IndexedDB:', event.target.error);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains('rencanaWisata')) {
          db.createObjectStore('rencanaWisata', { keyPath: 'id', autoIncrement: true });
          console.log('Object store rencanaWisata created');
        }
      };

      request.onsuccess = () => {
        console.log('IndexedDB initialized successfully');
      };
    };

    initDB();
    return () => {
      // Cleanup when component unmounts
      const request = indexedDB.deleteDatabase('travelPlanDB');
      request.onsuccess = () => console.log('Database cleaned up');
    };
  }, []);

  const handleAddItem = (item) => {
    if (!travelPlan.name || !travelPlan.date) {
      alert('Harap isi nama dan tanggal rencana wisatamu terlebih dahulu!');
      return;
    }
    setTravelPlan(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));
  };

  const handleRemoveItem = (index) => {
    setTravelPlan(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleNameChange = (e) => {
    setTravelPlan(prev => ({
      ...prev,
      name: e.target.value
    }));
  };

  const handleDateChange = (e) => {
    setTravelPlan(prev => ({
      ...prev,
      date: e.target.value
    }));
  };

  useEffect(() => {
    if (selectedProvince && selectedCategory) {
      const results = wisataData.filter(item =>
        item.provinsi === selectedProvince &&
        item.kategori === selectedCategory
      );
      setSearchResults(results);
    }
  }, [selectedProvince, selectedCategory, wisataData]);

  // Fungsi untuk menyimpan ke IndexedDB
  const simpanKeIndexedDB = async (data) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('travelPlanDB', 2);

      request.onerror = () => reject(request.error);
      
      request.onsuccess = (event) => {
        try {
          const db = event.target.result;
          const transaction = db.transaction(['rencanaWisata'], 'readwrite');
          const store = transaction.objectStore('rencanaWisata');

          const addRequest = store.add({
            ...data,
            waktuDibuat: new Date().toISOString()
          });

          addRequest.onsuccess = () => resolve();
          addRequest.onerror = () => reject(addRequest.error);

          transaction.oncomplete = () => {
            db.close();
          };
        } catch (error) {
          reject(error);
        }
      };
    });
  };

  // Reset form state when modal closes
  useEffect(() => {
    if (!visible) {
      setTravelPlan({
        name: '',
        date: '',
        items: []
      });
      setSelectedProvince('');
      setSelectedCategory('');
      setSearchResults([]);
    }
  }, [visible]);

  const handleSubmitPlan = async () => {
    if (!travelPlan.name || !travelPlan.date || travelPlan.items.length === 0) {
      alert('Harap isi semua data dan pilih minimal 1 tempat wisata!');
      return;
    }

    setIsSubmitting(true);
    try {
      await simpanKeIndexedDB({
        planName: travelPlan.name,
        travelDate: travelPlan.date,
        destinations: travelPlan.items
      });

      alert('Rencana perjalananmu berhasil disimpan!');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={() => {
        setIsSubmitting(false); // Reset submitting state
        onClose();
      }}
      width={1200}
      title="Tambah Rencana Wisata"
      footer={null}
    >
      <div className="grid grid-cols-2 gap-8">
        {/* Kolom Kiri */}
        <div>
          <div className="mb-4">
            <label className="block mb-2">Nama Rencana Wisatamu</label>
            <input
              type="text"
              className="w-full border rounded-md p-2"
              value={travelPlan.name}
              onChange={handleNameChange}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Tanggal Rencana Wisata</label>
            <input
              type="date"
              className="w-full border rounded-md p-2"
              value={travelPlan.date}
              onChange={handleDateChange}
            />
          </div>

          {/* Tampilan Travel Plan */}
          {travelPlan.name && travelPlan.date && (
            <div className="mt-4 border rounded-md p-4 bg-gray-50">
              <div className="mb-4">
                <h3 className="font-bold text-lg">{travelPlan.name}</h3>
                <p className="text-gray-600">Tanggal: {new Date(travelPlan.date).toLocaleDateString()}</p>
              </div>
              
              <div className="space-y-4">
                {travelPlan.items.map((item, index) => (
                  <div key={index} className="border rounded-md p-4 bg-white">
                    <div className="grid grid-cols-2 gap-4">
                      <img 
                        src={item.Image_Path} 
                        alt={item.nama_wisata} 
                        className="w-full h-32 object-cover rounded" 
                      />
                      <div>
                        <h4 className="font-bold">{item.nama_wisata}</h4>
                        <p className="text-gray-600">{item.provinsi}</p>
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="mt-2 text-red-500 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-2" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/*Button Konfirmasi Menyimpan Rencana Perjalanan*/}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSubmitPlan}
                  disabled={isSubmitting}
                  className={`
                    px-4 py-2 rounded-md text-white
                    ${isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-500 hover:bg-green-600'}
                  `}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Konfirmasi'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Kolom Kanan */}
        <div>
          <div className="mb-4">
            <label className="block mb-2">Provinsi</label>
            <select
              className="w-full border rounded-md p-2"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
            >
              <option value="">Pilih Provinsi</option>
              {[...new Set(wisataData.map(item => item.provinsi))].map(prov => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Kategori Wisata</label>
            <select
              className="w-full border rounded-md p-2"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Pilih Kategori</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Card Hasil Pencarian Wisata */}
          <div className="mt-4 space-y-4 max-h-[500px] overflow-y-auto">
            {searchResults.map((item, index) => (
              <div key={index} className="border rounded-md p-4">
                <div className="grid grid-cols-2 gap-4">
                  <img src={item.Image_Path} alt={item.nama_wisata} className="w-full h-32 object-cover rounded" />
                  <div>
                    <h4 className="font-bold">{item.nama_wisata}</h4>
                    <p>{item.provinsi}</p>
                    <button
                      className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleAddItem(item)}
                    >
                      Tambah ke Rencana
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TravelPlanForm;