import React from "react";
import Button from "../component/Button";
import heroImage from "../assets/astor-mayora.jpg";
import Navbar from "../component/navbar";
import Footer from "../component/Footer";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-black text-white overflow-x-hidden">
      <Navbar />
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
          />
        </div>
      </div>
      <section className="h-[calc(100vh-56px)] px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Text */}
        <div>
          <h1 className="text-5xl font-bold leading-tight">
            Kendalikan Produksi Dengan
            <br />
            <span className="text-red-600">Presisi Maksimal.</span>
          </h1>
          <p className="mt-6 text-gray-400 text-lg leading-relaxed">
            Sistem Pencatatan Hasil Produksi Mayora membantu memastikan setiap proses
            berjalan dengan cepat, akurat, dan efisien. Mulai dari jumlah
            output, downtime mesin, hingga tingkat reject — semua dipantau dalam
            satu dashboard terintegrasi.
          </p>

          <div className="mt-8 flex gap-4">
            <Link to="/login">
              <Button className="cursor-pointer">Mulai Sekarang</Button>
            </Link>
            <Link to="/about-product">
            <button className="px-6 cursor-pointer py-3 border border-white/20 rounded-lg hover:bg-white/5 transition">
              Pelajari Selengkapnya
            </button>
            </Link>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <img
            src={heroImage}
            className="w-full max-w-xl rounded-2xl shadow-[0_0_60px_-10px_rgba(255,0,0,0.4)] object-cover"
          />
        </div>
      </section>
      <section className="lg:px-20 mt-10 mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <article className="bg-white/3 rounded-2xl p-8 border border-white/6">
            <h3 className="text-xl font-semibold mb-3">Visi</h3>
            <p className="text-gray-200 leading-relaxed">
              Menjadi produsen makanan dan minuman berkualitas yang diakui
              secara nasional dan internasional melalui inovasi berkelanjutan
              serta komitmen pada kualitas dan kepuasan konsumen.
            </p>
          </article>

          <article className="bg-white/3 rounded-2xl p-8 border border-white/6">
            <h3 className="text-xl font-semibold mb-3">Misi</h3>
            <p className="text-gray-200 leading-relaxed">
              Menghadirkan produk inovatif, meningkatkan proses produksi yang
              efisien, menjaga kualitas terbaik, serta memperluas jangkauan
              pasar global untuk memberi manfaat bagi konsumen, karyawan, dan
              pemangku kepentingan.
            </p>
          </article>
        </div>
      </section>
      <section className="px-8 lg:px-20 mt-20">
        <h2 className="text-center text-3xl font-semibold">
          Keunggulan Sistem
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-14">
          {[
            {
              title: "Real-Time Monitoring",
              desc: "Pantau output produksi, downtime, dan reject secara langsung.",
            },
            {
              title: "Data Terintegrasi",
              desc: "Semua data tercatat otomatis tanpa input ulang dan tersimpan aman.",
            },
            {
              title: "Dashboard Informatif",
              desc: "Tampilan rapi, ringkas, dan mudah dipahami untuk membantu pengambilan keputusan.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 shadow-xl hover:border-red-500/40 hover:shadow-red-500/20 transition"
            >
              <h3 className="text-xl font-semibold text-red-500">
                {feature.title}
              </h3>
              <p className="mt-3 text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="px-8 lg:px-20 mt-28">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold">
            Tentang Sistem Monitoring Produksi
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">
            Sistem ini dirancang untuk membantu proses produksi berjalan lebih
            teratur, transparan, dan mudah dipantau oleh seluruh tim. Setiap
            data tercatat otomatis sehingga informasi lebih cepat, rapi, dan
            akurat.
          </p>
        </div>

        {/* Split Layout */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {[
              {
                title: "Alur Produksi Lebih Terstruktur",
                desc: "Setiap proses dicatat dari awal sampai selesai, memudahkan pemantauan per-line.",
              },
              {
                title: "Data Selalu Sinkron",
                desc: "Operator, admin, dan manajemen melihat data yang sama tanpa input ulang.",
              },
              {
                title: "Monitoring Mesin & Output",
                desc: "Output harian, downtime, dan reject mudah dipahami melalui tampilan visual.",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-red-600/10 flex items-center justify-center rounded-xl border border-red-600/20">
                  <span className="text-red-500 text-2xl">•</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full"></div>
            <div className="relative p-10 rounded-3xl bg-white/5 border border-white/10 h-full shadow-xl">
              <h3 className="text-2xl font-semibold mb-5 text-red-500">
                Manfaat Utama
              </h3>

              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✔</span>
                  Mempercepat pencatatan data harian
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✔</span>
                  Mengurangi kesalahan input data
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✔</span>
                  Data tersimpan rapi & mudah dicari
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✔</span>
                  Memudahkan koordinasi antar shift
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">✔</span>
                  Mendukung keputusan berbasis data
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}
