import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "../index.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getSpecificErrorMessage = (error) => {
    // Jika error memiliki status code atau response data
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 400:
          if (data.message?.toLowerCase().includes('password')) {
            return "Password yang Anda masukkan salah. Silakan coba lagi.";
          }
          if (data.message?.toLowerCase().includes('email')) {
            return "Email tidak ditemukan. Pastikan email Anda benar.";
          }
          return "Data yang Anda masukkan tidak valid. Periksa kembali email dan password.";
        
        case 401:
          return "Email atau password salah. Silakan periksa kembali.";
        
        case 403:
          return "Akun Anda tidak memiliki akses. Hubungi administrator.";
        
        case 404:
          return "Email tidak terdaftar. Silakan daftar terlebih dahulu.";
        
        case 429:
          return "Terlalu banyak percobaan login. Silakan tunggu beberapa menit.";
        
        case 500:
          return "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
        
        default:
          return data.message || "Terjadi kesalahan saat login.";
      }
    }
    
    // Jika error berdasarkan message string
    if (error.message) {
      const message = error.message.toLowerCase();
      
      if (message.includes('password')) {
        return "Password yang Anda masukkan salah.";
      }
      if (message.includes('email')) {
        return "Email tidak ditemukan atau format email salah.";
      }
      if (message.includes('network') || message.includes('fetch')) {
        return "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      }
      if (message.includes('invalid credentials')) {
        return "Email atau password salah.";
      }
      if (message.includes('user not found')) {
        return "Email tidak terdaftar di sistem.";
      }
      if (message.includes('incorrect password')) {
        return "Password yang Anda masukkan salah.";
      }
    }
    
    return "Terjadi kesalahan saat login. Silakan coba lagi.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    // Validasi form sebelum submit
    if (!formData.email.trim()) {
      setErrorMessage("Email tidak boleh kosong.");
      setIsLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setErrorMessage("Password tidak boleh kosong.");
      setIsLoading(false);
      return;
    }

    // Validasi format email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Format email tidak valid.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      if (response.token) {
        // Token akan disimpan oleh authService berdasarkan rememberMe
        navigate("/");
      } else {
        setErrorMessage("Login gagal. Email atau password salah.");
      }
    } catch (error) {
      const specificError = getSpecificErrorMessage(error);
      setErrorMessage(specificError);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen">
      {/* Background Gambar */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/image/background_login.jpg')",
        }}
      />

      {/* Form Section */}
      <div className="relative flex items-center justify-center h-full w-full px-6">
        <div className="max-w-md w-full bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
          {/* Judul */}
          <h2 className="text-3xl font-semibold text-center text-gray-900">
            Selamat datang kembali di{" "}
            <span className="text-blue-600">Travu</span>
          </h2>

          {/* Pesan Kesalahan */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm text-center font-medium">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
            {/* Input Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-black shadow-sm"
              required
              disabled={isLoading}
            />

            {/* Input Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Kata Sandi"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-black shadow-sm"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            {/* Ingat Saya & Lupa Kata Sandi */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-700">Ingat Saya</span>
              </label>
              {/* <span
                onClick={() => !isLoading && navigate("/forgot-password")}
                className={`text-sm text-blue-600 hover:text-blue-800 cursor-pointer ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Lupa Kata Sandi?
              </span> */}
            </div>

            {/* Tombol Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Masuk..." : "Masuk"}
            </button>
          </form>

          {/* Link Daftar */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Belum Punya Akun?{" "}
            <span
              onClick={() => !isLoading && navigate("/register")}
              className={`text-blue-600 font-semibold cursor-pointer hover:text-blue-800 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Daftar Disini
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;