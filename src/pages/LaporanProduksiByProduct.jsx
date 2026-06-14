import MenuSlideBar from "../component/MenuSlidebar";
import { SidebarContext } from "../component/SidebarContextProvider";
import React, { useContext, useState, useEffect } from "react";
import {
  GetAllShift,
  GetAllLine,
  GetLaporanCetakAllByProduct,
  GetAllProduksiByProduct,
  GetProductById,
} from "../service/Api";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../component/AuthContext";
import { Print } from "@mui/icons-material";

const LaporanProduksiByProduksi = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { expanded } = useContext(SidebarContext);
  const { user } = useAuth();
  const [Produksi, setProduksi] = useState([]);
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [openPrintModal, setOpenPrintModal] = useState(false);
  const [line, setLine] = useState([]);
  const [product, setProduct] = useState([]);
  const [shift, setShift] = useState([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
    shift: "",
    line: "",
  });

  const getData = async () => {
    try {
      const getProduksi = await GetAllProduksiByProduct(id);
      const getProduct = await GetProductById(id);
      const line = await GetAllLine();
      const shift = await GetAllShift();
      setLine(line.data);
      setShift(shift.data);
      setProduksi(getProduksi.data);
      setProduct(getProduct.data);
      console.log(getProduksi);
    } catch (error) {
      console.error("Gagal mengambil data Produksi :", error);
      setProduksi([]);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  const filteredProduksi = Produksi.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = filteredProduksi.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProduksi = filteredProduksi.slice(startIndex, endIndex);
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleCetakPdf = async () => {
    if (isPrinting) return;

    try {
      setIsPrinting(true);

      const params = {
        startDate: filter.startDate || undefined,
        endDate: filter.endDate || undefined,
        shiftId: filter.shift || undefined,
        lineId: filter.line || undefined,
        mode: "produk",
      };

      console.log("PARAM KIRIM KE BACKEND:", params);

      const blob = await GetLaporanCetakAllByProduct(id, params);

      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );

      window.open(url, "_blank");

      setOpenPrintModal(false);
    } catch (err) {
      alert("Gagal mencetak laporan");
      console.error("Cetak PDF error:", err);
    } finally {
      setIsPrinting(false);
    }
  };

  console.log(product);

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
                  Data Produksi {product.name}
                </h3>
              </div>
              <div className="ml-3 flex items-center gap-2">
                <div className="w-full max-w-sm min-w-[300px] relative">
                  <div className="relative">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="bg-transparent w-full pr-11 h-10 pl-3 py-2 placeholder:text-gray-500 text-gray-200 text-sm border border-gray-200 rounded transition duration-200 ease focus:outline-none focus:border-gray-400 hover:border-gray-400 shadow-sm focus:shadow-md"
                      placeholder="Search for Produksi..."
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
                  onClick={() => setOpenPrintModal(true)}
                  className="
    h-10 w-full px-4 flex items-center gap-2 text-sm font-semibold
    text-blue-300 bg-slate-800
    border border-slate-600 rounded
    hover:bg-slate-700 hover:border-slate-500
    transition shadow-sm cursor-pointer
  "
                >
                  <Print size={18} />
                  Cetak PDF
                </button>
              </div>
            </div>
            <div className="relative flex flex-col w-full h-full overflow-x-scroll text-gray-200 bg-gray-950 shadow-md rounded-lg bg-clip-border">
              <table className="w-full text-left table-auto min-w-max">
                <thead>
                  <tr>
                    <th className="p-4 w-[100px] border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">No</p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">
                        Nama Produksi
                      </p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">Line</p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">Shift</p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">Status</p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">
                        Tanggal Dibuat
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentProduksi.length > 0 ? (
                    currentProduksi.map((user, index) => (
                      <tr
                        onClick={() => navigate(`/detail-laporan/${user.id}`)}
                        key={user.id}
                        className="hover:bg-gray-900 border-b border-gray-600 cursor-pointer"
                      >
                        <td className="p-4 py-5">{startIndex + index + 1}</td>

                        <td className="p-4 py-5">
                          <p className="text-sm text-grey-200">{user.name}</p>
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-grey-400">
                        {search
                          ? "Data tidak ditemukan"
                          : "Data Produksi belum tersedia"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
            {openPrintModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="bg-gray-900 w-full max-w-md rounded-xl shadow-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-200 mb-4">
                    Cetak Laporan Produk
                  </h2>

                  <div className="space-y-4">
                    {/* Rentang Waktu */}
                    <div>
                      <label className="text-sm text-gray-400">
                        Tanggal Mulai
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={filter.startDate}
                        onChange={handleChange}
                        className="w-full mt-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-200"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">
                        Tanggal Akhir
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={filter.endDate}
                        onChange={handleChange}
                        className="w-full mt-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-200"
                      />
                    </div>

                    {/* Shift */}
                    <div>
                      <label className="text-sm text-gray-400">Shift</label>
                      <select
                        name="shift"
                        value={filter.shift}
                        onChange={handleChange}
                        className="w-full mt-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-200"
                      >
                        <option value="">Semua Shift</option>
                        {shift.map((item) => (
                          <option
                            className="cursor-pointer"
                            key={item.id}
                            value={item.id}
                          >
                            {item.shift}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Line */}
                    <div>
                      <label className="text-sm text-gray-400">Line</label>
                      <select
                        name="line"
                        value={filter.line}
                        onChange={handleChange}
                        className="w-full mt-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-gray-200"
                      >
                        <option value="">Semua Line</option>
                        {line.map((item) => (
                          <option
                            className="cursor-pointer"
                            key={item.id}
                            value={item.id}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      onClick={() => setOpenPrintModal(false)}
                      className="px-4 cursor-pointer py-2 text-sm text-gray-300 border border-gray-600 rounded hover:bg-gray-800"
                    >
                      Batal
                    </button>

                    <button
                      onClick={handleCetakPdf}
                      disabled={isPrinting}
                      className={`
    h-10 px-4 flex items-center gap-2 text-sm font-semibold
    border rounded transition shadow-sm
    ${
      isPrinting
        ? "text-gray-400 bg-slate-700 border-slate-600 cursor-not-allowed"
        : "text-blue-300 bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-slate-500 cursor-pointer"
    }
  `}
                    >
                      {isPrinting ? (
                        <>
                          {/* SPINNER */}
                          <svg
                            className="animate-spin h-5 w-5 text-gray-300"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                          <span>Sedang mencetak...</span>
                        </>
                      ) : (
                        <>
                          <Print size={18} />
                          <span>Cetak PDF</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanProduksiByProduksi;
