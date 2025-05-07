import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./register/RegisterPage";
import LoginPage from "./login/LoginPage";
import Home from './pages/Home'
import About from './pages/About'

// testing button
import PrimaryButton from "./components/Button";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Default halaman */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<h1>404: Not Found</h1>} />

        {/* testing button */}
        <Route path="/primarybutton" element={<PrimaryButton />} />
      </Routes>
    </Router>
  );
};

export default App;