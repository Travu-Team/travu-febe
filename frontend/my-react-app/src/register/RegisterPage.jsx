import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      // Validasi form
      if (!formData.nama || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("Semua field harus diisi.");
        return;
      }

      if (!validateEmail(formData.email)) {
        setError("Format email tidak valid.");
        return;
      }

      if (!validatePassword(formData.password)) {
        setError("Kata sandi minimal 6 karakter.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Kata sandi dan konfirmasi kata sandi tidak cocok.");
        return;
      }

      // Registrasi menggunakan authService
      const userData = {
        email: formData.email,
        password: formData.password,
        nama: formData.nama, // Backend menggunakan 'name', tapi kita kirim 'nama'
        rememberMe: formData.rememberMe || false
      };

      const response = await authService.register(userData);

      if (response) {
        console.log("Registration successful:", response);

        // Set success dan tunggu 2 detik sebelum redirect
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }

    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen">
      {/* Background Gambar */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/image/background_register.jpg')" }}
      />

      {/* Form Section */}
      <div className="relative flex items-center justify-center h-full w-full px-6">
        <div className="max-w-md w-full bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
          {/* Judul */}
          <h2 className="text-3xl font-semibold text-center text-gray-900">
            Selamat Datang di <span className="text-blue-600">Travu</span>
          </h2>

          {/* Pesan sukses */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Registrasi berhasil! Mengalihkan ke halaman login...
              </span>
            </div>
          )}

          {/* Pesan error */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
            {["nama", "email"].map((field) => (
              <input
                key={field}
                type={field === "email" ? "email" : "text"}
                name={field}
                placeholder={`Masukkan ${field === "nama" ? "nama lengkap" : field}`}
                value={formData[field]}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full p-3 border rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50 shadow-sm text-black disabled:opacity-50 disabled:cursor-not-allowed"
                required
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
                  disabled={isLoading}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50 shadow-sm text-black disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(field)}
                  disabled={isLoading}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xl disabled:opacity-50"
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
                disabled={isLoading}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
              />
              <span className="text-sm text-gray-700">Ingat Saya</span>
            </label>

            {/* Tombol Daftar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mendaftar...
                </span>
              ) : (
                "Daftar"
              )}
            </button>
          </form>

          {/* Link Login */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Sudah Punya Akun?{" "}
            <span
              onClick={() => !isLoading && navigate("/login")}
              className={`text-blue-600 font-semibold cursor-pointer hover:text-blue-800 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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