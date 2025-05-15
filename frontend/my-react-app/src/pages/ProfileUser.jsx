import { useState, useEffect } from 'react';
import ButtonCustom from '../components/Button';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const InputField = ({ id, label, value, onChange, type = 'text', disabled = false }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-gray-700 font-bold mb-2">
      {label}
    </label>
    <input
      type={type}
      id={id}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:bg-gray-100 disabled:cursor-not-allowed"
      value={value}
      onChange={onChange}
      disabled={disabled}
      aria-describedby={`${id}-helper`}
    />
  </div>
);

const ProfileUser = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    interest: ''
  });

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you store JWT token in localStorage
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await response.json();
      setUserData(updatedData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
      alert('Failed to update profile: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile?')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete profile');
      }

      // Redirect to login page or handle as needed
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (err) {
      setError(err.message);
      alert('Failed to delete profile: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      
      <main className="w-full flex-grow container mx-auto px-20 py-8 lg:px-16 md:px-10 sm:px-6 xs:px-4">
        <section className="mb-8 text-center">
          <h1 className="text-3xl font-md text-black">Selamat Datang</h1>
          <p className="text-xl font-md text-gray-600 mt-2">
            {isEditing ? 'Edit Profil Anda' : 'Informasi Profil Anda'}
          </p>
        </section>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="w-full lg:w-1/4">
            <nav className="bg-secondary/30 p-6 rounded-lg shadow-md h-full">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Navigasi Profil</h2>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="flex items-center gap-3 p-3 rounded-lg font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 4a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                    Profil Saya
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          <section className="w-full lg:w-3/4 p-6 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              <InputField
                id="name"
                label="Nama Lengkap"
                value={userData.name}
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
                value={userData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <InputField
                id="interest"
                label="Minat"
                value={userData.interest}
                onChange={handleInputChange}
                disabled={!isEditing}
              />

              <div className="flex gap-4 mt-6">
                {!isEditing ? (
                  <ButtonCustom type="button" onClick={() => setIsEditing(true)}>
                    Edit Profil
                  </ButtonCustom>
                ) : (
                  <>
                    <ButtonCustom type="submit" disabled={isLoading}>
                      {isLoading ? 'Menyimpan...' : 'Simpan'}
                    </ButtonCustom>
                    <ButtonCustom
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-500 hover:bg-gray-600"
                    >
                      Batal
                    </ButtonCustom>
                  </>
                )}
                <ButtonCustom
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 ml-auto"
                >
                  Hapus Akun
                </ButtonCustom>
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