import React, { useState, useEffect } from "react";
import { GetAllLine, GetAllProduct, GetAllShift } from "../service/Api";

const FilterData = ({ onClose, onApply, filters, onReset }) => {
  const [produk, setProduk] = useState([]);
  const [line, setLine] = useState([]);
  const [shift, setShift] = useState([]);
  const [localFilters, setLocalFilters] = useState(filters);

  const getData = async () => {
    try {
      const product = await GetAllProduct();
      const line = await GetAllLine();
      const shift = await GetAllShift();
      setProduk(product.data);
      setLine(line.data);
      setShift(shift.data);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleFilterChange = (e) => {
    setLocalFilters({
      ...localFilters,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    const emptyFilter = {
      startDate: "",
      endDate: "",
      shift: "",
      lineId: "",
      produkId: "",
      sortHasil: "",
      sortReject: "",
    };

    setLocalFilters(emptyFilter);
    onReset();
  };

  return (
    <>
<div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-3">
  {/* Modal Box */}
  <div className="w-full max-w-sm max-h-[85vh] bg-gray-900 border border-gray-700 rounded-xl shadow-xl flex flex-col">

    {/* Header */}
    <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
      <h3 className="text-white font-semibold">Filter Produksi</h3>
      <button
        onClick={onClose}
        className="text-gray-400 cursor-pointer hover:text-white text-xl leading-none"
      >
        ×
      </button>
    </div>
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">

      {/* Filter Waktu */}
      <div className="space-y-2">
        <p className="text-sm text-gray-300">Periode Waktu</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            name="startDate"
            value={localFilters.startDate}
            onChange={handleFilterChange}
            className="w-full h-9 px-2 bg-gray-950 border border-gray-600 rounded-lg text-gray-200 text-sm"
          />
          <input
            type="date"
            name="endDate"
            value={localFilters.endDate}
            onChange={handleFilterChange}
            className="w-full h-9 px-2 bg-gray-950 border border-gray-600 rounded-lg text-gray-200 text-sm"
          />
        </div>
      </div>

      {/* Shift */}
      <div>
        <p className="text-sm text-gray-300 mb-1">Shift</p>
        <select
          name="shift"
          value={localFilters.shift}
          onChange={handleFilterChange}
          className="w-full h-9 px-3 bg-gray-950 border border-gray-600 rounded-lg text-gray-200 text-sm"
        >
          <option value="">Semua Shift</option>
          {shift?.length > 0 ? (
            shift.map((item) => (
              <option key={item.id} value={item.id}>
                {item.shift}
              </option>
            ))
          ) : (
            <option disabled>Data shift kosong</option>
          )}
        </select>
      </div>

      {/* Line */}
      <div>
        <p className="text-sm text-gray-300 mb-1">Line Produksi</p>
        <select
          name="lineId"
          value={localFilters.lineId}
          onChange={handleFilterChange}
          className="w-full h-9 px-3 bg-gray-950 border border-gray-600 rounded-lg text-gray-200 text-sm"
        >
          <option value="">Semua Line</option>
          {line?.length > 0 ? (
            line.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))
          ) : (
            <option disabled>Data line kosong</option>
          )}
        </select>
      </div>

      {/* Produk */}
      <div>
        <p className="text-sm text-gray-300 mb-1">Produk</p>
        <select
          name="produkId"
          value={localFilters.produkId}
          onChange={handleFilterChange}
          className="w-full h-9 px-3 bg-gray-950 border border-gray-600 rounded-lg text-gray-200 text-sm"
        >
          <option value="">Semua Produk</option>
          {produk?.length > 0 ? (
            produk.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))
          ) : (
            <option disabled>Tidak ada produk</option>
          )}
        </select>
      </div>

      {/* Urutkan Hasil */}
      <div>
        <p className="text-sm text-gray-300 mb-1">Urutkan Hasil</p>
        <select
          name="sortHasil"
          value={localFilters.sortHasil}
          onChange={handleFilterChange}
          className="w-full h-9 px-3 bg-gray-950 border border-gray-600 rounded-lg text-gray-200 text-sm"
        >
          <option value="">Default</option>
          <option value="highest">Hasil Terbanyak</option>
          <option value="lowest">Hasil Tersedikit</option>
        </select>
      </div>

      {/* Urutkan Reject */}
      <div>
        <p className="text-sm text-gray-300 mb-1">Urutkan Reject</p>
        <select
          name="sortReject"
          value={localFilters.sortReject}
          onChange={handleFilterChange}
          className="w-full h-9 px-3 bg-gray-950 border border-gray-600 rounded-lg text-gray-200 text-sm"
        >
          <option value="">Default</option>
          <option value="highest">Reject Terbanyak</option>
          <option value="lowest">Reject Tersedikit</option>
        </select>
      </div>
    </div>

    {/* Footer */}
    <div className="flex justify-between items-center px-4 py-3 border-t border-gray-700">
      <button
        onClick={handleReset}
        className="text-sm cursor-pointer text-yellow-400 hover:underline"
      >
        Reset
      </button>

      <button
        onClick={() => onApply(localFilters)}
        className="h-9 cursor-pointer px-4 text-sm font-semibold text-blue-300 bg-slate-800 border border-slate-600 rounded hover:bg-slate-700 transition"
      >
        Terapkan
      </button>
    </div>

  </div>
</div>

    </>
  );
};

export default FilterData;
