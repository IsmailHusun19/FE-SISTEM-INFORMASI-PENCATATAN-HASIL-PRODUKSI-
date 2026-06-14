import React, { useContext, useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import MenuSlideBar from "../component/MenuSlidebar";
import { SidebarContext } from "../component/SidebarContextProvider";
import { EditDataProduct, GetProductById } from "../service/Api";
import { toast } from "sonner";
import { useAuth } from "../component/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { expanded } = useContext(SidebarContext);
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    deskripsi: "",
  });

  const getData = async () => {
    try {
      const product = await GetProductById(id);
      setForm({
        name: product.data.name,
        deskripsi: product.data.deskripsi,
      });
    } catch (error) {
      console.error("Gagal mengambil data product:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!user) return;

    if (user.role !== "ADMIN") {
      navigate("/error");
    }
  }, [user, navigate]);

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const editData = async (data) => {
    try {
      const res = await EditDataProduct(data, id);
      console.log(res);

      if (res.status === 200) {
        toast.success("Product berhasil diedit", {
          position: "top-right",
          description: `${data.name} telah tersimpan`,
        });
        return navigate("/produk");
      }

      if (res.status === 400) {
        toast.error("Gagal edit Product", {
          position: "top-right",
          description: "Nama product sudah digunakan product lain",
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
    };
    editData(data);
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
                  Edit Product
                </h1>
                <p className="text-sm text-gray-400">
                  Form edit Product
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
            <form onSubmit={handleSubmit} className="rounded-lg">
              {/* Nama */}
              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-300">
                  Nama Product
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 text-gray-200
              border border-gray-500 rounded
              focus:outline-none focus:border-slate-400"
                  placeholder="Masukkan nama product"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-300">
                  Deskripsi
                </label>
                <textarea
                  type="text"
                  rows={4}
                  name="deskripsi"
                  value={form.deskripsi}
                  onChange={handleChange}
                  required
                  className="w-full px-3 text-gray-200
              border border-gray-500 rounded
              focus:outline-none focus:border-slate-400"
              placeholder="Masukkan deskripsi produk"
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

export default EditProduct;
