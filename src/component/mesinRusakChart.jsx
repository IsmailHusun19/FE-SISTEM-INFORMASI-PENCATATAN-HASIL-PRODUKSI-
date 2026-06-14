import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Wrench, Clock } from "lucide-react";

/* ================= CUSTOM TOOLTIP ================= */
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const d = payload[0].payload;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-200 shadow-xl">
      <div className="font-semibold mb-1">{d.label}</div>
      <div className="flex justify-between gap-4">
        <span>Jumlah Rusak</span>
        <span className="font-semibold">{d.jumlahRusak}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span>Downtime</span>
        <span className="font-semibold">{d.totalDowntime} menit</span>
      </div>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */
const MesinRusakChart = ({ data = [] }) => {
  const [metric, setMetric] = useState("jumlahRusak");

  if (!data.length) return null;

  return (
    <div className="mt-6 bg-white/10 backdrop-blur rounded-2xl p-5 border border-gray-800 shadow-xl">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-gray-100 font-semibold text-sm">
            Mesin Paling Sering Rusak
          </h3>
          <p className="text-xs text-gray-400">Berdasarkan riwayat kerusakan</p>
        </div>

        {/* ===== METRIC TOGGLE ===== */}
        <div className="flex bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setMetric("jumlahRusak")}
            className={`px-3 py-1.5 text-xs flex items-center gap-1
              ${
                metric === "jumlahRusak"
                  ? "bg-red-500/20 text-red-400"
                  : "text-gray-400 hover:bg-gray-800"
              }`}
          >
            <Wrench size={14} />
            Frekuensi
          </button>

          <button
            onClick={() => setMetric("totalDowntime")}
            className={`px-3 py-1.5 text-xs flex items-center gap-1
              ${
                metric === "totalDowntime"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "text-gray-400 hover:bg-gray-800"
              }`}
          >
            <Clock size={14} />
            Downtime
          </button>
        </div>
      </div>

      {/* ===== CHART ===== */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
        >
          <defs>
            <linearGradient id="rusakGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#fb7185" stopOpacity={0.9} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            type="number"
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={120}
            tick={{ fill: "#e5e7eb", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey={metric}
            radius={[0, 8, 8, 0]}
            fill="url(#rusakGradient)"
          />
        </BarChart>
      </ResponsiveContainer>

      {/* ===== FOOTNOTE ===== */}
      <div className="mt-3 text-[11px] text-gray-400">
        * Data diurutkan berdasarkan tingkat kerusakan tertinggi
      </div>
    </div>
  );
};

export default MesinRusakChart;
