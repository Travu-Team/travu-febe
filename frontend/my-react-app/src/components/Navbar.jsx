import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <nav className="w-full bg-white h-[60px] shadow-md z-50 relative">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
        {/* Logo */}
        <a href="/" className="flex items-center" aria-label="TRAVU Homepage">
          <img
            src="../../src/assets/img/TRAVU_LOGOs.jpg"
            alt="Logo TRAVU"
            className="w-[100px] h-[40px] object-contain"
          />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="/" className="text-[#3a59d1] hover:underline">
            Home
          </a>
          <a href="/about" className="text-[#3a59d1] hover:underline">
            Tentang Kami
          </a>
          <a href="/plan/travelplan" className="text-[#3a59d1] hover:underline">
            Rencana Wisata
          </a>
        </div>

        {/* Kanan */}
        <div className="flex items-center space-x-2">
          {/* Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle search"
            className="w-10 h-10 bg-[#3a59d1] text-white rounded-full flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className={`flex items-center text-white rounded-full 
    focus:outline-none focus:ring-2 focus:ring-blue-300 hover:ring-2 hover:ring-blue-400 transition`}
              aria-haspopup="true"
              aria-expanded={isProfileDropdownOpen}
              aria-label="User profile menu"
            >
              <img
                src="/image/user-profile.png"
                alt="Kaluna Profile"
                className="w-10 h-10 object-cover rounded-full"
              />
              <span className="hidden sm:inline-block ml-2">Kaluna</span>
            </button>

            {isProfileDropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg z-50">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Earnings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Sign Out
                  </a>
                </li>
              </ul>
            )}
          </div>

          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 text-[#3a59d1]"
            aria-label="Toggle navigation menu"
          >
            <FontAwesomeIcon
              icon={isMenuOpen ? faTimes : faBars}
              className="text-xl"
            />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="absolute top-[60px] left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-40">
          <input
            type="text"
            placeholder="Cari sesuatu..."
            className="w-full p-2 pl-10 bg-gray-200 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search"
          />

          <FontAwesomeIcon
            icon={faSearch}
            className="absolute top-3 left-7 text-gray-400"
          />
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[60px] left-0 w-full bg-white shadow-lg z-40">
          <ul className="flex flex-col px-4 py-2 space-y-2">
            <li>
              <a
                href="/"
                className="block py-2 px-3 text-[#3a59d1] hover:bg-gray-100 rounded"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="block py-2 px-3 text-[#3a59d1] hover:bg-gray-100 rounded"
              >
                Tentang Kami
              </a>
            </li>
            <li>
              <a
                href="/services"
                className="block py-2 px-3 text-[#3a59d1] hover:bg-gray-100 rounded"
              >
                Services
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
