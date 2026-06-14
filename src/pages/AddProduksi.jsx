import React, { useContext, useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import MenuSlideBar from "../component/MenuSlidebar";
import { SidebarContext } from "../component/SidebarContextProvider";
import {
  AddDataProduksi,
  GetAllLine,
  GetAllProduct,
  GetAllShift,
} from "../service/Api";
import { toast } from "sonner";
import { useAuth } from "../component/AuthContext";
import { useNavigate } from "react-router-dom";

const AddProduksi = () => {
  const navigate = useNavigate();
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
    target: ""
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
      const product = await GetAllProduct();
      const line = await GetAllLine();
      const shift = await GetAllShift();
      setProduk(product.data);
      setLine(line.data);
      setShift(shift.data);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (form.produkId) {
      const selectedProduk = produk.find(p => p.id === Number(form.produkId));
      if (selectedProduk) {
        const randomLetters = () => {
          let result = "";
          const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          for (let i = 0; i < 4; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
          }
          return result;
        };
      
        const generatedName = `${selectedProduk.name} -#${randomLetters()}`;
      
        setForm(prev => ({
          ...prev,
          name: generatedName
        }));
      }
      
    }
  }, [form.produkId, produk]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addData = async (data) => {
    try {
      const res = await AddDataProduksi(data);
      if (res.status === 201) {
        toast.success("Produksi berhasil ditambahkan", {
          position: "top-right",
          description: `${data.name} telah tersimpan`,
        });
        return navigate("/produksi");
      }

      if (res.status === 400) {
        toast.error("Gagal menambahkan produksi", {
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
                  Tambah Produksi
                </h1>
                <p className="text-sm text-gray-400">
                  Form menambahkan produksi baru
                </p>
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
              placeholder="Masukkan target produksi (pcs)"
                />
              </div>
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

export default AddProduksi;
