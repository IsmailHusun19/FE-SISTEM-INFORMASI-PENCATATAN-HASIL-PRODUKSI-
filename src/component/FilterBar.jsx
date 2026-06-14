import { CalendarDays, Layers, Factory, RotateCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { GetAllLine } from "../service/Api";

const InputWrapper = ({ label, icon: Icon, children }) => (
  <div className="relative group">
    <label
      className="absolute -top-2 left-3 px-1 text-[11px]
      bg-gray-900 text-gray-400 group-focus-within:text-blue-400
      transition"
    >
      {label}
    </label>

    <div
      className="flex items-center gap-2 h-11 px-3 rounded-xl
      bg-gray-950 border border-gray-800
      shadow-inner shadow-black/40
      group-focus-within:border-blue-500
      transition"
    >
      <Icon size={16} className="text-gray-500" />
      {children}
    </div>
  </div>
);

const FilterBar = ({ filters, setFilters, onReset }) => {
  const [lines, setLines] = useState([]);

  const getData = async () => {
    try {
      const getLine = await GetAllLine();
      setLines(getLine.data);
    } catch (error) {
      console.error("Gagal mengambil data line :", error);
      setProduct([]);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div
      className="bg-gray-900/80 backdrop-blur-xl
      border border-gray-800 rounded-2xl
      px-6 py-5 mb-6 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-gray-300 text-sm font-semibold">
          <Layers size={16} />
          Filter Data Produksi
        </div>

        <button
          onClick={() => {
            onReset();
            window.location.reload();
          }}
          className="flex items-center gap-2 text-xs px-3 py-1.5
          rounded-lg border border-gray-700 text-gray-300
          hover:bg-gray-800 transition cursor-pointer"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Start Date */}
        <InputWrapper label="Tanggal Mulai" icon={CalendarDays}>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            className="w-full bg-gray-950 text-gray-200 text-sm
            outline-none"
          />
        </InputWrapper>

        {/* End Date */}
        <InputWrapper label="Tanggal Akhir" icon={CalendarDays}>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            className="w-full bg-gray-950 text-gray-200 text-sm
            outline-none"
          />
        </InputWrapper>

        {/* Shift */}
        <InputWrapper label="Shift" icon={Factory}>
          <select
            value={filters.shiftId}
            onChange={(e) =>
              setFilters({ ...filters, shiftId: e.target.value })
            }
            className="w-full bg-gray-950 text-gray-200 text-sm
            outline-none"
          >
            <option value="">Semua Shift</option>
            <option value="1">Shift 1</option>
            <option value="2">Shift 2</option>
            <option value="3">Shift 3</option>
          </select>
        </InputWrapper>

        {/* Line */}
        <InputWrapper label="Line Produksi" icon={Layers}>
          <select
            value={filters.lineId}
            onChange={(e) => setFilters({ ...filters, lineId: e.target.value })}
            className="w-full bg-gray-950 text-gray-200 text-sm outline-none"
          >
            <option value="">Semua Line</option>

            {lines.map((line) => (
              <option key={line.id} value={line.id}>
                {line.name}
              </option>
            ))}
          </select>
        </InputWrapper>
      </div>
    </div>
  );
};

export default FilterBar;
