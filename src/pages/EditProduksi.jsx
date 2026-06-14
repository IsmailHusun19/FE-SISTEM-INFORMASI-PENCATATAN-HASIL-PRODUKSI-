import React, { useContext, useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import MenuSlideBar from "../component/MenuSlidebar";
import { SidebarContext } from "../component/SidebarContextProvider";
import {
  EditDataProduksi,
  GetAllLine,
  GetAllProduct,
  GetAllShift,
  GetProduksiById,
} from "../service/Api";
import { toast } from "sonner";
import { useAuth } from "../component/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const EditProduksi = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { expanded } = useContext(SidebarContext);
  const { user } = useAuth();
  const [produk, setProduk] = useState([]);
  const [line, setLine] = useState([]);
  const [shift, setShift] = useState([]);

  const [form, setForm] = useState({
    name: "",
    catatan: "",
    produkId: "",
    lineId: "",
    shiftId: "",
    hasil: "",
    reject: "",
    target: "",
  });

  useEffect(() => {
    if (!user) return;

    if (user.role !== "KETUA_REGU") {
      navigate("/error");
    }
  }, [user, navigate]);

  if (!user || user.role !== "KETUA_REGU") {
    return null;
  }

  const getData = async () => {
    try {
      const produksi = await GetProduksiById(id);
      if (
        produksi.data.konfrmasi === true ||
        produksi.data.userId !== produksi.data.user.id
      ) {
        navigate("/error");
        return;
      }
      const product = await GetAllProduct();
      const line = await GetAllLine();
      const shift = await GetAllShift();

      setProduk(product.data);
      setLine(line.data);
      setShift(shift.data);
      setForm({
        ...form,
        name: produksi.data.name || "",
        catatan: produksi.data.catatan || "",
        produkId: produksi.data.produkId || "",
        lineId: produksi.data.lineId || "",
        shiftId: produksi.data.shiftId || "",
        hasil: produksi.data.hasil ?? "",
        reject: produksi.data.reject ?? "",
        target: produksi.data.target ?? "",
      });
    } catch (error) {
      console.error("Gagal mengambil data produksi:", error);
      navigate("/error");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addData = async (data) => {
    try {
      const res = await EditDataProduksi(data, id);
      if (res.status === 200) {
        toast.success("Produksi berhasil diedit", {
          position: "top-right",
          description: `${data.name} telah tersimpan`,
        });
        return navigate("/produksi");
      }

      if (res.status === 400) {
        toast.error("Gagal edit produksi", {
          position: "top-right",
          description: "Gagal menambahkan data produksi",
        });
        return null;
      }
    } catch (error) {
      toast.error("Terjadi kesalahan", {
        position: "top-right",
        description: error?.response?.data?.message || "Kesalahan sistem",
      });
      return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      name: form.name,
      produkId: Number(form.produkId),
      lineId: Number(form.lineId),
      shiftId: Number(form.shiftId),
      hasil: Number(form.hasil),
      reject: Number(form.reject),
      target: Number(form.target),
    };
    addData(data);
  };

  return (
    <div className="w-full relative overflow-x-hidden bg-gray-950">
      <MenuSlideBar />
      <div className="h-[calc(100vh-85px)]">
        <div
          className={`grid gap-3 mt-5 px-4 mr-5 transition-all duration-300
  ${expanded ? "sm:ml-72" : "ml-20"}
`}
        >
          <div className="w-full text-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold text-gray-100">
                  Edit Produksi
                </h1>
                <p className="text-sm text-gray-400">Form edit produksi</p>
              </div>

              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-sm text-gray-300
            bg-slate-800 border border-gray-500 rounded px-4 py-2
            hover:bg-slate-700 transition cursor-pointer"
              >
                <ArrowLeft size={16} />
                Kembali
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="rounded-lg">
              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-300">
                  Produk
                </label>
                <select
                  name="produkId"
                  value={form.produkId}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 text-gray-200 bg-gray-950
      border border-gray-500 rounded
      focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  <option value="" disabled>
                    -- Pilih Produk --
                  </option>

                  {produk.map((item) => (
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
              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-300">Line</label>
                <select
                  name="lineId"
                  value={form.lineId}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 text-gray-200 bg-gray-950
      border border-gray-500 rounded 
      focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  <option value="" disabled>
                    -- Pilih Line --
                  </option>

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
              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-300">
                  Shift
                </label>
                <select
                  name="shiftId"
                  value={form.shiftId}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 text-gray-200 bg-gray-950
      border border-gray-500 rounded
      focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  <option value="" disabled>
                    -- Pilih Shift --
                  </option>

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
              {(Number(form.hasil) > 0 || Number(form.reject) > 0) && (
                <div className="mb-4">
                  <label className="block text-sm mb-1 text-gray-300">
                    Hasil
                  </label>
                  <input
                    name="hasil"
                    value={form.hasil}
                    onChange={handleChange}
                    required
                    type="number"
                    className="w-full h-10 px-3 text-gray-200
              border border-gray-500 rounded
              focus:outline-none focus:border-slate-400"
                    placeholder="Masukkan nama hasil produksi"
                  />
                </div>
              )}
              {(Number(form.hasil) > 0 || Number(form.reject) > 0) && (
                <div className="mb-4">
                  <label className="block text-sm mb-1 text-gray-300">
                    Reject
                  </label>
                  <input
                    name="reject"
                    value={form.reject}
                    onChange={handleChange}
                    required
                    type="number"
                    className="w-full h-10 px-3 text-gray-200
              border border-gray-500 rounded
              focus:outline-none focus:border-slate-400"
                    placeholder="Masukkan reject produksi"
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-300">
                  Target
                </label>
                <input
                  name="target"
                  value={form.target}
                  onChange={handleChange}
                  required
                  type="number"
                  className="w-full h-10 px-3 text-gray-200
              border border-gray-500 rounded
              focus:outline-none focus:border-slate-400"
                  placeholder="Masukkan target produksi"
                />
              </div>
              {(Number(form.hasil) > 0 || Number(form.reject) > 0) && (
                <div className="mb-4">
                  <label className="block text-sm mb-1 text-gray-300">
                    Catatan
                  </label>
                  <textarea
                    type="text"
                    rows={4}
                    name="catatan"
                    value={form.catatan}
                    onChange={handleChange}
                    required
                    className="w-full px-3 text-gray-200
              border border-gray-500 rounded
              focus:outline-none focus:border-slate-400"
                    placeholder="Masukkan Catatan produksi"
                  />
                </div>
              )}

              {/* Action */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => window.history.back()}
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
      </div>
    </div>
  );
};

export default EditProduksi;
