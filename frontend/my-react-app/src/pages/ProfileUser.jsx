import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { UserCircleIcon } from "@heroicons/react/24/solid";
import 'react-toastify/dist/ReactToastify.css';
import ButtonCustom from '../components/Button';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const InputField = ({ id, label, value, onChange, type = 'text', disabled = false, options = [] }) => {
  // Jika type adalah select, render dropdown
  if (type === 'select') {
    return (
      <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 font-semibold mb-2">
          {label}
        </label>
        <select
          id={id}
          name={id}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:bg-gray-100 disabled:cursor-not-allowed"
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-describedby={`${id}-helper`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 font-semibold mb-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:bg-gray-100 disabled:cursor-not-allowed"
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-describedby={`${id}-helper`}
      />
    </div>
  );
};

const ProfileUser = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    nama: '',
    phoneNumber: '',
    email: '',
    address: '',
    interest: ''
  });
  const [originalData, setOriginalData] = useState(null);

  const navigate = useNavigate();
  // Mengambil data user ketika komponen dimuat
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Mengambil token JWT dari localStorage
        }
      });      
      if (!response.ok) {
        throw new Error('Gagal mengambil data profil');
      }
        const data = await response.json();
        setUserData(data);
        setOriginalData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

  const handleInputChange = (e) => {
    const { id, value, name } = e.target;
    const fieldName = id || name; // fallback ke name jika id tidak ada
    setUserData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Jika form tidak dalam mode edit, jangan lakukan apa-apa
    if (!isEditing) {
      return;
    }

    // Memeriksa apakah ada perubahan data
    const hasChanges = 
      userData.nama !== originalData?.nama ||
      userData.phoneNumber !== originalData?.phoneNumber ||
      userData.address !== originalData?.address ||
      userData.interest !== originalData?.interest;

    // Jika tidak ada perubahan, kembalikan ke mode view saja
    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Token tidak ditemukan. Silakan login kembali.');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nama: userData.nama,
          phoneNumber: userData.phoneNumber,
          address: userData.address,
          interest: userData.interest
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memperbarui profil');
      }      const updatedData = await response.json();
      setUserData(updatedData);
      setIsEditing(false);
      toast.success('Profil berhasil diperbarui!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } catch (err) {
      setError(err.message);
      toast.error('Gagal memperbarui profil: ' + err.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto min-h-screen flex flex-col">
      <ToastContainer />        
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>      
      <main className="w-full flex-grow">
        <section className="mb-8 text-center">
          <h1 className="text-3xl font-md text-black">Selamat Datang</h1>
          <p className="text-xl font-md text-gray-600 mt-2">
            {isEditing ? 'Silakan Edit Profil Anda' : 'Di Halaman Informasi Profil'}
          </p>
        </section>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}        
        <div className="flex flex-row gap-6 border xs:flex-col px-6 w-full">
          <aside className="w-3/4 xs:w-full">
            <div className="bg-secondary/30 p-6 rounded-lg shadow-md h-fit">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Navigasi Profil</h2>
              <ul className="space-y-4 cursor-pointer">
                <li className="flex items-center gap-3">
                    <UserCircleIcon className="h-5 w-5" />
                    Profil Saya
                </li>
              </ul>
            </div>          
            </aside>            
            
            <section className="border border-gray-400 w-full p-6 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="w-full mr-60">
              <InputField
                id="nama"
                label="Nama Lengkap"
                value={userData.nama}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <InputField
                id="phoneNumber"
                label="No. Telepon"
                value={userData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                type="tel"
              />
              <InputField
                id="email"
                label="Email"
                value={userData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                type="email"
              />
              <InputField
                id="address"
                label="Domisili"
                type="select"
                options={[
                  { value: "", label: "Pilih Domisili" },
                  { value: "Aceh", label: "Aceh" },
                  { value: "Sumatera Utara", label: "Sumatera Utara" },
                  { value: "Sumatera Barat", label: "Sumatera Barat" },
                  { value: "Riau", label: "Riau" },
                  { value: "Kepulauan Riau", label: "Kepulauan Riau" },
                  { value: "Jambi", label: "Jambi" },
                  { value: "Bengkulu", label: "Bengkulu" },
                  { value: "Sumatera Selatan", label: "Sumatera Selatan" },
                  { value: "Bangka Belitung", label: "Bangka Belitung" },
                  { value: "Lampung", label: "Lampung" },
                  { value: "Jakarta", label: "Jakarta" },
                  { value: "Jawa Barat", label: "Jawa Barat" },
                  { value: "Banten", label: "Banten" },
                  { value: "Jawa Tengah", label: "Jawa Tengah" },
                  { value: "Yogyakarta", label: "Yogyakarta" },
                  { value: "Jawa Timur", label: "Jawa Timur" },
                  { value: "Bali", label: "Bali" },
                  { value: "Nusa Tenggara Barat", label: "Nusa Tenggara Barat" },
                  { value: "Nusa Tenggara Timur", label: "Nusa Tenggara Timur" },
                  { value: "Kalimantan Barat", label: "Kalimantan Barat" },
                  { value: "Kalimantan Tengah", label: "Kalimantan Tengah" },
                  { value: "Kalimantan Selatan", label: "Kalimantan Selatan" },
                  { value: "Kalimantan Timur", label: "Kalimantan Timur" },
                  { value: "Kalimantan Utara", label: "Kalimantan Utara" },
                  { value: "Sulawesi Utara", label: "Sulawesi Utara" },
                  {value: "Gorontalo", label: "Gorontalo" },
                  { value: "Sulawesi Tengah", label: "Sulawesi Tengah" },
                  { value: "Sulawesi Barat", label: "Sulawesi Barat" },
                  { value: "Sulawesi Selatan", label: "Sulawesi Selatan" },
                  { value: "Sulawesi Tenggara", label: "Sulawesi Tenggara" },
                  { value: "Maluku", label: "Maluku" },
                  { value: "Maluku Utara", label: "Maluku Utara" },
                  { value: "Papua", label: "Papua" },
                  { value: "Papua Barat", label: "Papua Barat" },
                  { value: "Papua Pegunungan", label: "Papua Pegunungan" },
                  { value: "Papua Tengah", label: "Papua Tengah" },
                  { value: "Papua Selatan", label: "Papua Selatan" },
                  { value: "Papua Barat Daya", label: "Papua Barat Daya" }
                ]}
                value={userData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <InputField
                id="interest"
                label="Minat"
                type="select"
                options={[
                  { value: "", label: "Pilih Minat" },
                  { value: "Air Terjun", label: "Air Terjun" },
                  { value: "Alun-Alun", label: "Bandung" },
                  { value: "Bukit", label: "Surabaya" },
                  { value: "Cafe View", label: "Medan" },
                  { value: "Candi", label: "Candi" },
                  { value: "Gunung", label: "Gunung" },
                  { value: "Kebun Binatang", label: "Kebun Binatang" },
                  { value: "Lembah", label: "Lembah" },
                  { value: "Mall", label: "Mall" },
                  { value: "Monumen", label: "Monumen" },
                  { value: "Museum", label: "Museum" },
                  { value: "Pantai", label: "Pantai" },
                  { value: "Rumah Adat", label: "Rumah Adat" },
                  { value: "Taman", label: "Taman" },
                  { value: "Wahana Keluarga", label: "Wahana Keluarga" },
                  { value: "Wisata Religi", label: "Wisata Religi" },
                  { value: "Wisata Alam", label: "Wisata Alam" },
                  { value: "Wisata Edukasi", label: "Wisata Edukasi" },
                  { value: "Wisata Kerajaan", label: "Wisata Kerajaan" },
                  { value: "Wisata Kuliner", label: "Wisata Kuliner" },
                  { value: "Wisata Lampion", label: "Wisata Lampion" },
                  { value: "Wisata Tematik", label: "Wisata Tematik" },
                ]}
                value={userData.interest}
                onChange={handleInputChange}
                disabled={!isEditing}
              />               
              <div className="flex gap-4 mt-6 justify-start w-full">
                {!isEditing ? (
                  <ButtonCustom 
                    type="button" 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditing(true);
                    }}
                  >
                    Edit Profil
                  </ButtonCustom>
                ) : (
                  <>
                    <ButtonCustom 
                      type="submit" 
                      disabled={isLoading}
                      onClick={(e) => {
                        if (!isEditing) {
                          e.preventDefault();
                          return;
                        }
                      }}
                    >
                      {isLoading ? 'Menyimpan...' : 'Simpan'}
                    </ButtonCustom>                    
                    <ButtonCustom
                      type="cancel"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEditing(false);
                        // Reset form ke data awal
                        fetchUserData();
                      }}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Batal
                    </ButtonCustom>
                  </>
                )}
              </div>
            </form>
          </section>
        </div>
      </main>

      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default ProfileUser;