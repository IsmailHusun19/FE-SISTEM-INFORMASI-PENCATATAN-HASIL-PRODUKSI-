import React, { useContext, useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import MenuSlideBar from "../component/MenuSlidebar";
import { SidebarContext } from "../component/SidebarContextProvider";
import {
  AddDataLogMesin,
  GetAllProduct,
  GetAllMesin,
  GetAllProduksi,
  EditDataMesin,
} from "../service/Api";
import { toast } from "sonner";
import { useAuth } from "../component/AuthContext";
import { useNavigate } from "react-router-dom";

const AddLogMesin = () => {
  const navigate = useNavigate();
  const { expanded } = useContext(SidebarContext);
  const { user } = useAuth();
  const [produk, setProduk] = useState([]);
  const [produksiAll, setProduksiAll] = useState([]);
  const [produksi, setProduksi] = useState([]);
  const [mesin, setMesin] = useState([]);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    idProduksi: "",
    produkId: "",
    mesinId: "",
    status: "",
    jenisKerusakan: "",
    kerusakan_lainnya: "",
    gambar: "",
    catatan: "",
  });

  const dataStatusMesin = [
    { id: "NORMAL", name: "NORMAL" },
    { id: "SEDANG", name: "SEDANG" },
    { id: "PARAH", name: "PARAH" },
  ];

  const dataJenisKerusakan = [
    { id: "PREVENTIVE_MAINTENANCE", name: "PREVENTIVE MAINTENANCE" },
    { id: "REPAIR",                name: "REPAIR" },
    { id: "SETTING",               name: "SETTING" },
    { id: "TRIAL_PRODUK",          name: "TRIAL PRODUK" },
    { id: "GMP_SAFETY",            name: "GMP/SAFETY" },
    { id: "IMPROVEMENT",           name: "IMPROVEMENT" },
    { id: "PROJECT",               name: "PROJECT" },
    { id: "LAINNYA",               name: "LAINNYA" },
  ];  

  useEffect(() => {
    if (!user) return;

    if (user.role !== "OPERATOR_PRODUKSI") {
      navigate("/error");
    }
  }, [user, navigate]);

  if (!user || user.role !== "OPERATOR_PRODUKSI") {
    return null;
  }

  const getData = async () => {
    try {
      const product = await GetAllProduct();
      const produksi = await GetAllProduksi();
      const mesin = await GetAllMesin();
      setProduk(product.data);
      setMesin(mesin.data);
      setProduksiAll(produksi.data);
      console.log(produksi.data);
      setProduksi([]);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (form.produkId) {
      console.log(form.produkId);
      const filtered = produksiAll.filter(
        (item) =>
          item.produkId === Number(form.produkId) && item.konfrmasi === false
      );
      setProduksi(filtered);
      console.log(filtered);
    } else {
      setProduksi([]);
    }
  }, [form.produkId, produksiAll]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error("Maksimal 5 gambar", { position: "top-right" });
      return;
    }

    setImages((prev) => [...prev, ...files]);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addData = async (data) => {
    try {
      const res = await AddDataLogMesin(data);
      const statusMesin = data.get("status");
      const kondisi = {
        kondisi: statusMesin === "PARAH" || statusMesin === "SEDANG",
      };
      await EditDataMesin(kondisi, data.get("mesinId"));

      if (res.status === 201) {
        toast.success("Produksi berhasil ditambahkan", {
          position: "top-right",
          description: "data telah tersimpan",
        });
        return navigate("/log-mesin");
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
    const data = new FormData();
    data.append("idProduksi", form.idProduksi);
    data.append("mesinId", form.mesinId);
    data.append("status", form.status);
    data.append("jenisKerusakan", form.jenisKerusakan);
    data.append("kerusakan_lainnya", form.kerusakan_lainnya);
    data.append("catatan", form.catatan);
    images.forEach((img, index) => {
      data.append("gambar", img);
    });

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
                  Tambah Log Mesin
                </h1>
                <p className="text-sm text-gray-400">
                  Form menambahkan log mesin baru
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
                <label className="block text-sm mb-1 text-gray-300">
                  Produksi
                </label>
                <select
                  name="idProduksi"
                  value={form.idProduksi}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 text-gray-200 bg-gray-950
      border border-gray-500 rounded
      focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  <option value="" disabled>
                    -- Pilih Produksi --
                  </option>

                  {produksi.length > 0 ? (
                    produksi.map((item) => (
                      <option
                        className="cursor-pointer"
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Produksi belum tersedia
                    </option>
                  )}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-300">
                  Mesin
                </label>
                <select
                  name="mesinId"
                  value={form.mesinId}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 text-gray-200 bg-gray-950
      border border-gray-500 rounded 
      focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  <option value="" disabled>
                    -- Pilih Mesin --
                  </option>

                  {mesin.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      disabled={item.kondisi === true}
                      style={{
                        color: item.kondisi === true ? "red" : "inherit",
                      }}
                    >
                      {item.name}
                      {item.kondisi === true ? " (Mesin Sedang Rusak)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-300">
                  Kondisi Mesin
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 text-gray-200 bg-gray-950
      border border-gray-500 rounded
      focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  <option value="" disabled>
                    -- Pilih Status Mesin --
                  </option>

                  {dataStatusMesin.map((item) => (
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
              {form.status && form.status !== "NORMAL" && (
                <div className="mb-4">
                  <label className="block text-sm mb-1 text-gray-300">
                    Kerusakan
                  </label>
                  <select
                    name="jenisKerusakan"
                    value={form.jenisKerusakan}
                    onChange={handleChange}
                    required
                    className="w-full h-10 px-3 text-gray-200 bg-gray-950
        border border-gray-500 rounded
        focus:outline-none focus:border-slate-400 cursor-pointer"
                  >
                    <option value="" disabled>
                      -- Pilih Kerusakan --
                    </option>

                    {dataJenisKerusakan.map((item) => (
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
              )}
              {form.jenisKerusakan === "LAINNYA" && (
                <div className="mb-4">
                  <label className="block text-sm mb-1 text-gray-300">
                    Keterangan Kerusakan
                  </label>
                  <input
                    name="kerusakan_lainnya"
                    value={form.kerusakan_lainnya}
                    onChange={handleChange}
                    required
                    className="w-full h-10 px-3 text-gray-200
        border border-gray-500 rounded
        focus:outline-none focus:border-slate-400"
                    placeholder="Masukkan keterangan kerusakan lainnya"
                  />
                </div>
              )}
              <div className="mb-4">
                <div className="w-full">
                  <label
                    htmlFor="file_input"
                    className="block mb-2.5 text-sm font-medium text-heading bg-gray-950"
                  >
                    Upload Gambar (maks 5)
                  </label>
                  <input
                    id="file_input"
                    type="file"
                    name="avatar"
                    accept="image/*"
                    className="cursor-pointer bg-transparent file-input bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand block w-full shadow-xs placeholder:text-body"
                    onChange={handleImageChange}
                  />
                </div>

                {/* Preview gambar */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {images.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`preview-${index}`}
                        className="w-20 h-20 object-cover rounded border border-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImages((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

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

export default AddLogMesin;
