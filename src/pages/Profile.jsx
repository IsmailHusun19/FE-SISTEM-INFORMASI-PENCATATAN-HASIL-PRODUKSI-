import React, { useContext, useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import MenuSlideBar from "../component/MenuSlidebar";
import { SidebarContext } from "../component/SidebarContextProvider";
import { EditMe } from "../service/Api";
import { toast } from "sonner";
import { useAuth } from "../component/AuthContext";

const Profile = () => {
  const { expanded } = useContext(SidebarContext);
  const { user } = useAuth();
  const [form, setForm] = useState({
    nik:user.nik,
    name: user.name || "",
    email: user.email || "",
    password: "",
    avatar: null,
  });

  const [preview, setPreview] = useState(
    user?.avatar
      ? `http://localhost:3000/${user.avatar}`
      : "https://readymadeui.com/profile_6.webp"
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, avatar: file });
      setPreview(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const onSubmit = async (data) => {
    try {
      const res = await EditMe(data);
      console.log(data);

      if (res.status === 200) {
        toast.success("Berhasil mengubah profile", {
          position: "top-right",
          description: "Data telah tersimpan",
        });

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }

      if (res.status === 400) {
        toast.error("Gagalmengubah profile", {
          position: "top-right",
          description: "Email sudah terdaftar",
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
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    if (form.password) formData.append("password", form.password);
    if (form.avatar) formData.append("avatar", form.avatar);
    onSubmit(formData);
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
                <h1 className="text-xl font-semibold text-gray-100">Profile</h1>
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
            <form onSubmit={handleSubmit} className="rounded-lg space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <img
                  src={preview}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full shrink-0 object-cover object-center border border-gray-500"
                />
                <div className="w-full">
                  <label
                    htmlFor="file_input"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Upload file
                  </label>
                  <input
                    id="file_input"
                    type="file"
                    name="avatar"
                    accept="image/*"
                    className="cursor-pointer file-input bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand block w-full shadow-xs placeholder:text-body"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Nama */}
              <div>
                <label className="block text-sm mb-1 text-gray-300">
                  NIK
                </label>
                <input
                  name="nik"
                  value={form.nik}
                  required
                  readonly
                  className="w-full h-10 px-3 text-gray-200 border border-gray-500 rounded focus:outline-none focus:border-slate-400"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-300">
                  Nama Lengkap
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 text-gray-200 border border-gray-500 rounded focus:outline-none focus:border-slate-400"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm mb-1 text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 text-gray-200 border border-gray-500 rounded focus:outline-none focus:border-slate-400"
                  placeholder="example@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm mb-1 text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Kosongkan jika tidak ingin mengubah"
                  className="w-full h-10 px-3 text-gray-200 border border-gray-500 rounded focus:outline-none focus:border-slate-400"
                />
              </div>

              {/* Action */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-4 cursor-pointer py-2 text-sm text-gray-300 bg-slate-700 border border-gray-500 rounded hover:bg-slate-600 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 cursor-pointer flex items-center gap-2 text-sm font-semibold text-blue-300 bg-slate-900 border border-blue-700 rounded hover:bg-slate-800 transition"
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

export default Profile;
