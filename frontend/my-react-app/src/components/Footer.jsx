import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faPlane,
} from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <>
      {/* Content Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

      <footer className="bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <FontAwesomeIcon
            icon={faPlane}
            className="absolute top-8 right-8 text-6xl text-blue-500 transform rotate-45"
          />
          <div className="absolute bottom-8 left-8 w-24 h-24 border-2 border-blue-300 rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="lg:col-span-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                {/* Simple Logo */}
                <div className="w-12 h-12 border-2 border-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg overflow-hidden bg-white">
                  <img
                    src="/image/logo-travu.png"
                    alt="Travu Logo"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-600">TRAVU</h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Travel With U
                  </p>
                </div>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Temukan destinasi impian dan rencanakan perjalanan terbaik
                bersama Travu. Wujudkan liburan yang tak terlupakan!
              </p>

              {/* Social Media */}
              <div className="flex justify-center md:justify-start space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                >
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-400 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Menu Utama
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    Beranda
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a
                    href="/plan"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    Rencana Wisata
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    Kontak
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-center md:text-left">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Hubungi Kami
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-center md:justify-start text-gray-600">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="w-4 h-4 mr-3 text-blue-500"
                  />
                  <span className="text-sm">info@travu.com</span>
                </div>
                <div className="flex items-center justify-center md:justify-start text-gray-600">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="w-4 h-4 mr-3 text-teal-500"
                  />
                  <span className="text-sm">+62 812-3456-7890</span>
                </div>
                <div className="flex items-center justify-center md:justify-start text-gray-600">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="w-4 h-4 mr-3 text-red-500"
                  />
                  <span className="text-sm">Jakarta, Indonesia</span>
                </div>
              </div>

              {/* Newsletter */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h5 className="text-sm font-semibold text-gray-800 mb-2">
                  Newsletter
                </h5>
                <p className="text-xs text-gray-600 mb-3">
                  Tambah destinasi terbaru! Silahkan Hubungi
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Email..."
                    className="flex-1 px-3 py-2 text-xs bg-white border border-gray-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-r-md transition-colors duration-200">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 text-center md:text-left">
              © 2025 <span className="font-semibold text-blue-600">Travu</span>.
              Created by Travu-team
            </p>
            <div className="flex space-x-6 text-xs text-gray-500">
              <a href="#" className="hover:text-blue-600 transition-colors">
                Kebijakan Privasi
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Syarat & Ketentuan
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
