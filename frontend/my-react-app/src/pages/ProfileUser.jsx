import { useState } from 'react';
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
  const [name, setName] = useState('Anggita Lesmana');
  const [phoneNumber, setPhoneNumber] = useState('0876-9080-5543');
  const [email, setEmail] = useState('anggita@gmail.com');
  const [address, setAddress] = useState('Banjarmasin');
  const [interest, setInterest] = useState('Pantai');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
    console.log('Form submitted with data:', {
      name,
      phoneNumber,
      email,
      address,
      interest,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      
      <main className="border border-red-500 w-full min-w-[1024px] flex-grow container mx-auto px-20 py-8">
        <section className="mb-8 text-center">
          <h1 className="text-3xl font-md text-black">Selamat Datang</h1>
          <p className="text-xl font-md text-gray-600 mt-2">Silakan Lengkapi profil Anda</p>
        </section>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Navigation/Right Panel */}
          <aside className="w-full lg:w-1/4">
            <nav className="bg-secondary/30 p-6 rounded-lg shadow-md h-full">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Navigasi Profil</h2>
              <ul className="space-y-4">
                <li>
                  <a 
                    href="#" 
                    className="flex items-center gap-3 p-3 rounded-lg font-medium"
                    aria-current="page"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 4a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                    Profil Saya
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <section className="border border-purple-700 w-full lg:w-3/4 p-6">
            {/* <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">Informasi Profil</h2> */}
              
              <form onSubmit={handleSubmit}>
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
                  <InputField
                    id="name"
                    label="Nama Lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled
                  />
                  <InputField
                    id="phoneNumber"
                    label="No. Telepon"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled
                    type="tel"
                  />
                  <InputField
                    id="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled
                    type="email"
                  />
                  <InputField
                    id="address"
                    label="Domisili"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled
                  />
                  <InputField
                    id="interest"
                    label="Minat"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    disabled
                  />
                {/* </div> */}

                <ButtonCustom>Edit Profil</ButtonCustom>
            </form>
            {/* </div> */}
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