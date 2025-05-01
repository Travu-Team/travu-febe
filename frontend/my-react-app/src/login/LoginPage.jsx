import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Tambahkan navigasi
import "../index.css";

const LoginPage = () => {
  const navigate = useNavigate(); // ✅ Gunakan navigasi

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center relative">
      {/* Background Gambar */}
      <div className="flex-1 h-screen bg-cover bg-center bg-no-repeat p-12" style={{ backgroundImage: "url('/image/background-login.jpg')" }} />

      {/* Bagian Form */}
      <div className="flex-1 h-screen flex flex-col justify-center items-center p-12 bg-white shadow-lg rounded-lg">
        <h2 className="text-center text-3xl font-semibold text-gray-900">
          Masuk ke <span className="text-blue-600">Travu</span>
        </h2>

        <form className="w-full max-w-md flex flex-col gap-6">
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-4 rounded-lg border border-gray-400 w-full text-lg bg-gray-100 outline-none" />

          <input type="password" name="password" placeholder="Kata Sandi" value={formData.password} onChange={handleChange} className="p-4 rounded-lg border border-gray-400 w-full text-lg bg-gray-100 outline-none" />

          <label className="flex items-center gap-4 text-lg cursor-pointer">
            <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
            <span className="text-gray-900">Ingat Saya</span>
          </label>

          <button type="submit" className="p-4 bg-blue-600 text-white rounded-lg text-xl font-semibold w-full transition duration-300 hover:bg-blue-700">
            Masuk
          </button>
        </form>


        {/* ✅ Perbaiki navigasi */}
        <p className="mt-6 text-lg text-gray-900">
          Belum Punya Akun?{" "}
          <span className="text-blue-600 font-semibold cursor-pointer" onClick={() => navigate("/register")}>
            Daftar Disini
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;