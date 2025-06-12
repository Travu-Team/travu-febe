import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import Papa from 'papaparse';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faExclamationTriangle, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TravelPlanForm = ({ visible, onClose, editingPlan }) => {
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
      fetch('/wisata_indonesia_final_fix.csv')
        .then(res => res.text())
        .then(csvText => {
          const result = Papa.parse(csvText, { header: true });
          setWisataData(result.data);
          const uniqueCategories = [...new Set(result.data.map(item => item.kategori))];
          setCategories(uniqueCategories);
        })
        .catch(error => {
          console.error('Error loading CSV:', error);
        });
    }
  }, [visible]);

  // Inisialisasi IndexedDB
  useEffect(() => {
    const initDB = () => {
      const request = indexedDB.open('travelPlanDB', 2);
      
      request.onerror = (event) => {
        console.error('Error membuka IndexedDB:', event.target.error);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('rencanaWisata')) {
          const store = db.createObjectStore('rencanaWisata', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          // Menambahkan index untuk pencarian 
          store.createIndex('planName', 'planName', { unique: false });
          store.createIndex('travelDate', 'travelDate', { unique: false });
          
          console.log('Object store rencanaWisata created with indexes');
        }
      };

      request.onsuccess = () => {
        console.log('IndexedDB initialized successfully');
      };
    };

    initDB();
  }, []);

  const handleAddItem = (item) => {
    if (!travelPlan.name || !travelPlan.date) {
      toast.warning('Harap isi nama dan tanggal rencana wisatamu terlebih dahulu!');
      return;
    }

    // Cek duplikasi
    const isDuplicate = travelPlan.items.some(existingItem => 
      existingItem.nama_wisata === item.nama_wisata
    );

    if (isDuplicate) {
      toast.info('Destinasi ini sudah ada dalam rencana Anda!');
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

  const handleDateChange = (date) => {
    setTravelPlan(prev => ({
      ...prev,
      date: date ? date.toISOString().split('T')[0] : ''
    }));
  };

  useEffect(() => {
    if (selectedProvince && selectedCategory) {
      const results = wisataData.filter(item =>
        item.provinsi === selectedProvince &&
        item.kategori === selectedCategory
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [selectedProvince, selectedCategory, wisataData]);

  // Fungsi untuk menyimpan ke IndexedDB 
  const saveTravelPlan = async (data) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('travelPlanDB', 2);

      request.onerror = (event) => {
        console.error('Error opening IndexedDB:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        try {
          const transaction = db.transaction(['rencanaWisata'], 'readwrite');
          const store = transaction.objectStore('rencanaWisata');

          // Memastikan data memiliki struktur yang konsisten
          const dataToSave = {
            planName: data.planName,
            travelDate: data.travelDate,
            destinations: data.destinations || [],
            createdAt: data.id ? data.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          let operation;
          if (data.id) {
            // Update existing record
            dataToSave.id = data.id;
            operation = store.put(dataToSave);
          } else {
            // Create new record
            operation = store.add(dataToSave);
          }

          operation.onsuccess = () => resolve(operation.result);
          operation.onerror = (error) => reject(error);

          transaction.oncomplete = () => db.close();
        } catch (error) {
          reject(error);
        }
      };
    });
  };

  // Load editing plan data ketika tersedia
  useEffect(() => {
    if (editingPlan && visible) {
      setTravelPlan({
        name: editingPlan.planName,
        date: editingPlan.travelDate,
        items: editingPlan.destinations || []
      });
    }
  }, [editingPlan, visible]);

  // Reset form state ketika modal tertutup
  useEffect(() => {
    if (!visible) {
      // Mereset dengan delay kecil
      setTimeout(() => {
        setTravelPlan({
          name: '',
          date: '',
          items: []
        });
        setSelectedProvince('');
        setSelectedCategory('');
        setSearchResults([]);
        setIsSubmitting(false);
      }, 100);
    }
  }, [visible]);

  // Handle submit dengan error handling
  const handleSubmitPlan = async () => {
    // Validasi input
    if (!travelPlan.name.trim()) {
      toast.warning('Nama rencana wisata harus diisi!');
      return;
    }

    if (!travelPlan.date) {
      toast.warning('Tanggal rencana wisata harus dipilih!');
      return;
    }

    if (travelPlan.items.length === 0) {
      toast.warning('Pilih minimal 1 tempat wisata untuk rencana Anda!');
      return;
    }

    // Validasi tanggal tidak boleh di masa lalu
    const selectedDate = new Date(travelPlan.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.warning('Mohon perbarui dengan tanggal terbaru!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const dataToSave = {
        ...(editingPlan?.id ? { 
          id: editingPlan.id,
          createdAt: editingPlan.createdAt 
        } : {}),
        planName: travelPlan.name.trim(),
        travelDate: travelPlan.date,
        destinations: travelPlan.items
      };

      await saveTravelPlan(dataToSave);
      toast.success(editingPlan ? 'Rencana anda berhasil diperbarui!' : 'Rencana anda berhasil disimpan!');
      onClose(true);
    } catch (error) {
      console.error('Error saving travel plan:', error);
      toast.error('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CancelConfirmationModal = ({ onConfirm, closeToast }) => (
    <div className="text-center ml-6">
      <div className="mb-3">
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-orange-700 text-3xl" />
      </div>
      <div className="font-medium text-gray-900 mb-3">
        Anda memiliki rencana yang belum disimpan. Yakin ingin menutup?
      </div>
      <div className="flex gap-2 justify-center">
        <button
          onClick={closeToast}
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
          Ya, Tutup
        </button>
      </div>
    </div>
  );

  // Jika ada item dalam rencana, tampilkan konfirmasi
  const handleCancel = () => {
    if (travelPlan.items.length > 0) {
      toast.warning(
        <CancelConfirmationModal
          onCancel={() => toast.dismiss()}
          onConfirm={() => {
            setIsSubmitting(false);
            onClose();
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
      return;
    }
    
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      width="85vw"
      className="lg:w-1/2 lg:!max-w-[800px]"
      title="Tambah Rencana Wisata"
      footer={null}
      destroyOnClose={false}
      maskClosable={false} 
    >
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="bg-white text-black">
        {/* Kolom Kiri */}
        <div className="grid grid-rows-1 md:grid-rows-2 ">
          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Nama Rencana <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
              value={travelPlan.name}
              onChange={handleNameChange}
              placeholder="Contoh: Liburan ke Bali"
              maxLength={100}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Rencana Pergi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DatePicker
                selected={travelPlan.date ? new Date(travelPlan.date) : null}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                placeholderText="Pilih tanggal"
                className="w-full border rounded-md p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                wrapperClassName="w-full"
              />
              <FontAwesomeIcon 
                icon={faCalendarAlt} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none"
              />
            </div>
          </div>
        
        {/* Kolom Kanan */}
        <div className=''>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Provinsi</label>
              <select
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
              >
                <option value="">Pilih Provinsi</option>
                {[...new Set(wisataData.map(item => item.provinsi))]
                  .sort()
                  .map(prov => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Kategori Wisata</label>
              <select
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Pilih Kategori</option>
                {categories.sort().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            {/* Keterangan hasil pencarian */}
              {selectedProvince && selectedCategory && (
                <div className="mb-2">
                  <p className="text-sm text-gray-600">
                    Ditemukan {searchResults.length} destinasi di {selectedProvince}
                  </p>
                </div>
              )}
          </div>
        </div>

        
        {/* Card Hasil Pencarian Wisata */}
        <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Tampilan hasil pencarian */}
            {searchResults.map((item, index) => {
              const isAdded = travelPlan.items.some(planItem => 
                planItem.nama_wisata === item.nama_wisata
              );
              
              return (
                <div key={`${item.nama_wisata}-${index}`} className="border rounded-md p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                    <img 
                      src={item.Image_Path} 
                      alt={item.nama_wisata} 
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    <div>
                      <h4 className="font-bold">{item.nama_wisata}</h4>
                      <p className="text-gray-600">{item.provinsi}</p>
                      <p className="text-sm text-gray-500">{item.kategori}</p>
                      <button
                        className={`
                          mt-2 px-3 py-1 rounded text-sm font-medium
                          ${isAdded 
                            ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                            : 'bg-primary text-white hover:bg-blue-600'
                          }
                        `}
                        onClick={() => handleAddItem(item)}
                        disabled={isAdded}
                      >
                        {isAdded ? '✓ Berhasil Ditambahkan' : 'Tambah ke Rencana'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </div>          
          <div className="mt-4 space-y-4 max-h-[500px] overflow-y-auto">
            {searchResults.length === 0 && selectedProvince && selectedCategory && (
              <div className="text-center text-gray-500 py-8">
                <p>Tidak ada destinasi wisata yang ditemukan</p>
                <p className="text-sm">Coba pilih provinsi atau kategori wisata lain</p>
              </div>
            )}
            
          {/* Tampilan rencana wisata ketika user sudah memilih wisata dari hasil pencarian */}
          {travelPlan.name && travelPlan.date && (
            <div className="mt-4 border rounded-md p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-2">
              <div className="mb-4">
                <h3 className="font-bold text-xl mb-2">{travelPlan.name}</h3>
                <p className="text-gray-600">
                  Tanggal: {new Date(travelPlan.date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Total destinasi: {travelPlan.items.length}
                </p>
              
              
              <div className="space-y-4">
                {travelPlan.items.map((item, index) => (
                  <div key={`${item.nama_wisata}-${index}`} className="border rounded-md p-4 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <img 
                        src={item.Image_Path} 
                        alt={item.nama_wisata} 
                        className="w-full h-32 object-cover rounded"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                      <div>
                        <h4 className="font-bold">{item.nama_wisata}</h4>
                        <p className="text-gray-600">{item.provinsi}</p>
                        <p className="text-sm text-gray-500">{item.kategori}</p>
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="mt-2 text-red-500 hover:text-red-700 flex items-center"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-2" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              

              {/* Button Konfirmasi Menyimpan Rencana Perjalanan */}
              <div className="mt-4 flex flex-col md:flex-row-reverse md:justify-start md:space-x-2 md:space-x-reverse space-y-2 md:space-y-0">
                <button
                  onClick={handleSubmitPlan}
                  disabled={isSubmitting || travelPlan.items.length === 0}
                  className={`
                    px-4 py-2 rounded-md text-white font-medium w-full md:w-auto
                    ${isSubmitting || travelPlan.items.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 active:bg-green-700'}
                  `}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Konfirmasi'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 w-full md:w-auto"
                >
                  Batal
                </button>
              </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TravelPlanForm;