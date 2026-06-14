import React, { useContext, useState, useEffect } from "react";
import { useAuth } from "../component/AuthContext";
import MenuSlideBar from "../component/MenuSlidebar";
import { SidebarContext } from "../component/SidebarContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import {
  GetProduksiById,
  GetLogMesinByIdProduksi,
} from "../service/Api";
import { ArrowLeft} from "lucide-react";

const DetailLaporan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { expanded } = useContext(SidebarContext);
  const { user } = useAuth();
  const [produksi, setProduksi] = useState([]);
  const [mesin, setMesin] = useState([]);
  const [cekJumlah, setCekJumlah] = useState(null);

  const getData = async () => {
    try {
      const produksi = await GetProduksiById(id);
      const logMesin = await GetLogMesinByIdProduksi(id);
      setProduksi(produksi.data);
      const monitoringMesin = logMesin?.data?.monitoring_mesin;
      if (!Array.isArray(monitoringMesin) || monitoringMesin.length === 0) {
        return setCekJumlah(false);
      } else {
        setCekJumlah(true);
      }
      setMesin(
        (logMesin.data.monitoring_mesin || [])
          .slice()
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      );
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setMesin([]);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const formatTanggalIndo = (date) => {
    if (!date) return "-";
  
    return new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
  return (
    <>
      <div className="w-full min-h-screen relative overflow-x-hidden bg-gray-950">
        <MenuSlideBar />

        <div
          className={`transition-all duration-300 ${
            expanded ? "sm:ml-72" : "ml-20"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="mb-6">
              <div className="w-full flex justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-wide">
                    Detail Log Mesin
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">
                    Informasi detail aktivitas dan kondisi mesin produksi
                  </p>
                </div>
                <button
                  onClick={() => window.history.back()}
                  className="flex h-[37px] items-center gap-2 text-sm text-gray-300
            bg-slate-800 border border-gray-500 rounded px-4 py-2
            hover:bg-slate-700 transition cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  Kembali
                </button>
              </div>
            </div>
            <div className="w-full flex justify-end mb-5">
            {produksi && (
            <button
              onClick={() =>
                window.open(
                  `http://localhost:3000/laporan/qrcode/${produksi.qrCode}/pdf`,
                  "_blank"
                )
              }
              className="flex items-center gap-2 text-sm text-gray-300
  bg-slate-800 border border-gray-500 rounded px-4 py-2
  hover:bg-slate-700 transition cursor-pointer"
            >
              🖨️ Cetak
            </button>
          )}
            </div>

            {/* Card */}
            <div className="rounded-2xl bg-gray-900/80 backdrop-blur border border-gray-800 shadow-xl">
              {/* Card Header */}
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-lg font-medium">Data Produksi</h2>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-900/30 text-blue-400">
                  {produksi?.konfrmasi === true
                    ? "Produksi Selesai"
                    : "Produksi Aktif"}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                {[
                  ["Nama Produksi", produksi?.name],
                  ["Produk", produksi?.produk?.name],
                  ["Shift", produksi?.shift?.shift],
                  ["Line", produksi?.line?.name],
                  ["Tanggal", formatTanggalIndo(produksi?.createdAt)],
                  ["Nama Ketua Regu", produksi?.user?.name],
                ].map(([label, value], i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 border-b border-gray-800/60 pb-3"
                  >
                    <span className="w-36 text-sm text-gray-400">{label}</span>
                    <span className="text-sm font-medium text-gray-100 truncate">
                      : {value}
                    </span>
                  </div>
                ))}
                {/* ================= KPI ================= */}
                <div className="grid grid-cols-3 gap-4">
                  <KPI
                    title="Hasil Produksi"
                    value={`${produksi?.hasil} pcs`}
                    color="emerald"
                  />
                  <KPI
                    title="Barang Reject"
                    value={`${produksi?.reject} pcs`}
                    color="red"
                  />
                  <KPI
                    title="Target Produksi"
                    value={`${produksi?.target} pcs`}
                    color="blue"
                  />
                </div>

                {/* ================= CATATAN ================= */}
                <div>
                  <p className="text-xs text-slate-400 mb-1">
                    Catatan Produksi
                  </p>
                  <div className="p-4 rounded-lg border border-slate-700 bg-[#0a0e17] text-sm text-slate-200">
                    {produksi?.catatan || "Tidak ada catatan"}
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl mt-6 bg-gray-900/80 backdrop-blur border border-gray-800 shadow-xl">
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-lg font-medium">Data Log Mesin</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Detail kondisi dan aktivitas mesin produksi
                </p>
              </div>

              <div className="p-6 space-y-8">
                {mesin?.length > 0 ? (
                  mesin.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-gray-800 bg-gray-900/60 p-5"
                    >
                      {/* Header Mesin */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-200">
                          Mesin #{index + 1} — {item?.mesin?.name} -{" "}
                          {new Date(item.createdAt).toLocaleTimeString(
                            "id-ID",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: false,
                              timeZone: "Asia/Jakarta",
                            }
                          )}
                        </h3>

                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            item?.status === "NORMAL"
                              ? "bg-green-900/30 text-green-400"
                              : item?.status === "SEDANG"
                              ? "bg-yellow-900/30 text-yellow-400"
                              : "bg-red-900/30 text-red-400"
                          }`}
                        >
                          {item?.status}
                        </span>
                      </div>

                      {/* Info Mesin */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                        {[
                          ["Kondisi Mesin", item?.status],
                          ["Jenis Kerusakan", item?.jenisKerusakan || "-"],
                          ["Kerusakan Lainnya", item?.kerusakan_lainnya || "-"],
                          ["Downtime (menit)", item?.downtime ?? "-"],
                          ["Nama Operator", item?.user?.name ?? "-"],
                          [
                            "Jam Normal",
                            item?.jamNormal
                              ? new Date(item.jamNormal).toLocaleTimeString("id-ID", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  timeZone: "Asia/Jakarta",
                                })
                              : "-",
                          ]  
                        ].map(([label, value], i) => (
                          <div
                            key={i}
                            className="flex gap-3 border-b border-gray-800 pb-2"
                          >
                            <span className="w-40 text-sm text-gray-400">
                              {label}
                            </span>
                            <span className="text-sm font-medium text-gray-100">
                              : {value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Catatan */}
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">
                          Catatan Operator
                        </h4>
                        <div className="rounded-lg bg-gray-800/60 border border-gray-700 p-4 text-sm text-gray-200">
                          {item?.catatan || "-"}
                        </div>
                      </div>
                      {/* Catatan Akhir */}
                      {item?.statusAkhir && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">
                            Catatan Akhir Mesin
                          </h4>
                          <div className="rounded-lg bg-green-900/20 border border-green-700 p-4 text-sm text-green-200">
                            {item?.catatanAkhir || "-"}
                          </div>
                        </div>
                      )}

                      {/* Gambar */}
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-3">
                          Dokumentasi Kerusakan
                        </h4>

                        {item?.gambar?.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {item.gambar.map((img) => (
                              <div
                                key={img.id}
                                className="rounded-xl overflow-hidden border border-gray-700 bg-gray-800"
                              >
                                <img
                                  src={`http://localhost:3000${img.url}`}
                                  alt="dokumentasi"
                                  className="w-full h-40 object-cover hover:scale-105 transition-transform"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400">
                            Tidak ada gambar
                          </p>
                        )}
                      </div>

                      {/* Status Akhir */}
                      <div className="mt-5 pt-4 border-t border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="text-sm text-gray-400">
                          Status Akhir Mesin:
                          <span
                            className={`ml-2 font-medium ${
                              item?.statusAkhir
                                ? "text-green-400"
                                : "text-yellow-400"
                            }`}
                          >
                            {item?.statusAkhir
                              ? "Mesin Normal"
                              : "Masih Bermasalah"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center">
                    Belum ada data log mesin
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const KPI = ({ title, value, color }) => {
  const colors = {
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    red: "border-red-500/30 bg-red-500/10 text-red-400",
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  };

  return (
    <div className={`p-4 rounded-xl border ${colors[color]} text-center`}>
      <p className="text-xs uppercase tracking-wide mb-1 opacity-80">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default DetailLaporan;
