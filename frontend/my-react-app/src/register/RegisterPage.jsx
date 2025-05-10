import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <div className="relative h-screen w-screen">
      {/* Background Gambar */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/image/background-register.jpg')" }}
      />

      {/* Form Section */}
      <div className="relative flex items-center justify-center h-full w-full px-6">
        <div className="max-w-md w-full bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
          {/* Judul */}
          <h2 className="text-3xl font-semibold text-center text-gray-900">
            Selamat Datang di <span className="text-blue-600">Travu</span>
          </h2>

          {/* Form */}
          <form className="space-y-6">
            {["nama", "email"].map((field) => (
              <input
                key={field}
                type={field === "email" ? "email" : "text"}
                name={field}
                placeholder={`Masukkan ${field}`}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50 shadow-sm text-black"
              />
            ))}

            {["password", "confirmPassword"].map((field) => (
              <div key={field} className="relative">
                <input
                  type={showPassword[field] ? "text" : "password"}
                  name={field}
                  placeholder={field === "confirmPassword" ? "Konfirmasi Kata Sandi" : "Kata Sandi"}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50 shadow-sm text-black"
                />
                <button
                  type="button"
                  className="absolute right-3 text-gray-600"
                  onClick={() => togglePasswordVisibility(field)}
                >
                  {showPassword[field] ? "🙈" : "👁"}
                </button>
              </div>
            ))}

            {/* Ingat Saya */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Ingat Saya</span>
            </label>

            {/* Tombol Daftar */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Daftar
            </button>
          </form>

          {/* Link Login */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Sudah Punya Akun?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 font-semibold cursor-pointer hover:text-blue-800"
            >
              Masuk Disini
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;