import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import Papa from "papaparse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const TravelPlanForm = ({ visible, onClose }) => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [wisataData, setWisataData] = useState([]);
  const [travelPlan, setTravelPlan] = useState({
    name: "",
    date: "",
    items: [],
  });
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mengambil data dari file CSV saat modal terbuka
  useEffect(() => {
    if (visible) {
      fetch("/src/data/wisata_indonesia_final_fix.csv")
        .then((res) => res.text())
        .then((csvText) => {
          const result = Papa.parse(csvText, { header: true });
          setWisataData(result.data);
          const uniqueCategories = [
            ...new Set(result.data.map((item) => item.kategori)),
          ];
          setCategories(uniqueCategories);
        });
    }
  }, [visible]);

  const handleAddItem = (item) => {
    if (!travelPlan.name || !travelPlan.date) {
      alert("Harap isi nama dan tanggal rencana wisatamu terlebih dahulu!");
      return;
    }
    setTravelPlan((prev) => ({
      ...prev,
      items: [...prev.items, item],
    }));
  };

  const handleRemoveItem = (index) => {
    setTravelPlan((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleNameChange = (e) => {
    setTravelPlan((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  const handleDateChange = (e) => {
    setTravelPlan((prev) => ({
      ...prev,
      date: e.target.value,
    }));
  };

  useEffect(() => {
    if (selectedProvince && selectedCategory) {
      const results = wisataData.filter(
        (item) =>
          item.provinsi === selectedProvince &&
          item.kategori === selectedCategory
      );
      setSearchResults(results);
    }
  }, [selectedProvince, selectedCategory, wisataData]);

  const handleSubmitPlan = async () => {
    if (!travelPlan.name || !travelPlan.date || travelPlan.items.length === 0) {
      alert("Harap isi semua data dan pilih minimal 1 tempat wisata!");
      return;
    }

    setIsSubmitting(true);
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));

      const response = await fetch("http://localhost:5000/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.token}`,
        },
        body: JSON.stringify({
          userId: userData?.id,
          planName: travelPlan.name,
          travelDate: travelPlan.date,
          destinations: travelPlan.items,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Gagal menyimpan rencana perjalanan"
        );
      }

      await response.json();
      alert("Rencana perjalananmu berhasil disimpan!");
      onClose();
    } catch (error) {
      console.error("Error submitting plan:", error);
      alert(error.message || "Terjadi kesalahan saat menyimpan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width="95%"
      style={{ maxWidth: "1400px" }}
      title={
        <div className="flex items-center space-x-3 text-xl md:text-2xl font-bold text-gray-800">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✈️</span>
          </div>
          <span>Buat Rencana Wisata Impian</span>
        </div>
      }
      footer={null}
      className="travel-plan-modal"
    >
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 md:p-6 rounded-lg">
        {/* Step Indicator */}
        <div className="mb-6 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center text-blue-600">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                1
              </div>
              <span className="font-semibold">Isi Detail Rencana</span>
            </div>
            <div className="hidden sm:block w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center text-gray-400">
              <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                2
              </div>
              <span className="font-semibold">Pilih Destinasi</span>
            </div>
            <div className="hidden sm:block w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center text-gray-400">
              <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                3
              </div>
              <span className="font-semibold">Simpan Rencana</span>
            </div>
          </div>
        </div>

        {/* Step 1: Form Input */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-100">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xs">📝</span>
              </div>
              Step 1: Detail Rencana Perjalanan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Rencana Wisata *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Petualangan Seru di Yogyakarta"
                  className="w-full border-2 border-gray-200 rounded-lg p-3 md:p-4 focus:border-blue-500 focus:outline-none transition-all duration-200 text-sm md:text-base text-white"
                  value={travelPlan.name}
                  onChange={handleNameChange}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tanggal Rencana Wisata *
                </label>
                <input
                  type="date"
                  className="w-full border-2 border-gray-200 rounded-lg p-3 md:p-4 focus:border-blue-500 focus:outline-none transition-all duration-200 text-sm md:text-base text-white"
                  value={travelPlan.date}
                  onChange={handleDateChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Search Destinations (only show if step 1 is completed) */}
        {travelPlan.name && travelPlan.date && (
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-100">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">🔍</span>
                </div>
                Step 2: Cari & Pilih Destinasi Wisata
              </h3>

              {/* Filter Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="mr-2">🏝️</span>Provinsi
                  </label>
                  <select
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none transition-all duration-200 text-sm md:text-base bg-white text-gray-800"
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                  >
                    <option value="" className="text-gray-500">
                      Pilih Provinsi
                    </option>
                    {[...new Set(wisataData.map((item) => item.provinsi))].map(
                      (prov) => (
                        <option
                          key={prov}
                          value={prov}
                          className="text-gray-800"
                        >
                          {prov}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="mr-2">🎪</span>Kategori Wisata
                  </label>
                  <select
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none transition-all duration-200 text-sm md:text-base bg-white text-gray-800"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="" className="text-gray-500">
                      Pilih Kategori
                    </option>
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                        className="text-gray-800"
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Results */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base md:text-lg font-semibold text-gray-800 flex items-center">
                    <span className="mr-2">🎯</span>
                    Destinasi Tersedia
                  </h4>
                  {searchResults.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-xs md:text-sm px-2 py-1 rounded-full">
                      {searchResults.length} hasil
                    </span>
                  )}
                </div>

                <div className="max-h-64 md:max-h-80 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-3xl md:text-4xl mb-4">🔍</div>
                      <p className="text-base md:text-lg">
                        Pilih provinsi dan kategori
                      </p>
                      <p className="text-sm">untuk melihat destinasi wisata</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {searchResults.map((item, index) => (
                        <div
                          key={index}
                          className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:border-blue-300 hover:-translate-y-1"
                        >
                          <div className="relative overflow-hidden rounded-xl mb-3">
                            <img
                              src={item.Image_Path}
                              alt={item.nama_wisata}
                              className="w-full h-32 md:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                              <span className="text-xs font-semibold text-gray-700">
                                #{index + 1}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-bold text-gray-800 text-sm md:text-base line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {item.nama_wisata}
                            </h4>
                            <div className="flex items-center text-gray-600 text-xs md:text-sm">
                              <span className="mr-1">📍</span>
                              <span className="truncate">{item.provinsi}</span>
                            </div>
                            <div className="flex items-center text-gray-500 text-xs">
                              <span className="mr-1">🏷️</span>
                              <span className="truncate">{item.kategori}</span>
                            </div>
                          </div>

                          <button
                            className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center group-hover:scale-105"
                            onClick={() => handleAddItem(item)}
                          >
                            <span className="mr-2">✨</span>
                            Tambah ke Rencana
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Selected Destinations & Save */}
        {travelPlan.name && travelPlan.date && (
          <div className="mb-4">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4 md:mb-6 pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-800 flex items-center">
                    <span className="mr-2 md:mr-3">🎯</span>
                    <span className="truncate">{travelPlan.name}</span>
                  </h3>
                  <p className="text-gray-600 flex items-center mt-1 md:mt-2 text-sm md:text-base">
                    <span className="mr-2">📅</span>
                    <span>
                      {new Date(travelPlan.date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </p>
                </div>
                {travelPlan.items.length > 0 && (
                  <div className="text-right">
                    <div className="bg-green-100 text-green-800 text-xs md:text-sm px-3 py-1 rounded-full font-semibold">
                      {travelPlan.items.length} Destinasi
                    </div>
                  </div>
                )}
              </div>

              {travelPlan.items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-3xl md:text-4xl mb-4">🗺️</div>
                  <p className="text-base md:text-lg">
                    Belum ada destinasi yang dipilih
                  </p>
                  <p className="text-sm">
                    Pilih destinasi dari section di atas
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 md:space-y-4 mb-6">
                    {travelPlan.items.map((item, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 md:p-4 border border-blue-100"
                      >
                        <div className="flex gap-3 md:gap-4">
                          <div className="relative flex-shrink-0">
                            <img
                              src={item.
                                Image_Path}
                              alt={item.nama_wisata}
                              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg shadow-sm"
                            />
                            <div className="absolute -top-2 -left-2 w-5 h-5 md:w-6 md:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 text-sm md:text-lg truncate">
                              {item.nama_wisata}
                            </h4>
                            <p className="text-gray-600 flex items-center mt-1 text-xs md:text-sm">
                              <span className="mr-1">📍</span>
                              <span className="truncate">{item.provinsi}</span>
                            </p>
                            <button
                              onClick={() => handleRemoveItem(index)}
                              className="mt-2 flex items-center text-red-500 hover:text-red-700 hover:bg-red-50 px-2 md:px-3 py-1 rounded-lg transition-all text-xs md:text-sm"
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="mr-1 md:mr-2"
                              />
                              <span className="font-medium">Hapus</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSubmitPlan}
                      disabled={isSubmitting}
                      className={`
                      w-full py-3 md:py-4 rounded-xl text-white font-semibold text-base md:text-lg transition-all duration-200
                      ${
                        isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl"
                      }
                    `}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white mr-2"></div>
                          Menyimpan...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <span className="mr-2">💾</span>
                          Simpan Rencana Perjalanan
                        </span>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TravelPlanForm;
