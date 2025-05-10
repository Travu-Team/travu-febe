import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <nav className="w-full bg-white px-4 py-3 shadow-md flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <span className="border-b border-primary text-primary font-bold text-xl">TRAVU</span>
      </div>

      <div className="hidden md:flex space-x-8">
        <a href="#about" className="text-primary hover:text-primary font-medium">Tentang Kami</a>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative bg-primary rounded-full p-2 shadow-md">
          <div className="flex items-center space-x-2">
            <img src="/image/user-profile.png" alt="Profile" className="w-10 h-10 rounded-full" />
            <div className="text-white font-medium text-lg">Hai, Kaluna!</div>
          </div>
        </div>

        <button className="bg-primary hover:bg-primary text-white font-bold py-2 px-4 rounded-full">
          <FontAwesomeIcon icon={faSearch} size="lg" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
