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
import { AlertTriangle, Clock } from "lucide-react";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-200 shadow-xl">
      <div className="font-semibold mb-1">{d.label}</div>
      <div className="flex justify-between gap-4">
        <span>Jumlah</span>
        <span className="font-semibold">{d.jumlah}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span>Downtime</span>
        <span className="font-semibold">{d.totalDowntime} menit</span>
      </div>
    </div>
  );
};

const KerusakanJenisChart = ({ data = [] }) => {
  const [metric, setMetric] = useState("jumlah");
  if (!data.length) return null;

  return (
    <div className="mt-6 bg-white/10 backdrop-blur rounded-2xl p-5 border border-gray-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-gray-100 font-semibold text-sm">
            Jenis Kerusakan Mesin
          </h3>
          <p className="text-xs text-gray-400">
            Analisis penyebab kerusakan
          </p>
        </div>

        <div className="flex bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setMetric("jumlah")}
            className={`px-3 py-1.5 text-xs flex items-center gap-1
              ${metric === "jumlah"
                ? "bg-red-500/20 text-red-400"
                : "text-gray-400 hover:bg-gray-800"}`}
          >
            <AlertTriangle size={14} />
            Frekuensi
          </button>

          <button
            onClick={() => setMetric("totalDowntime")}
            className={`px-3 py-1.5 text-xs flex items-center gap-1
              ${metric === "totalDowntime"
                ? "bg-yellow-500/20 text-yellow-400"
                : "text-gray-400 hover:bg-gray-800"}`}
          >
            <Clock size={14} />
            Downtime
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#e5e7eb", fontSize: 11 }}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey={metric}
            fill="#f97316"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KerusakanJenisChart;
