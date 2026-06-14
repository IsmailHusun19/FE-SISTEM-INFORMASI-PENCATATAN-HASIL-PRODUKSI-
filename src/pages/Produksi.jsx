import MenuSlideBar from "../component/MenuSlidebar";
import { SidebarContext } from "../component/SidebarContextProvider";
import React, { useContext, useState, useEffect } from "react";
import {
  GetAllProduksi,
  DeleteProduksi,
  EditDataProduksi,
} from "../service/Api";
import {
  Eye,
  Pencil,
  Trash2,
  Plus,
  Funnel,
  CheckCircle,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../component/AuthContext";
import FilterData from "../component/FilterData";
import DownloadQRCode from "../component/DownloadQRCode";

const Produksi = () => {
  const navigate = useNavigate();
  const { expanded } = useContext(SidebarContext);
  const { user } = useAuth();
  const [produksi, setProduksi] = useState([]);
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [openSelesai, setOpenSelesai] = useState(false);
  const [selectedProduksi, setSelectedProduksi] = useState(null);
  const [formSelesai, setFormSelesai] = useState({
    hasil: "",
    reject: "",
    catatan: "",
  });
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    shift: "",
    lineId: "",
    produkId: "",
    sortHasil: "",
    sortReject: "",
  });

  const handleApplyFilter = (newFilters) => {
    setFilters(newFilters);
    setOpenFilter(false);
  };

  const getData = async () => {
    try {
      const produksi = await GetAllProduksi();
      setProduksi(produksi.data);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
      setProduksi([]);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!user) return;

    if (user.role !== "KETUA_REGU") {
      navigate("/error");
    }
  }, [user, navigate]);

  if (!user || user.role !== "KETUA_REGU") {
    return null;
  }

  const handleAdd = () => {
    navigate("/tambah/produksi");
  };
  const handleEdit = (id) => {
    navigate(`/edit/produksi/${id}`);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    toast.warning("Yakin ingin menghapus data ini?", {
      description: "Tindakan ini tidak dapat dibatalkan",
      position: "top-center",
      duration: Infinity,
      action: {
        label: "Hapus",
        onClick: async () => {
          const loadingToast = toast.loading("Menghapus data...");

          try {
            await DeleteProduksi(id);

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

  const handleSubmitSelesai = async () => {
    if (!formSelesai.hasil) {
      toast.error("Hasil produksi wajib diisi");
      return;
    }
    try {
      await EditDataProduksi(
        {
          hasil: Number(formSelesai.hasil),
          reject: Number(formSelesai.reject || 0),
          catatan: formSelesai.catatan,
        },
        Number(selectedProduksi.id)
      );

      toast.success("Produksi diselesaikan", {
        position: "top-right",
        description: `telah tersimpan`,
      });
      setOpenSelesai(false);
      getData();
    } catch (err) {
      toast.error("Gagal menyelesaikan produksi", {
        id: loading,
        description: err?.response?.data?.message,
      });
    }
  };

  const filteredProduksi = produksi.filter((item) => {
    // 🔍 Search nama produksi
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    // 🔁 Shift
    if (filters.shift && item.shift.id !== Number(filters.shift)) {
      return false;
    }

    // 🏭 Line
    if (filters.lineId && item.line.id !== Number(filters.lineId)) {
      return false;
    }

    // 📦 Produk
    if (filters.produkId && item.produk.id !== Number(filters.produkId)) {
      return false;
    }

    // 📅 Tanggal
    if (filters.startDate || filters.endDate) {
      const createdAt = new Date(item.createdAt);

      if (filters.startDate) {
        const start = new Date(filters.startDate);
        if (createdAt < start) return false;
      }

      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999); // full day
        if (createdAt > end) return false;
      }
    }

    return true;
  });

  const sortedProduksi = [...filteredProduksi].sort((a, b) => {
    // 1️⃣ Sort HASIL dulu
    if (filters.sortHasil === "highest" && a.hasil !== b.hasil) {
      return b.hasil - a.hasil;
    }

    if (filters.sortHasil === "lowest" && a.hasil !== b.hasil) {
      return a.hasil - b.hasil;
    }

    // 2️⃣ Kalau hasil sama, sort REJECT
    if (filters.sortReject === "highest") {
      return b.reject - a.reject;
    }

    if (filters.sortReject === "lowest") {
      return a.reject - b.reject;
    }

    return 0;
  });

  const totalItems = sortedProduksi.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentproduksi = sortedProduksi.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters]);

  const handleResetFilter = () => {
    setFilters({
      startDate: "",
      endDate: "",
      shift: "",
      lineId: "",
      produkId: "",
      sortHasil: "",
      sortReject: "",
    });
    setOpenFilter(false);
  };

  return (
    <div className="w-full relative overflow-x-hidden bg-gray-950">
      <MenuSlideBar />
      <div className="h-[calc(100vh-85px)]">
        <div
          className={`grid gap-3 mt-5 px-4 mr-5 transition-all duration-300
    ${expanded ? "sm:ml-72" : "ml-20"}
    grid-cols-1 sm:[grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]
  `}
        >
          <div>
            <div className="w-full flex justify-between items-center mb-3 mt-1 pl-3">
              <div>
                <h3 className="text-lg font-semibold text-grey-200">
                  Produksi
                </h3>
              </div>
              <div className="ml-3 flex items-center gap-2">
                {/* Search */}
                <div className="w-full max-w-sm min-w-[300px] relative">
                  <div className="relative">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="bg-transparent w-full pr-11 h-10 pl-3 py-2 placeholder:text-gray-500 text-gray-200 text-sm border border-gray-200 rounded transition duration-200 ease focus:outline-none focus:border-gray-400 hover:border-gray-400 shadow-sm focus:shadow-md"
                      placeholder="Search for produksi..."
                    />
                    <div className="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-transparent rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                        className="w-8 h-8 text-slate-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOpenFilter(true)}
                  className="
  h-10 px-4 flex items-center gap-2 text-sm font-semibold
  text-blue-300 bg-slate-800
  border border-slate-600 rounded
  hover:bg-slate-700 hover:border-slate-500
  transition shadow-sm cursor-pointer
"
                >
                  <Funnel /> Filter
                </button>
                {openFilter && (
                  <FilterData
                    currentproduksi={currentproduksi}
                    onClose={() => setOpenFilter(false)}
                    onApply={handleApplyFilter}
                    filters={filters}
                    onReset={handleResetFilter}
                  />
                )}
                <button
                  onClick={handleAdd}
                  className="
    h-10 px-4 flex items-center gap-2 text-sm font-semibold
    text-blue-300 bg-slate-800
    border border-slate-600 rounded
    hover:bg-slate-700 hover:border-slate-500
    transition shadow-sm cursor-pointer
  "
                >
                  <Plus size={18} />
                  Tambah
                </button>
              </div>
            </div>
            <div className="relative flex flex-col w-full overflow-x-scroll text-gray-200 bg-gray-950 shadow-md rounded-lg bg-clip-border">
              <table className="w-full text-left table-auto min-w-max">
                <thead>
                  <tr>
                    <th className="p-4 w-[50px] border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">No</p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">
                        Nama Produksi
                      </p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">
                        Nama Produk
                      </p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">Line</p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">Shift</p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">Hasil</p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">Reject</p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">Target</p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">
                        Persentase
                      </p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">Catatan</p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">Tanggal</p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">Status</p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">
                        Konfirmasi Selesai
                      </p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">Barcode</p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">Aksi</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentproduksi.length > 0 ? (
                    currentproduksi.map((user, index) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-900 border-b border-gray-600 w-[50px]"
                      >
                        <td className="p-4 py-5">{startIndex + index + 1}</td>

                        <td className="p-4 py-5">
                          <p className="text-sm text-grey-200">{user.name}</p>
                        </td>
                        <td className="p-4 py-5">
                          <p className="text-sm text-grey-200">
                            {user.produk.name}
                          </p>
                        </td>
                        <td className="p-4 py-5">
                          <p className="text-sm text-grey-200">
                            {user.line.name}
                          </p>
                        </td>
                        <td className="p-4 py-5">
                          <p className="text-sm text-grey-200">
                            {user.shift.shift}
                          </p>
                        </td>
                        <td className="p-4 py-5">
                          <p className="text-sm text-grey-200">
                            {user.hasil === 0 ? "-" : user.hasil} pcs
                          </p>
                        </td>
                        <td className="p-4 py-5">
                          <p className="text-sm text-grey-200">
                            {user.hasil === 0 ? "-" : user.reject} pcs
                          </p>
                        </td>
                        <td className="p-4 py-5">
                          <p className="text-sm font-semibold">{user.target} pcs</p>
                        </td>
                        <td className="p-4 py-5">
                          {user.target > 0 && user.hasil > 0 ? (
                            <p
                              className={`text-sm font-semibold ${
                                (user.hasil / user.target) * 100 >= 95
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {Math.round((user.hasil / user.target) * 100)}%
                            </p>
                          ) : (
                            <p className="text-sm text-grey-200">-</p>
                          )}
                        </td>

                        <td className="p-4 py-5">
                          <p className="text-sm text-grey-200 max-w-[350px]">
                            {user.hasil === 0 ? "-" : user.catatan}
                          </p>
                        </td>
                        <td className="p-4 py-5">
                          <p className="text-sm text-grey-200">
                            {new Date(user.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </td>
                        <td className="p-4 text-center">
                          {Number(user.hasil) > 0 ? (
                            <span
                              className="
        inline-flex items-center gap-1
        px-2.5 py-1
        text-xs font-semibold
        text-emerald-400
        bg-emerald-900/30
        border border-emerald-700/40
        rounded-full
        whitespace-nowrap
      "
                            >
                              <CheckCircle size={14} />
                              Produksi Selesai
                            </span>
                          ) : (
                            <button
                              title="Selesaikan Produksi"
                              onClick={() => {
                                setSelectedProduksi(user);
                                setFormSelesai({
                                  hasil: "",
                                  reject: "",
                                  catatan: "",
                                });
                                setOpenSelesai(true);
                              }}
                              className="
        inline-flex items-center justify-center
        h-9 w-9
        text-emerald-600
        border border-emerald-600/40
        rounded-md
        hover:bg-emerald-600 hover:text-white
        transition cursor-pointer
      "
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                        </td>

                        <td className="p-4 py-5">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.konfrmasi
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {user.konfrmasi ? "Tervalidasi" : "Pending"}
                          </span>
                        </td>
                        <td className="p-4 py-5">
                          {user.konfrmasi ? (
                            <DownloadQRCode value={user.qrCode}>
                              <button
                                type="button"
                                className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 16v-8m0 8l-3-3m3 3l3-3M4 20h16"
                                  />
                                </svg>
                                Download QR Code
                              </button>
                            </DownloadQRCode>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300">
                              <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
                              Menunggu proses validasi
                            </span>
                          )}
                        </td>

                        <td className="p-4 py-5">
                          {user.konfrmasi ? null : (
                            <div className="flex items-center gap-3">
                              <button
                                title="Edit"
                                className="text-gray-300 hover:text-gray-200 cursor-pointer"
                                onClick={() => handleEdit(user.id)}
                              >
                                <Pencil size={18} />
                              </button>

                              <button
                                title="Hapus"
                                className="text-gray-300 hover:text-gray-200 cursor-pointer"
                                onClick={() => handleDelete(user.id)}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={14}
                        className="p-4 text-center text-grey-400"
                      >
                        {search
                          ? "Data tidak ditemukan"
                          : "Data produksi belum tersedia"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-gray-700 bg-gray-950">
              <div className="flex justify-between items-center px-4 py-3">
                <div className="text-sm text-grey-200">
                  Showing{" "}
                  <b>
                    {totalItems === 0
                      ? 0
                      : `${startIndex + 1}-${Math.min(endIndex, totalItems)}`}
                  </b>{" "}
                  of {totalItems}
                </div>

                <div className="flex space-x-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 cursor-pointer py-1 min-w-9 min-h-9 text-sm text-grey-200 bg-gray-700 border border-slate-500 rounded hover:bg-gray-800 disabled:opacity-50"
                  >
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 min-w-9 min-h-9 text-sm rounded transition cursor-pointer 
            ${
              currentPage === page
                ? "text-white bg-gray-800 border border-slate-800"
                : "text-grey-200 bg-gray-700 border border-slate-500 hover:bg-gray-800"
            }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 cursor-pointer py-1 min-w-9 min-h-9 text-sm text-grey-200 bg-gray-700 border border-slate-500 rounded hover:bg-gray-800 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openSelesai && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-lg bg-gray-900 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">
              Selesaikan Produksi
            </h3>

            {/* Info Produksi */}
            <div className="mb-4 rounded-md bg-gray-800 p-3">
              <p className="text-sm text-gray-300">
                <span className="text-gray-400">Produksi:</span>{" "}
                <span className="font-semibold text-white">
                  {selectedProduksi.name}
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {selectedProduksi.produk?.name} • Line{" "}
                {selectedProduksi.line?.name} • Shift{" "}
                {selectedProduksi.shift?.shift}
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitSelesai();
              }}
            >
              {/* Hasil */}
              <div className="mb-3">
                <label className="block text-sm text-gray-300 mb-1">
                  Hasil Produksi
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={formSelesai.hasil}
                  placeholder="Masukkan produksi hasil (pcs)"
                  onChange={(e) =>
                    setFormSelesai({ ...formSelesai, hasil: e.target.value })
                  }
                  className="w-full h-10 rounded border border-gray-600 bg-gray-800 px-3 text-white"
                />
              </div>

              {/* Reject */}
              <div className="mb-3">
                <label className="block text-sm text-gray-300 mb-1">
                  Reject
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={formSelesai.reject}
                  placeholder="Masukkan reject hasil (pcs)"
                  onChange={(e) =>
                    setFormSelesai({ ...formSelesai, reject: e.target.value })
                  }
                  className="w-full h-10 rounded border border-gray-600 bg-gray-800 px-3 text-white"
                />
              </div>

              {/* Catatan */}
              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-1">
                  Catatan
                </label>
                <textarea
                  rows={3}
                  required
                  value={formSelesai.catatan}
                  onChange={(e) =>
                    setFormSelesai({ ...formSelesai, catatan: e.target.value })
                  }
                  className="w-full rounded border border-gray-600 bg-gray-800 px-3 py-2 text-white"
                />
              </div>

              {/* ACTION */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpenSelesai(false)}
                  className="px-4 py-2 text-sm text-gray-300
              bg-slate-700 border border-gray-500 rounded
              hover:bg-slate-600 transition cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 flex items-center gap-2
              text-sm font-semibold text-blue-300
              bg-slate-900 border border-blue-700 rounded
              hover:bg-slate-800 transition cursor-pointer"
                >
                  <Save size={16} />
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produksi;
