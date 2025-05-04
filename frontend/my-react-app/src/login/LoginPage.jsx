import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Background Gambar */}
      <div
        className="w-1/2 h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/image/background-login.jpg')" }}
      />

      {/* Form Section */}
      <div className="w-1/2 h-full flex items-center justify-center p-16 bg-white shadow-lg">
        <div className="max-w-md w-full space-y-8">
          {/* Judul */}
          <h2 className="text-3xl font-semibold text-center text-gray-900">
            Masuk ke{" "}
            <span className="text-blue-600">Travu</span>
          </h2>

          {/* Form */}
          <form className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Masukkan email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Kata Sandi
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Masukkan kata sandi"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
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
              <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                Lupa Kata Sandi?
              </a>
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
          <p className="text-center text-sm text-gray-600">
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