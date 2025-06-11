import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faHome, faUser, faSearch, faMap } from '@fortawesome/free-solid-svg-icons';

const OfflineNavbar = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/image/logo-travu.png" 
                alt="Travu" 
                className="h-8 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span 
                className="ml-2 text-xl font-bold text-gray-900 hidden"
                style={{ display: 'none' }}
              >
                Travu
              </span>
            </div>
            
            {/* Offline Indicator */}
            <div className="flex items-center space-x-2 text-red-500">
              <FontAwesomeIcon icon={faWifi} className="text-sm" />
              <span className="text-sm font-medium">Offline</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <FontAwesomeIcon 
              icon={faWifi} 
              className="text-6xl text-gray-300 mb-4" 
            />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You're Offline
          </h1>
          
          <p className="text-gray-600 mb-6">
            Check your internet connection and try again. Some cached content may still be available.
          </p>
          
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-2">
            <button 
              className="flex flex-col items-center py-2 px-3 text-gray-400 cursor-not-allowed"
              disabled
            >
              <FontAwesomeIcon icon={faHome} className="text-xl mb-1" />
              <span className="text-xs">Home</span>
            </button>
            
            <button 
              className="flex flex-col items-center py-2 px-3 text-gray-400 cursor-not-allowed"
              disabled
            >
              <FontAwesomeIcon icon={faSearch} className="text-xl mb-1" />
              <span className="text-xs">Search</span>
            </button>
            
            <button 
              className="flex flex-col items-center py-2 px-3 text-gray-400 cursor-not-allowed"
              disabled
            >
              <FontAwesomeIcon icon={faMap} className="text-xl mb-1" />
              <span className="text-xs">Plan</span>
            </button>
            
            <button 
              className="flex flex-col items-center py-2 px-3 text-gray-400 cursor-not-allowed"
              disabled
            >
              <FontAwesomeIcon icon={faUser} className="text-xl mb-1" />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default OfflineNavbar;