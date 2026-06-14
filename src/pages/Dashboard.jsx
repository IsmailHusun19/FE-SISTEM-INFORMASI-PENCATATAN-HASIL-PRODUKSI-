import React, { useEffect, useState, useContext } from "react";
import CountUp from "react-countup";
import { Factory, XCircle, Timer, Wrench, AlertTriangle } from "lucide-react";
import MenuSlideBar from "../component/MenuSlidebar";
import { SidebarContext } from "../component/SidebarContextProvider";
import FilterBar from "../component/FilterBar";
import ProductionChart from "../component/ProductionChart";
import RejectRateCard from "../component/RejectRateCard";
import { useNavigate } from "react-router-dom";
import {
  GetSummary,
  GetChart,
  GetMesinRusak,
  GetKerusakanJenis,
  GetRejectRate,
  GetDashboardPdf,
} from "../service/Api";
import MesinRusakChart from "../component/mesinRusakChart";
import KerusakanJenisChart from "../component/KerusakanJenisChart";

/* ====================== STAT CARD ====================== */
const StatCard = ({ title, value, icon: Icon, color, onClick  }) => (
  <div
  onClick={onClick}
    className="h-32 bg-white/10 backdrop-blur rounded-xl p-4
    border-l-8 flex flex-col justify-center gap-2 cursor-pointer"
    style={{ borderColor: color }}
  >
    <div className="flex justify-between items-center">
      <CountUp
        end={value}
        duration={1}
        separator="."
        className="text-4xl font-semibold text-gray-100"
      />
      <Icon size={36} style={{ color }} />
    </div>
    <span className="text-gray-300 text-sm">{title}</span>
  </div>
);

/* ====================== SKELETON ====================== */
const SkeletonCard = () => (
  <div className="h-32 rounded-xl bg-white/5 animate-pulse" />
);

