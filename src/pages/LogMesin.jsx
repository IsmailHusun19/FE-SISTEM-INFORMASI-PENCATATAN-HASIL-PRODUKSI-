import MenuSlideBar from "../component/MenuSlidebar";
import { SidebarContext } from "../component/SidebarContextProvider";
import React, { useContext, useState, useEffect } from "react";
import { GetAllLogMesin, DeleteDataLogMesin } from "../service/Api";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../component/AuthContext";

const LogMesin = () => {
  const navigate = useNavigate();
  const { expanded } = useContext(SidebarContext);
  const { user } = useAuth();
  const [mesin, setMesin] = useState([]);
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const getData = async () => {
    try {
      const logMesin = await GetAllLogMesin();
      setMesin(logMesin.data);
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

    if (user.role !== "OPERATOR_PRODUKSI") {
      navigate("/error");
    }
  }, [user, navigate]);

  if (!user || user.role !== "OPERATOR_PRODUKSI") {
    return null;
  }

  const handleAdd = () => {
    navigate("/tambah/log-mesin");
  };
  const handleEdit = (id) => {
    navigate(`/edit/log-mesin/${id}`);
  };

  const handleDetail = (id) => {
    navigate(`/detail/log-mesin/${id}`);
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
            await DeleteDataLogMesin(id);

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

const searched = mesin.filter((user) =>
  user.produksi.name.toLowerCase().includes(search.toLowerCase())
);

const uniqueProduksiMap = {};
const uniqueProduksi = searched.filter((item) => {
  if (!uniqueProduksiMap[item.produksi.name]) {
    uniqueProduksiMap[item.produksi.name] = true;
    return true;
  }
  return false;
});

const totalItems = uniqueProduksi.length;
const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
const endIndex = startIndex + ITEMS_PER_PAGE;
const currentproduksi = uniqueProduksi.slice(startIndex, endIndex);

useEffect(() => {
  setCurrentPage(1);
}, [search]);

console.log(currentproduksi)


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
                  Log Mesin
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
                      placeholder="Search for log mesin..."
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
                      <p className="text-sm font-bold text-grey-200">Line</p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">Shift</p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">Tanggal</p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">
                        Status Validasi
                      </p>
                    </th>
                    <th className="p-4 border-b border-slate-500 bg-gray-900">
                      <p className="text-sm font-bold text-grey-200">Aksi</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentproduksi.length > 0 ? (
                    currentproduksi
                      .filter(
                        (item, index, self) =>
                          index ===
                          self.findIndex(
                            (t) => t.produksi.name === item.produksi.name
                          )
                      ) // hanya produksi unik
                      .map((item, index) => (
                        <tr
                          key={item.id}
                          className="border-b border-gray-600"
                        >
                          <td className="p-4 py-5">{index + 1}</td>
                          <td className="p-4 py-5">{item.produksi.name}</td>
                          <td className="p-4 py-5">
                            {item.produksi.line.name}
                          </td>
                          <td className="p-4 py-5">
                            {item.produksi.shift.shift}
                          </td>
                          <td className="p-4 py-5">
                            {new Date(item.createdAt).toLocaleString("id-ID", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: false,
                            })}
                          </td>
                          <td className="p-4 py-5">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                item.produksi.konfrmasi
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {item.produksi.konfrmasi
                                ? "Tervalidasi"
                                : "Pending"}
                            </span>
                          </td>
                          <td className="p-4 py-5">
                            <div className="flex items-center gap-3">
                              <button
                                title="View"
                                className="text-gray-300 hover:text-gray-200 cursor-pointer"
                                onClick={() => handleDetail(item.idProduksi)}
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                title="Hapus"
                                className="text-gray-300 hover:text-gray-200 cursor-pointer"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan={10}
                        className="p-4 text-center text-grey-400"
                      >
                        {search
                          ? "Data tidak ditemukan"
                          : "Data log mesin belum tersedia"}
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

export default LogMesin;
