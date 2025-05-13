import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = (e) => {
    e.preventDefault();

    // Simulasi pengecekan email
    if (!email || !email.includes("@")) {
      setMessage({ type: "error", text: "Masukkan email yang valid!" });
      return;
    }

    // Simulasi pengiriman reset password
    setMessage({ type: "success", text: "Link reset telah dikirim ke email Anda!" });
  };

  return (
    <>
      <Navbar />

      <main className="w-full min-h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-semibold text-center text-gray-800">Lupa Kata Sandi?</h1>
          <p className="text-gray-600 text-center mt-2">Masukkan email Anda untuk mendapatkan link reset.</p>

          {message && (
            <div className={`mt-4 text-center text-sm font-medium ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>
              {message.text}
            </div>
          )}

          <form className="mt-6" onSubmit={handleReset}>
            <label className="block text-gray-700 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button type="submit" className="w-full bg-blue-500 text-white py-2 mt-4 rounded-md hover:bg-blue-600 transition">
              Kirim Link Reset
            </button>
          </form>

          <div className="text-center mt-4">
            <a href="/login" className="text-blue-500 text-sm hover:underline">Kembali ke Login</a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ForgotPassword;