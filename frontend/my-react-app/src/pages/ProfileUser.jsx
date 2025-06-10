import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import "react-toastify/dist/ReactToastify.css";
import ButtonCustom from "../components/Button";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiClient, API_CONFIG } from "../services/apiConfig";
import { authService } from "../services/authService";

const InputField = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  options = [],
}) => {

  if (type === "select") {
    return (
      <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 font-semibold mb-2">
          {label}
        </label>
        <select
          id={id}
          name={id}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            disabled 
              ? "bg-gray-100 cursor-not-allowed" 
              : "bg-white hover:bg-gray-50 focus:bg-white"
          }`}
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
       className="bg-white text-black shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline disabled:bg-gray-100 disabled:cursor-not-allowed"
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-describedby={`${id}-helper`}
        // Tambahan khusus untuk input nomor telepon
        onKeyPress={id === "phoneNumber" ? (e) => {
          // Hanya izinkan angka (0-9) dan beberapa karakter khusus seperti +, -, (, ), dan spasi
          if (!/[0-9+\-() ]/.test(e.key)) {
            e.preventDefault();
          }
        } : undefined}
        onInput={id === "phoneNumber" ? (e) => {
          // Hapus semua karakter non-angka kecuali +, -, (, ), dan spasi
          let cleanValue = e.target.value.replace(/[^0-9+\-() ]/g, '');
          
          // Batasi panjang nomor telepon maksimal 15 karakter
          if (cleanValue.length > 15) {
            cleanValue = cleanValue.substring(0, 15);
          }
          
          e.target.value = cleanValue;
        } : undefined}
        maxLength={id === "phoneNumber" ? 15 : undefined}
      />
    </div>
  );
};

const ProfileUser = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
    interest: "",
  });
  const [originalData, setOriginalData] = useState(null);

  const navigate = useNavigate();

  // Mengambil data user ketika komponen dimuat
  useEffect(() => {
    fetchUserData();
  }, []);

  // Wrap fetchUserData dengan useCallback
const fetchUserData = useCallback(async () => {
  try {
    setIsLoading(true);
    setError(null);

    if (!authService.isAuthenticated()) {
      toast.error("Anda harus login terlebih dahulu", {
        position: "top-center",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }

    const response = await apiClient.get(API_CONFIG.ENDPOINTS.PROFILE);
    
    if (response.success && response.data) {
      const profileData = {
        name: response.data.name || "",
        phoneNumber: response.data.phoneNumber || "",
        email: response.data.email || "",
        address: response.data.address || "",
        interest: response.data.interest || "",
      };
      
      setUserData(profileData);
      setOriginalData(profileData);
    } else {
      throw new Error(response.message || "Gagal mengambil data profil");
    }
  } catch (err) {
    console.error("Error fetching user data:", err);
    
    if (err.message.includes("401") || err.message.includes("Unauthorized")) {
      setError("Sesi Anda telah berakhir. Silakan login kembali.");
      authService.clearToken();
      navigate("/login");
    } else if (err.message.includes("403") || err.message.includes("Forbidden")) {
      setError("Anda tidak memiliki akses untuk melihat data ini.");
    } else if (err.message.includes("404")) {
      setError("Data profil tidak ditemukan.");
    } else if (err.message.includes("500")) {
      setError("Terjadi kesalahan pada server. Silakan coba lagi nanti.");
    } else {
      setError(err.message || "Terjadi kesalahan saat mengambil data profil");
    }
  } finally {
    setIsLoading(false);
  }
}, [navigate]); // Tambahkan navigate sebagai dependency

// useEffect sudah benar dengan dependency
useEffect(() => {
  fetchUserData();
}, [fetchUserData]);


  const handleInputChange = (e) => {
    const { id, value, name } = e.target;
    const fieldName = id || name; // fallback ke name jika id tidak ada
    
    // Validasi khusus untuk phoneNumber
    if (fieldName === "phoneNumber") {
      // Hanya izinkan angka, +, -, (, ), dan spasi
      let sanitizedValue = value.replace(/[^0-9+\-() ]/g, '');
      
      // Batasi panjang maksimal 15 karakter
      if (sanitizedValue.length > 15) {
        sanitizedValue = sanitizedValue.substring(0, 15);
      }
      
      setUserData((prev) => ({
        ...prev,
        [fieldName]: sanitizedValue,
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Jika form tidak dalam mode edit, jangan lakukan apa-apa
    if (!isEditing) {
      return;
    }

    // Validasi nomor telepon sebelum submit
    if (userData.phoneNumber) {
      // Cek format nomor telepon
      if (!/^[0-9+\-() ]+$/.test(userData.phoneNumber)) {
        toast.error("Nomor telepon hanya boleh berisi angka dan karakter +, -, (, ), spasi", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
      
      // Cek panjang nomor telepon (minimal 10, maksimal 15 karakter)
      const phoneDigits = userData.phoneNumber.replace(/[^0-9]/g, '');
      if (phoneDigits.length < 10) {
        toast.error("Nomor telepon minimal harus 10 digit", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
      
      if (phoneDigits.length > 15) {
        toast.error("Nomor telepon maksimal 15 digit", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
    }

    // Memeriksa apakah ada perubahan data
    const hasChanges =
      userData.name !== originalData?.name ||
      userData.phoneNumber !== originalData?.phoneNumber ||
      userData.address !== originalData?.address ||
      userData.interest !== originalData?.interest;

    // Jika tidak ada perubahan, kembalikan ke mode view saja
    if (!hasChanges) {
      setIsEditing(false);
      toast.info("Tidak ada perubahan yang perlu disimpan", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Cek authentication
      if (!authService.isAuthenticated()) {
        toast.error("Anda harus login terlebih dahulu", {
          position: "top-center",
          autoClose: 3000,
        });
        navigate("/login");
        return;
      }

      // Siapkan data untuk update (sesuai dengan API backend)
      const updateData = {
        interest: userData.interest,
        address: userData.address,
        phoneNumber: userData.phoneNumber,
      };

      // Hapus field yang kosong untuk menghindari error
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === "") {
          delete updateData[key];
        }
      });

      const response = await apiClient.put(API_CONFIG.ENDPOINTS.PROFILE, updateData);

      if (response.success) {
        // Update data lokal dengan response dari server
        const updatedProfileData = {
          ...userData,
          ...response.data,
        };
        
        setUserData(updatedProfileData);
        setOriginalData(updatedProfileData);
        setIsEditing(false);
        
        toast.success("Profil berhasil diperbarui!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        throw new Error(response.message || "Gagal memperbarui profil");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      
      let errorMessage = "Gagal memperbarui profil";
      
      // Handle specific error cases
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        errorMessage = "Sesi Anda telah berakhir. Silakan login kembali.";
        authService.clearToken();
        navigate("/login");
      } else if (err.message.includes("400") || err.message.includes("Bad Request")) {
        errorMessage = "Data yang Anda masukkan tidak valid. Periksa kembali form Anda.";
      } else if (err.message.includes("403") || err.message.includes("Forbidden")) {
        errorMessage = "Anda tidak memiliki akses untuk mengubah data ini.";
      } else if (err.message.includes("500")) {
        errorMessage = "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
      } else if (err.message.includes("must be a valid email")) {
        errorMessage = "Format email tidak valid.";
      } else if (err.message.includes("required")) {
        errorMessage = "Semua field wajib harus diisi.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading && !userData.email) {
    return (
      <div className="w-full mx-auto min-h-screen flex flex-col bg-white">
        <header className="sticky top-0 z-50">
          <Navbar />
        </header>
        <main className="w-full flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data profil...</p>
          </div>
        </main>
        <footer className="mt-auto">
          <Footer />
        </footer>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto min-h-screen flex flex-col bg-white">
      <ToastContainer />
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      <main className="w-full flex-grow px-4 sm:px-6">
        <section className="mb-8 text-center py-6">
          <h1 className="text-2xl sm:text-3xl font-medium text-black">Selamat Datang</h1>
          <p className="text-lg sm:text-xl font-medium text-gray-600 mt-2">
            {isEditing
              ? "Silakan Edit Profil Anda"
              : "Di Halaman Informasi Profil"}
          </p>
        </section>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 max-w-full">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="break-words">{error}</span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto">
          <aside className="w-full lg:w-1/4">
            <div className="bg-secondary/30 p-4 sm:p-6 rounded-lg shadow-md">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800">
                Navigasi Profil
              </h2>
              <ul className="space-y-4 cursor-pointer">
                <li className="flex items-center gap-3 text-sm sm:text-base">
                  <UserCircleIcon className="h-5 w-5 flex-shrink-0" />
                  <span>Profil Saya</span>
                </li>
              </ul>
            </div>
          </aside>

          <section className="w-full lg:w-3/4 border border-gray-400 p-4 sm:p-6 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="w-full">
              <InputField
                id="name"
                label="Nama Lengkap"
                value={userData.name}
                onChange={handleInputChange}
                disabled={true} // Name tidak bisa diubah berdasarkan API
              />
              <InputField
                id="email"
                label="Email"
                value={userData.email}
                onChange={handleInputChange}
                disabled={true} // Email tidak bisa diubah berdasarkan API
                type="email"
              />
              <InputField
                id="phoneNumber"
                label="No. Telepon"
                value={userData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                type="text"
              />
              <InputField
                id="address"
                label="Lokasi Destinasi"
                type="select"
                options={[
                  { value: "", label: "Lokasi Destinasi" },
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
                  { value: "Daerah Istimewa Yogyakarta", label: "Yogyakarta" },
                  { value: "Jawa Timur", label: "Jawa Timur" },
                  { value: "Bali", label: "Bali" },
                  {
                    value: "Nusa Tenggara Barat",
                    label: "Nusa Tenggara Barat",
                  },
                  {
                    value: "Nusa Tenggara Timur",
                    label: "Nusa Tenggara Timur",
                  },
                  { value: "Kalimantan Barat", label: "Kalimantan Barat" },
                  { value: "Kalimantan Tengah", label: "Kalimantan Tengah" },
                  { value: "Kalimantan Selatan", label: "Kalimantan Selatan" },
                  { value: "Kalimantan Timur", label: "Kalimantan Timur" },
                  { value: "Kalimantan Utara", label: "Kalimantan Utara" },
                  { value: "Sulawesi Utara", label: "Sulawesi Utara" },
                  { value: "Gorontalo", label: "Gorontalo" },
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
                  { value: "Papua Barat Daya", label: "Papua Barat Daya" },
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
                  { value: "Alun-Alun", label: "Alun-Alun" },
                  { value: "Bukit", label: "Bukit" },
                  { value: "Cafe View", label: "Cafe View" },
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
              <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-start w-full">
                {!isEditing ? (
                  <ButtonCustom
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditing(true);
                      setError(null); // Clear any existing errors
                    }}
                    disabled={isLoading}
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
                      {isLoading ? "Menyimpan..." : "Simpan"}
                    </ButtonCustom>
                    <ButtonCustom
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEditing(false);
                        setError(null); // Clear any existing errors
                        // Reset form ke data awal
                        setUserData({ ...originalData });
                      }}
                      className="bg-red-500 hover:bg-red-600"
                      disabled={isLoading}
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