import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-900/95 border border-gray-700
        rounded-xl px-4 py-2 shadow-xl">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-white">
          Produksi: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const ProductionChart = ({ data, mode, setMode }) => {
  const modes = [
    { key: "line", label: "Per Line" },
    { key: "produk", label: "Per Produk" },
    { key: "shift", label: "Per Shift" },
  ];

  return (
    <div
      className="mt-6 rounded-2xl p-5
      bg-gradient-to-br from-gray-900/90 to-gray-800/80
      border border-gray-800 shadow-2xl"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-gray-100 text-sm font-semibold">
            Statistik Produksi
          </h2>
          <p className="text-xs text-gray-400">
            Tampilan {modes.find((m) => m.key === mode)?.label}
          </p>
        </div>

        {/* MODE SWITCH */}
        <div className="flex gap-1 bg-gray-900 rounded-xl p-1">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`px-3 py-1.5 text-xs rounded-lg transition
                ${
                  mode === m.key
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800"
                }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* CHART */}
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barSize={36}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#374151"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="value"
            radius={[10, 10, 0, 0]}
            fill="#3b82f6"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductionChart;
