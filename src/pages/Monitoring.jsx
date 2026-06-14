import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";
import {
  QrCode,
  Factory,
  ClipboardList,
  AlertTriangle,
  Image as ImageIcon,
  Printer,
  Upload,
} from "lucide-react";

import MenuSlideBar from "../component/MenuSlidebar";
import { SidebarContext } from "../component/SidebarContextProvider";
import { useAuth } from "../component/AuthContext";
import { GetProduksiAndLogMesinByIdProduksi } from "../service/Api";

const Monitoring = () => {
  const navigate = useNavigate();
  const { expanded } = useContext(SidebarContext);
  const { user } = useAuth();

  const [qrCode, setQrCode] = useState("");
  const [produksi, setProduksi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  /* ================= AUTH ================= */
  const allowedRoles = ["UNIT_HEAD", "ADMIN"];
  useEffect(() => {
    if (!user) return;

    if (!allowedRoles.includes(user.role)) {
      navigate("/error");
    }
  }, [user, navigate]);

  if (!user || !allowedRoles.includes(user.role)) return null;

  /* ================= FETCH ================= */
  const fetchData = async (code = qrCode) => {
    if (!code) return;
    try {
      setLoading(true);
      setError(null);
      setProduksi(null);

      const res = await GetProduksiAndLogMesinByIdProduksi(code);
      setProduksi(res.data[0]);
    } catch {
      setError("Data produksi dengan QR Code tersebut tidak ditemukan");
    } finally {
      setLoading(false);
    }
  };

  /* ================= QR IMAGE UPLOAD ================= */
  const handleUploadQR = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const qr = jsQR(imageData.data, imageData.width, imageData.height);

        if (qr) {
          setQrCode(qr.data);
          fetchData(qr.data);
        } else {
          setError("QR Code tidak terbaca, pastikan gambar jelas");
        }
      };
    };

    reader.readAsDataURL(file);
  };

  console.log(produksi);

  /* ================= UI ================= */
  return (
    <div className="w-full bg-[#0a0e17] min-h-screen">
      <MenuSlideBar />

      <div
        className={`px-6 py-6 transition-all duration-300
        ${expanded ? "sm:ml-72" : "ml-20"}`}
      >
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between mb-6 no-print">
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">
              Monitoring Produksi
            </h1>
            <p className="text-sm text-slate-400">
              Pemeriksaan detail produksi & log mesin
            </p>
          </div>
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
              🖨️ Cetak Monitoring
            </button>
          )}
        </div>

        {/* ================= INPUT QR ================= */}
        <div className="bg-[#121826] rounded-xl p-5 border border-slate-800 mb-6 no-print">
          <label className="text-sm text-slate-300 mb-2 block">
            QR Code Produksi
          </label>

          <div className="flex flex-wrap gap-3">
            {/* Manual Input */}
            <div className="relative flex-1 min-w-[240px]">
              <QrCode
                className="absolute left-3 top-3 text-slate-400"
                size={18}
              />
              <input
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                placeholder="Masukkan kode atau upload QR"
                className="w-full bg-[#0a0e17] border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Upload QR */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUploadQR}
              hidden
            />

            <button
              onClick={() => fileInputRef.current.click()}
              className="flex  cursor-pointer items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600"
            >
              <Upload size={16} />
              Upload QR
            </button>

            <button
              onClick={() => fetchData()}
              className="px-6 cursor-pointer py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
            >
              Cari
            </button>
          </div>
        </div>

        {/* ================= STATUS ================= */}
        {loading && <p className="text-slate-400 text-sm">Mengambil data...</p>}
        {error && (
          <p className="text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle size={16} /> {error}
          </p>
        )}

        {/* ================= DATA PRODUKSI ================= */}
        {produksi && (
          <div id="print-area" className="space-y-6">
            {/* DATA PRODUKSI */}
            <section className="bg-[#121826] rounded-xl p-6 border border-slate-800 space-y-6">
              {/* ================= HEADER ================= */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <Factory size={18} />
                    Data Produksi
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Informasi utama dan status produksi
                  </p>
                </div>

                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide
      ${
        produksi.konfrmasi
          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
          : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
      }`}
                >
                  {produksi.konfrmasi
                    ? "PRODUKSI TERVERIFIKASI"
                    : "BELUM DIVERIFIKASI"}
                </span>
              </div>

              {/* ================= PRIMARY INFO ================= */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
                <Info label="Nama Produksi" value={produksi.name} />
                <Info label="Produk" value={produksi.produk?.name} />
                <Info label="Shift" value={produksi.shift?.shift} />
                <Info label="Line Produksi" value={produksi.line?.name} />
                <Info
                  label="Tanggal Produksi"
                  value={
                    produksi?.createdAt
                      ? new Date(produksi.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "long",
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "-"
                  }
                />

                <Info label="Unit Head" value={produksi.unitHead || "-"} />
                <Info label="Ketua Regu" value={produksi.user.name || "-"} />
              </div>

              {/* ================= KPI ================= */}
              <div className="grid grid-cols-3 gap-4">
                <KPI
                  title="Hasil Produksi"
                  value={`${produksi.hasil} pcs`}
                  color="emerald"
                />
                <KPI
                  title="Barang Reject"
                  value={`${produksi.reject} pcs`}
                  color="red"
                />
                <KPI
                  title="Target Produksi"
                  value={`${produksi.target} pcs`}
                  color="blue"
                />
              </div>

              {/* ================= CATATAN ================= */}
              <div>
                <p className="text-xs text-slate-400 mb-1">Catatan Produksi</p>
                <div className="p-4 rounded-lg border border-slate-700 bg-[#0a0e17] text-sm text-slate-200">
                  {produksi.catatan || "Tidak ada catatan"}
                </div>
              </div>
            </section>

            {/* DATA LOG MESIN */}
            <section className="bg-[#121826] rounded-xl p-6 border border-slate-800">
              <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <ClipboardList size={18} /> Data Log Mesin
              </h2>

              {produksi.monitoring_mesin.map((log, idx) => (
                <div
                  key={log.id}
                  className="border border-slate-700 rounded-xl p-5 mb-5 bg-[#0a0e17]"
                >
                  <div className="flex justify-between mb-4">
                    <h3 className="font-semibold text-slate-100">
                      Mesin #{idx + 1} — {log.mesin?.name} -{" "}
                      {new Date(log.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                        timeZone: "Asia/Jakarta",
                      })}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        log.status === "SEDANG"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm mb-4">
                    <Info label="Kondisi Mesin" value={log.status} />
                    <Info label="Nama Operator" value={log.user.name} />
                    <Info label="Jenis Kerusakan" value={log.jenisKerusakan} />
                    <Info label="Downtime (menit)" value={log.downtime} />
                    <Info
                      label="Kerusakan Lainnya"
                      value={log.kerusakan_lainnya || "-"}
                    />
                    <Info
                      label="Jam Normal"
                      value={
                        log?.jamNormal
                          ? new Date(log.jamNormal).toLocaleTimeString(
                              "id-ID",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: false,
                                timeZone: "Asia/Jakarta",
                              }
                            )
                          : "-"
                      }
                    />
                  </div>
                  {log?.status !== "NORMAL" && (
                    <>
                      <Note
                        title="Penyebab Kerusakan"
                        value={log.PenyebabKerusakan}
                      />
                      <Note
                        title="Tindakan Perbaikan"
                        value={log.TindakanPerbaikan}
                      />
                      <Note title="Spare Part Diganti" value={log.SparePart} />
                    </>
                  )}

                  <Note title="Catatan Operator" value={log.catatan} />
                  <Note
                    title="Catatan Akhir Mesin"
                    value={log.catatanAkhir}
                    success={log.statusAkhir}
                  />

                  <div className="mt-4">
                    <p className="text-xs text-slate-400 mb-2 flex items-center gap-2">
                      <ImageIcon size={14} /> Dokumentasi Kerusakan
                    </p>
                    {log.gambar.length > 0 ? (
                      <div className="grid grid-cols-4 gap-3">
                        {log.gambar.map((g, i) => (
                          <img
                            key={i}
                            src={`http://localhost:3000${g.url}`}
                            alt="Dokumentasi"
                            className="rounded-lg border border-slate-700"
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm">Tidak ada gambar</p>
                    )}
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= HELPER ================= */
const Info = ({ label, value, highlight }) => (
  <div>
    <p className="text-xs text-slate-400">{label}</p>
    <p
      className={`font-medium ${
        highlight ? "text-emerald-400" : "text-slate-100"
      }`}
    >
      {value}
    </p>
  </div>
);

const Note = ({ title, value, success }) => (
  <div className="mb-3">
    <p className="text-xs text-slate-400 mb-1">{title}</p>
    <div
      className={`p-3 rounded-lg text-sm border
      ${
        success === undefined
          ? "border-slate-700 bg-[#121826]"
          : success
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
          : "border-red-500/40 bg-red-500/10 text-red-300"
      }`}
    >
      {value || "-"}
    </div>
  </div>
);

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

export default Monitoring;