/* ====================== DASHBOARD ====================== */
const Dashboard = () => {
  const { expanded } = useContext(SidebarContext);
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const [filters, setFilters] = useState({
    startDate: "2026-01-08",
    endDate: new Date(
      new Date(today).setDate(new Date(today).getDate() + 1)
    )
      .toISOString()
      .split("T")[0],
    shiftId: "",
    lineId: "",
  });
  const [summary, setSummary] = useState(null);
  const [chart, setChart] = useState([]);
  const [chartMode, setChartMode] = useState("line");
  const [mesinRusak, setMesinRusak] = useState([]);
  const [kerusakanJenis, setKerusakanJenis] = useState([]);
  const [rejectRate, setRejectRate] = useState({
    totalProduksi: 0,
    totalReject: 0,
    rejectRate: 0,
  });
  const [printing, setPrinting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  

  /* ====================== BUILD QUERY ====================== */
  const buildQuery = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.append(k, v));
    return params.toString();
  };

  /* ====================== FETCH DATA ====================== */
  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);

      const q = buildQuery();

      const [
        summaryRes,
        chartRes,
        mesinRusakRes,
        kerusakanJenisRes,
        rejectRateRes,
      ] = await Promise.all([
        GetSummary(q),
        GetChart(q, chartMode),
        GetMesinRusak(q),
        GetKerusakanJenis(q),
        GetRejectRate(q), // ⬅️ TAMBAHAN
      ]);

      if (summaryRes) setSummary(summaryRes);

      setChart(Array.isArray(chartRes) ? chartRes : chartRes?.data || []);
      setMesinRusak(Array.isArray(mesinRusakRes) ? mesinRusakRes : []);
      setKerusakanJenis(
        Array.isArray(kerusakanJenisRes) ? kerusakanJenisRes : []
      );

      // ✅ Reject Rate
      if (rejectRateRes) {
        setRejectRate(rejectRateRes);
      }

      setLastUpdated(new Date());
      setLoading(false);
    };

    fetchDashboard();
  }, [filters, chartMode]);

  const handlePrintPdf = async () => {
    try {
      setPrinting(true);

      const query = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        shiftId: filters.shiftId || undefined,
        lineId: filters.lineId || undefined,
      };

      const blob = await GetDashboardPdf(query);

      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = `dashboard-produksi-${filters.startDate}-${filters.endDate}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Gagal mencetak PDF");
    } finally {
      setPrinting(false);
    }
  };

  /* ====================== RENDER ====================== */
  return (
    <div className="bg-gray-950 min-h-screen">
      <MenuSlideBar />

      <div className={`p-4 transition-all ${expanded ? "sm:ml-72" : "ml-20"}`}>
        {/* ================= FILTER ================= */}
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onReset={() =>
            setFilters({
              startDate: today,
              endDate: today,
              shiftId: "",
              lineId: "",
            })
          }
        />

        {/* ================= FILTER CONTEXT ================= */}
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-300">
          <span className="px-2 py-1 rounded-lg bg-gray-800 border border-gray-700">
            📅 {filters.startDate} → {filters.endDate}
          </span>

          {filters.shiftId && (
            <span className="px-2 py-1 rounded-lg bg-gray-800 border border-gray-700">
              Shift {filters.shiftId}
            </span>
          )}

          {filters.lineId && (
            <span className="px-2 py-1 rounded-lg bg-gray-800 border border-gray-700">
              Line {filters.lineId}
            </span>
          )}

          <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Mode: {chartMode.toUpperCase()}
          </span>

          {lastUpdated && (
            <span className="ml-auto text-[11px] text-gray-400">
              Terakhir diperbarui: {lastUpdated.toLocaleDateString()}{" "}
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <StatCard
                title="Total Produksi"
                value={summary?.totalProduksi || 0}
                icon={Factory}
                color="#22c55e"
                onClick={() => navigate("/produksi-reject")}
              />
              <StatCard
                title="Total Reject (pcs)"
                value={summary?.totalReject || 0}
                icon={XCircle}
                color="#ef4444"
                onClick={() => navigate("/produksi-reject")}
              />
              <StatCard
                title="Total Downtime (Menit)"
                value={summary?.totalDowntime || 0}
                icon={Timer}
                color="#f59e0b"
                onClick={() => navigate("/down-time")}
              />
              <StatCard
                title="Mesin Masih Rusak"
                value={summary?.mesinBermasalah || 0}
                icon={Wrench}
                color="#fb7185"
                onClick={() => navigate("/mesin-rusak")}
              />
            </>
          )}
        </div>
        <RejectRateCard data={rejectRate} loading={loading} />

        {/* ================= ALERT ================= */}
        {!loading && summary?.mesinBermasalah > 0 && (
          <div className="mt-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-400">
            <AlertTriangle size={18} />
            Terdapat mesin yang <strong>MASIH RUSAK</strong>
          </div>
        )}

        {/* ================= CHART ================= */}
        {!loading && chart.length === 0 ? (
          <div className="mt-6 rounded-2xl p-6 bg-white/5 border border-gray-800 text-gray-400 text-sm text-center">
            Tidak ada data produksi untuk filter ini.
            <br />
            Coba ubah tanggal, shift, atau line.
          </div>
        ) : (
          <ProductionChart
            data={chart}
            mode={chartMode}
            setMode={setChartMode}
          />
        )}
        <div className="grid grid-cols-1 xl:grid-cols-1 gap-6 mt-6">
          <MesinRusakChart data={mesinRusak} />
          <KerusakanJenisChart data={kerusakanJenis} />
        </div>
        <div className="mb-4 flex justify-end">
          <button
            onClick={handlePrintPdf}
            disabled={printing}
            className={`
      px-4 py-2 flex items-center gap-2
      text-sm font-semibold
      rounded border transition mt-5 cursor-pointer
      ${
        printing
          ? "bg-slate-800 text-gray-400 border-gray-600 cursor-not-allowed"
          : "bg-slate-900 text-blue-300 border-blue-700 hover:bg-slate-800"
      }
    `}
          >
            {printing ? (
              <>
                <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Menyiapkan PDF...
              </>
            ) : (
              "Cetak PDF"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
