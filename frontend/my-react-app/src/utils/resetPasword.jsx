import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ResetPassword = () => {
  const { token } = useParams(); // Token dari URL
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      setMessage({ type: "error", text: "Password minimal 6 karakter" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
       body: JSON.stringify({ newPassword }), // BUKAN 'password'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan saat mengubah password.');
      }

      setMessage({ type: "success", text: data.message || "Password berhasil diubah." });

      // Arahkan ke halaman login setelah 2 detik
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Gagal menghubungi server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="w-full min-h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-semibold text-center text-gray-800">Reset Password</h1>
          <p className="text-gray-600 text-center mt-2">Masukkan password baru Anda.</p>

          {message && (
            <div
              className={`mt-4 text-center text-sm font-medium ${
                message.type === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {message.text}
            </div>
          )}

          <form className="mt-6" onSubmit={handleSubmit}>
            <label className="block text-gray-700 text-sm font-medium">Password Baru</label>
            <input
              type="password"
              placeholder="Minimal 6 karakter"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-500 text-white py-2 mt-4 rounded-md hover:bg-blue-600 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Memproses..." : "Ubah Password"}
            </button>
          </form>

          <div className="text-center mt-4">
            <a href="/login" className="text-blue-500 text-sm hover:underline">
              Kembali ke Login
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ResetPassword;