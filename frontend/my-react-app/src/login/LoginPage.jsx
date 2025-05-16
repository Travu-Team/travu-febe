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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });

      if (response.token) {
        // Token akan disimpan oleh authService berdasarkan rememberMe
        navigate("/profile");
      } else {
        setErrorMessage(data.message || "Login gagal, periksa kembali email dan password.");
      }
    } catch (error) {
      setErrorMessage("Terjadi kesalahan saat menghubungi server.");
    }
  };

  return (
    <div className="relative h-screen w-screen">
      {/* Background Gambar */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/image/background-login.jpg')" }}
      />

      {/* Form Section */}
      <div className="relative flex items-center justify-center h-full w-full px-6">
        <div className="max-w-md w-full bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
          {/* Judul */}
          <h2 className="text-3xl font-semibold text-center text-gray-900">
            Selamat datang kembali di <span className="text-blue-600">Travu</span>
          </h2>

          {/* Pesan Kesalahan */}
          {errorMessage && <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>}

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
              />
              <button
                type="button"
                className="absolute right-3 text-gray-600"
                onClick={togglePasswordVisibility}
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
                />
                <span className="text-sm text-gray-700">Ingat Saya</span>
              </label>
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Lupa Kata Sandi?
              </span>
            </div>

            {/* Tombol Login */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Masuk
            </button>
          </form>

          {/* Link Daftar */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Belum Punya Akun?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 font-semibold cursor-pointer hover:text-blue-800"
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