import React, { useState } from "react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });

  const [error, setError] = useState("");
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
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    }}>
      {/* Background Gambar */}
      <div style={{
        flex: 1,
        height: "100vh",
        backgroundImage: "url('/image/background-register.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "50px",
      }} />

      {/* Bagian Form (Kanan) */}
      <div style={{
        flex: 1,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "50px",
        background: "#ffffff",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        borderRadius: "20px",
      }}>
        <h2 style={{ textAlign: "center", fontSize: "32px", fontWeight: "600", color: "#0F0F0F" }}>
          Selamat datang di <span style={{ color: "#3A59D1" }}>Travu</span>
        </h2>

        <form style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "25px" }}>
          {["nama", "email"].map((field) => (
            <input
              key={field}
              type={field === "email" ? "email" : "text"}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field]}
              onChange={handleChange}
              style={{
                color: "#0F0F0F",
                padding: "14px",
                borderRadius: "12px",
                border: "1px solid #667085",
                width: "100%",
                fontSize: "16px",
                background: "#F9F9F9",
                outline: "none"
              }}
            />
          ))}

          {["password", "confirmPassword"].map((field) => (
            <div key={field} style={{ position: "relative", width: "100%" }}>
              <input
                type={showPassword[field] ? "text" : "password"}
                name={field}
                placeholder={field === "confirmPassword" ? "Konfirmasi Kata Sandi" : "Kata Sandi"}
                value={formData[field]}
                onChange={handleChange}
                style={{
                  color: "#0F0F0F",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1px solid #667085",
                  width: "100%",
                  fontSize: "16px",
                  background: "#F9F9F9",
                  outline: "none"
                }}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility(field)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#667085"
                }}
              >
                {showPassword[field] ? "🙈" : "👁"} {/* Ikon mata */}
              </button>
            </div>
          ))}

          <label style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", cursor: "pointer" }}>
            <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
            <span style={{ color: "#0F0F0F" }}>Ingat Saya</span> 
          </label>

          <button type="submit" style={{
            padding: "14px",
            background: "#3A59D1",
            color: "white",
            borderRadius: "12px",
            fontSize: "20px",
            fontWeight: "600",
            cursor: "pointer",
            border: "none",
            width: "100%",
            transition: "0.3s"
          }}>
            Daftar
          </button>
        </form>

        <p style={{ marginTop: "20px", fontSize: "18px", color: "#0F0F0F"}}>
          Sudah Punya Akun? <span style={{ color: "#3A59D1", cursor: "pointer", fontWeight: "600" }}>Masuk Disini</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;