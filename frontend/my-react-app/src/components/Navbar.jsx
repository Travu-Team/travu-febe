import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { authService } from "../services/authService";
import { apiClient, API_CONFIG } from "../services/apiConfig";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom"; // Tambahkan useLocation untuk highlight active link

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const _location = useLocation(); // Untuk highlight active link
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Set user data from token first for initial display
        setUser({
          username: decoded.nama || decoded.name || decoded.username || "User",
          email: decoded.email || "",
          nickname: decoded.nickname || "",
        });

        // Fetch full profile data from API
        fetchUserProfile();
      } catch (error) {
        console.error("Token decode error:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.PROFILE);

      if (response.success && response.data) {
        setUser((prevUser) => ({
          ...prevUser,
          username: response.data.name || response.data.username || "User",
          nickname: response.data.nickname || "",
          email: response.data.email || prevUser?.email || "",
        }));
      }
    } catch (error) {
      console.warn("Failed to fetch user profile:", error);
      // Keep existing user data from token if API call fails
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleLogout = () => {
    authService.clearToken();
    setUser(null);
    window.location.href = "/login";
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "U";
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  // Get display name prioritizing nickname
  const getDisplayName = (user) => {
    if (!user) return "User";

    // Prioritize nickname if available, otherwise use first name from username
    if (user.nickname && user.nickname.trim()) {
      return user.nickname.trim();
    }

    if (user.username && typeof user.username === "string") {
      return user.username.trim().split(" ")[0];
    }

    return "User";
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false); // Tutup search bar
      // Tidak reset searchQuery agar URL tetap mencerminkan pencarian
    }
  };

  // Handle protected navigation
  const handleProtectedNavigation = (e) => {
    if (!user) {
      e.preventDefault();
      alert("Silakan login terlebih dahulu untuk mengakses halaman ini");
      window.location.href = "/login";
    }
  };

  return (
    <nav className="w-full bg-white h-[60px] shadow-md z-50 relative">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-blue-600 mb-1 transition-all duration-300 hover:text-transparent hover:bg-[conic-gradient(from_256.62deg_at_50%_50%,#47bb8e_-33.72deg,#3a59d1_241.19deg,#47bb8e_326.28deg,#3a59d1_601.19deg)] hover:bg-clip-text"
        >
          TRAVU
        </a>

        {/* Right side (Desktop Navigation + Profile + Search) */}
        <div className="hidden md:flex items-center space-x-6">
          <a
            href="/"
            className={`text-[#6a7bd9] ${
              window.location.pathname === "/" ? "font-bold" : ""
            } hover:no-underline hover:[text-shadow:1px_1px_0px_rgba(0,0,0,0.1)]`}
          >
            Beranda
          </a>
          <a
            href="/about"
            onClick={!user ? (e) => handleProtectedNavigation(e) : undefined}
            className={`text-[#6a7bd9] ${
              window.location.pathname === "/about" ? "font-bold" : ""
            } ${
              !user ? "opacity-50 cursor-not-allowed" : ""
            } hover:no-underline hover:[text-shadow:1px_1px_0px_rgba(0,0,0,0.1)]`}
          >
            Tentang Kami
          </a>
          <a
            href="/plan"
            onClick={!user ? (e) => handleProtectedNavigation(e) : undefined}
            className={`text-[#6a7bd9] ${
              window.location.pathname === "/plan" ? "font-bold" : ""
            } ${
              !user ? "opacity-50 cursor-not-allowed" : ""
            } hover:no-underline hover:[text-shadow:1px_1px_0px_rgba(0,0,0,0.1)]`}
          >
            Rencana Wisata
          </a>

          {/* Profile Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center bg-[#3a59d1] text-white border font-semibold rounded-full px-4 py-1 shadow-md hover:ring-2 hover:ring-blue-400 transition"
                aria-haspopup="true"
                aria-expanded={isProfileDropdownOpen}
                disabled={isLoadingProfile}
              >
                <div className="w-9 h-9 rounded-full bg-white p-[2px] mr-2">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      getInitials(user.nickname || user.username)
                    )}&background=3a59d1&bold=true&color=fff`}
                    alt="Avatar"
                    className="w-full h-full rounded-full"
                  />
                </div>
                {isLoadingProfile
                  ? "Loading..."
                  : `Hai, ${getDisplayName(user)}!`}
              </button>

              {isProfileDropdownOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg z-50">
                  <li>
                    <a
                      href="/profile"
                      className="w-full text-left block px-4 py-3 text-gray-800 hover:bg-gray-200 hover:text-gray-800 font-normal no-underline focus:outline-none"
                    >
                      Pengaturan
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-3 text-gray-800 hover:bg-gray-200 hover:text-gray-800 font-normal focus:outline-none"
                    >
                      Keluar
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}

          {/* Login button when user is not logged in */}
          {!user && (
            <a
              href="/login"
              className="bg-[#3a59d1] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#2d4aa1] transition"
            >
              Masuk
            </a>
          )}

          {/* Search Toggle (Desktop) */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle search"
            className="w-10 h-10 bg-[#3a59d1] text-white rounded-full flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        {/* Mobile Right Side */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Mobile: Avatar Initials */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-10 h-10 bg-[#3a59d1] text-white rounded-full flex items-center justify-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 hover:ring-2 hover:ring-blue-400 transition"
                aria-haspopup="true"
                aria-expanded={isProfileDropdownOpen}
                disabled={isLoadingProfile}
              >
                {isLoadingProfile
                  ? "..."
                  : getInitials(user.nickname || user.username)}
              </button>

              {isProfileDropdownOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg z-50">
                  <li className="px-4 py-2 text-gray-800 break-words">
                    {getDisplayName(user)}
                  </li>
                  <li className="px-4 my-0 text-gray-800 break-words">
                    {user.email}
                  </li>
                  <hr className="my-2 border-gray-300" />
                  <li>
                    <a
                      href="/profile"
                      className="all-[unset] block w-full px-4 py-3 text-left text-gray-800 hover:bg-gray-200 hover:text-gray-800 font-normal cursor-pointer"
                    >
                      Pengaturan
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-3 text-gray-900 hover:bg-gray-200"
                    >
                      Keluar
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}

          {/* Login button when user is not logged in (Mobile) */}
          {!user && (
            <a
              href="/login"
              className="bg-[#3a59d1] text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-[#2d4aa1] transition"
            >
              Masuk
            </a>
          )}

          {/* Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle search"
            className="w-10 h-10 bg-[#3a59d1] text-white rounded-full flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>

          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 text-[#3a59d1]"
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
        <div className="absolute top-[60px] left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-40 mt-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
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
                Beranda
              </a>
            </li>
            <li>
              <a
                href="/about"
                onClick={
                  !user
                    ? (e) => handleProtectedNavigation(e, "/about")
                    : undefined
                }
                className={`block py-2 px-3 text-[#3a59d1] hover:bg-gray-100 rounded ${
                  !user ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Tentang Kami
              </a>
            </li>
            <li>
              <a
                href="/plan"
                onClick={
                  !user
                    ? (e) => handleProtectedNavigation(e, "/plan")
                    : undefined
                }
                className={`block py-2 px-3 text-[#3a59d1] hover:bg-gray-100 rounded ${
                  !user ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Rencana Wisata
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
