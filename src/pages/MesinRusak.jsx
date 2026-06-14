import MenuSlideBar from "../component/MenuSlidebar";
import { SidebarContext } from "../component/SidebarContextProvider";
import React, { useContext, useState, useEffect } from "react";
import { GetProduksiMesinRusak } from "../service/Api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../component/AuthContext";

const MesinRusak = () => {
  const navigate = useNavigate();
  const { expanded } = useContext(SidebarContext);
  const { user } = useAuth();
  const [produksi, setProduksi] = useState([]);
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    shift: "",
    lineId: "",
    produkId: "",
  });

  const getData = async () => {
    try {
      const produksi = await GetProduksiMesinRusak();
      setProduksi(produksi.data);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
      setProduksi([]);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
                  Produksi Terdapat Mesin Masih Rusak
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
                      <p className="text-sm font-bold text-grey-200">Mesin</p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">
                        Kondisi Mesin
                      </p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">Tanggal</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentproduksi.length > 0 ? (
                    currentproduksi.map((user, index) => (
                      <tr
                        key={user.id}
                        onClick={() => navigate(`/detail-laporan/${user.id}`)}
                        className="hover:bg-gray-900 cursor-pointer border-b border-gray-600 w-[50px]"
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
                            {user.monitoring_mesin[0].mesin.name}
                          </p>
                        </td>
                        <td className="p-4 py-5 max-w-[350px]">
  {user.monitoring_mesin?.some((m) => m.mesin?.kondisi) ? (
    <p className="text-sm text-red-500 font-semibold">Rusak</p>
  ) : (
    <p className="text-sm text-green-500 font-semibold">Normal</p>
  )}
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
                      <td
                        colSpan={12}
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
    </div>
  );
};

export default MesinRusak;
