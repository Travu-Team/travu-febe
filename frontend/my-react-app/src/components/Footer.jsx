import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 w-full">
      <div className="w-full max-w-screen-xl mx-auto px-4 flex flex-col items-center space-y-4">
        <img src="/image/logo-travu.png" alt="Travu Logo" className="w-24 h-24" />

        <p className="text-center max-w-md text-gray-600">
          Yuk, eksplor Travu! Ada banyak inspirasi wisata dan fitur seru yang ngebantu kamu cari liburan yang pas banget.
        </p>

        <div className="flex space-x-4">
          <a href="#" className="text-primary hover:text-primary">
            <FontAwesomeIcon icon={faFacebook} size="lg" />
          </a>
          <a href="#" className="text-primary hover:text-primary">
            <FontAwesomeIcon icon={faInstagram} size="lg" />
          </a>
          <a href="#" className="text-primary hover:text-primary">
            <FontAwesomeIcon icon={faTwitter} size="lg" />
          </a>
        </div>
      </div>

      <div className="bg-primary text-white text-center py-4 mt-8 w-full">
        <p>©Travu. Hak Cipta 2025</p>
      </div>
    </footer>
  );
};

export default Footer;
