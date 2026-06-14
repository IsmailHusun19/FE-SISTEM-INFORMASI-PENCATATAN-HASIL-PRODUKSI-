import React from "react";
import { AlertTriangle } from "lucide-react";

/* ================== HELPER ================== */
const getRejectStatus = (rate) => {
  if (rate <= 3) {
    return {
      label: "Baik",
      color: "#22c55e",
      bg: "bg-green-500/10",
      border: "border-green-500/30",
    };
  }

  if (rate <= 5) {
    return {
      label: "Perlu Perhatian",
      color: "#f59e0b",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
    };
  }

  return {
    label: "Tinggi",
    color: "#ef4444",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  };
};

/* ================== COMPONENT ================== */
const RejectRateCard = ({ data, loading }) => {
  const rate = data?.rejectRate || 0;
  const status = getRejectStatus(rate);

  if (loading) {
    return (
      <div className="h-36 rounded-2xl bg-white/5 animate-pulse" />
    );
  }

  return (
    <div
      className={`h-36 rounded-2xl p-4 border mt-6
      bg-white/10 backdrop-blur
      flex flex-col justify-between
      ${status.bg} ${status.border}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-300 font-medium">
          Reject Rate
        </span>
        <AlertTriangle size={20} style={{ color: status.color }} />
      </div>

      {/* Main Value */}
      <div className="flex items-end gap-2">
        <span
          className="text-4xl font-bold"
          style={{ color: status.color }}
        >
          {rate}%
        </span>
        <span className="text-xs text-gray-400 mb-1">
          kualitas
        </span>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span>
          Status:{" "}
          <b style={{ color: status.color }}>
            {status.label}
          </b>
        </span>
        <span>
          Reject: {data?.totalReject} / {data?.totalProduksi}
        </span>
      </div>
    </div>
  );
};

export default RejectRateCard;
