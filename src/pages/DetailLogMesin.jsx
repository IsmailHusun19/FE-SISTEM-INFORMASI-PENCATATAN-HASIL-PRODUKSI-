import React, { useContext, useState, useEffect } from "react";
import { useAuth } from "../component/AuthContext";
import MenuSlideBar from "../component/MenuSlidebar";
import { SidebarContext } from "../component/SidebarContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import {
  GetProduksiById,
  GetLogMesinByIdProduksi,
  EditDataAkhirLogMesin,
  DeleteDataLogMesin,
  EditDataMesin,
} from "../service/Api";
import { Edit2, CheckCircle, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const DetailLogMesin = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { expanded } = useContext(SidebarContext);
  const { user } = useAuth();
  const [produksi, setProduksi] = useState([]);
  const [mesin, setMesin] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMesin, setSelectedMesin] = useState(null);
  const [downtime, setDowntime] = useState("");
  const [catatanAkhir, setCatatanAkhir] = useState("");
  const [tindakanPerbaikan, setTindakanPerbaikan] = useState("");
  const [peyebabKerusakan, setPeyebabKerusakan] = useState("");
  const [sparePart, setSparePart] = useState("");

  const getData = async () => {
    try {
      const produksi = await GetProduksiById(id);
      const logMesin = await GetLogMesinByIdProduksi(id);
      setProduksi(produksi.data);
      const monitoringMesin = logMesin?.data?.monitoring_mesin;
      if (!Array.isArray(monitoringMesin) || monitoringMesin.length === 0) {
        navigate("/log-mesin");
        return;
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

  useEffect(() => {
    if (!user) return;

    if (user.role !== "OPERATOR_PRODUKSI") {
      navigate("/error");
    }
  }, [user, navigate]);

  if (!user || user.role !== "OPERATOR_PRODUKSI") {
    return null;
  }

  const formatTanggalIndo = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleOpenModal = (item) => {
    setSelectedMesin(item);
    setDowntime(item?.downtime ?? "");
    setCatatanAkhir(item?.catatanAkhir ?? "");
    setTindakanPerbaikan(item?.tindakanPerbaikan ?? "")
    setPeyebabKerusakan(item?.peyebabKerusaka ?? "")
    setSparePart(item?.sparePart ?? "")

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedMesin(null);
    setDowntime("");
    setCatatanAkhir("");
    setTindakanPerbaikan("")
    setPeyebabKerusakan("")
    setSparePart("")
    getData();
  };

  console.log(mesin);

  const handleSendKonfirmasiAkhir = async () => {
    const data = {
      statusAkhir: true,
      downtime: downtime,
      catatanAkhir: catatanAkhir,
      tindakanPerbaikan: tindakanPerbaikan,
      sparePart: sparePart,
      penyebabKerusakan: peyebabKerusakan,
    };
    try {
      const res = await EditDataAkhirLogMesin(data, selectedMesin.id);
      const mesin = await EditDataMesin(
        { kondisi: false },
        selectedMesin.mesinId
      );
      if (res.status === 200) {
        toast.success("berhasil mengkonfirmasi kondisi mesin", {
          position: "top-right",
          description: `data telah tersimpan`,
        });
        return handleCloseModal();
      }

      console.log(res);
    } catch (error) {
      console.error("Gagal mengambil data line:", error);
    }
  };

  const handleDelete = async (idMonitoringMesin, idMesin) => {
    if (!idMonitoringMesin) return;
    toast.warning("Yakin ingin menghapus data ini?", {
      description: "Tindakan ini tidak dapat dibatalkan",
      position: "top-center",
      duration: Infinity,
      action: {
        label: "Hapus",
        onClick: async () => {
          const loadingToast = toast.loading("Menghapus data...");

          try {
            await DeleteDataLogMesin(idMonitoringMesin);
            const kondisi = {
              kondisi: false,
            };
            await EditDataMesin(kondisi, idMesin);
            toast.success("Data berhasil dihapus", {
              position: "top-right",
              id: loadingToast,
            });
            getData();
          } catch (error) {
            toast.error("Gagal menghapus data", {
              id: loadingToast,
              description:
                error?.response?.data?.message || "Terjadi kesalahan sistem",
            });
          }
        },
      },
      cancel: {
        label: "Batal",
      },
    });
  };

  const handleEdit = (id) => {
    navigate(`/edit/log-mesin/${id}`);
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
                      {/* Tampilkan hanya jika status BUKAN NORMAL */}
                      {item?.status !== "NORMAL" && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-2">
                              Penyebab Kerusakan
                            </h4>
                            <div className="rounded-lg bg-gray-800/60 border border-gray-700 p-4 text-sm text-gray-200">
                              {item?.PenyebabKerusakan || "-"}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-2">
                              Tindakan Perbaikan
                            </h4>
                            <div className="rounded-lg bg-gray-800/60 border border-gray-700 p-4 text-sm text-gray-200">
                              {item?.TindakanPerbaikan || "-"}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-2">
                              Spare Part di Ganti
                            </h4>
                            <div className="rounded-lg bg-gray-800/60 border border-gray-700 p-4 text-sm text-gray-200">
                              {item?.SparePart || "-"}
                            </div>
                          </div>
                        </div>
                      )}

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
                        {!produksi?.konfrmasi && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleDelete(item.id, item.mesinId)
                              }
                              className="h-10 cursor-pointer px-4 flex items-center gap-2 text-sm font-semibold
        text-red-200 bg-red-800
        border border-red-700 rounded-xl
        hover:bg-red-700 hover:shadow-sm
        transition duration-200"
                            >
                              <Trash2 size={16} /> Hapus
                            </button>

                            <button
                              onClick={() => handleEdit(item.id)}
                              className="h-10 cursor-pointer px-4 flex items-center gap-2 text-sm font-semibold
        text-gray-200 bg-slate-800
        border border-slate-700 rounded-xl
        hover:bg-slate-700 hover:shadow-sm
        transition duration-200"
                            >
                              <Edit2 size={16} /> Edit
                            </button>

                            {!item?.statusAkhir && (
                              <button
                                onClick={() => handleOpenModal(item)}
                                className="h-10 cursor-pointer px-4 flex items-center gap-2 text-sm font-semibold
          text-green-200 bg-green-800
          border border-green-700 rounded-xl
          hover:bg-green-700 hover:shadow-sm
          transition duration-200"
                              >
                                <CheckCircle size={16} /> Konfirmasi Mesin
                                Normal
                              </button>
                            )}
                          </div>
                        )}
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
      {openModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
            <h3 className="text-lg font-semibold text-gray-200">
              Konfirmasi Kondisi Mesin Sudah Normal
            </h3>

            <div className="space-y-4">
              {/* Downtime */}
              <div>
                <label className="text-sm text-gray-400">
                  Downtime (menit)
                </label>
                <input
                  type="number"
                  value={downtime}
                  onChange={(e) => setDowntime(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">
                  Penyebab Kerusakan
                </label>
                <textarea
                  value={peyebabKerusakan}
                  onChange={(e) => setPeyebabKerusakan(e.target.value)}
                  rows={1}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">
                  Tindakan Perbaikan
                </label>
                <textarea
                  value={tindakanPerbaikan}
                  onChange={(e) => setTindakanPerbaikan(e.target.value)}
                  rows={1}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">
                  Spare Part di Ganti
                </label>
                <textarea
                  value={sparePart}
                  onChange={(e) => setSparePart(e.target.value)}
                  rows={1}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Catatan Akhir */}
              <div>
                <label className="text-sm text-gray-400">Catatan Akhir</label>
                <textarea
                  value={catatanAkhir}
                  onChange={(e) => setCatatanAkhir(e.target.value)}
                  rows={2}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleCloseModal}
                className="px-4 cursor-pointer  py-2 rounded-lg text-sm bg-gray-700 hover:bg-gray-600"
              >
                Batal
              </button>

              <button
                onClick={() => handleSendKonfirmasiAkhir()}
                className="px-4 cursor-pointer py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-500"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailLogMesin;
