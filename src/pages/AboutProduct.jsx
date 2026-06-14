import { useState } from "react";
import React from "react";
import Navbar from "../component/navbar";
import AstorSinggle from "../assets/astorsinggel.png"
import MiniAstor from "../assets/Mini Astor.png"
import AstorKalengEkspor from "../assets/Astor Ekspor Kaleng.png"
import AstorKalengLokal from "../assets/Astor Kaleng Lokal.png"
import AstorMiniStick from "../assets/Astor Mini Stick.png"
import Footer from "../component/Footer";

const tiers = [
  {
    title: "Astor Singles 20 pcs",
    img: AstorSinggle,
    description:
      "Camilan wafer stick coklat klasik dengan kemasan box isi 20 pcs yang praktis untuk dinikmati satu-satu. Tekstur renyah dan lapisan coklat manis yang merata membuatnya cocok sebagai teman minum teh atau camilan cepat kapan saja.",
  },
  {
    title: "Mini Astor",
    img: MiniAstor,
    description:
      "Varian Astor yang hadir dalam ukuran lebih kecil dengan rasa coklat manis dan tekstur renyah khas Astor. Cocok untuk camilan harian, dibawa bepergian, atau dibagikan ke teman dan keluarga sebagai snack praktis.",
  },
  {
    title: "Astor Kaleng Ekspor",
    img: AstorKalengEkspor,
    description:
      "Wafer stick coklat dalam kemasan kaleng besar premium, ideal untuk dinikmati bersama keluarga atau tamu. Kemasan kaleng tidak hanya menjaga kerenyahan wafer lebih lama, tapi juga sering jadi pilihan untuk hidangan di acara khusus ataupun sebagai hadiah.",
  },
  {
    title: "Astor Kaleng Lokal",
    img: AstorKalengLokal,
    description:
      "Versi kemasan kaleng ukuran sedang yang memberikan keseimbangan antara isi yang cukup banyak dan harga yang bersahabat. Tekstur renyah dan coklat khas Astor tetap menjadi daya tarik utama untuk camilan bersama teman atau keluarga.",
  },
  {
    title: "Astor Mini Stick",
    img: AstorMiniStick,
    description:
      "Varian wafer stick dengan ukuran kecil yang ceria dan mudah dinikmati. Cocok untuk kamu yang ingin rasa Astor yang renyah tanpa porsi besar — pas sebagai teman ngemil sambil bersantai atau dibawa ke sekolah/kampus.",
  },
];

const AboutProduct = () => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % tiers.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + tiers.length) % tiers.length);

  return (
    <>
      <Navbar />
      <div className=" bg-black">
        <div className="relative isolate px-6 py-24">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="mx-auto aspect-1155/678 w-288.75 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20"
            />
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <p className="mt-2 text-5xl font-semibold text-white">
              Produk Astor Mayora
            </p>
          </div>
          <div className="relative w-full max-w-xl mx-auto mt-10 overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out h-max"
              style={{
                transform: `translateX(-${index * 100}%)`,
              }}
            >
              {tiers.map((tier, index) => (
                <div key={index} className="min-w-full px-10">
                  <div className="bg-gray-800 rounded-3xl p-8 ring-1 ring-white/10 shadow-xl">
                    <h1 className="text-white mb-4 text-lg font-semibold text-center">
                      {tier.title}
                    </h1>
                    <div className="w-full h-44 flex justify-center object-cover">
                    <img src={tier.img} alt="" />
                    </div>
                    <p className="text-gray-300 mt-6">{tier.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-white px-3 py-2
          bg-gray-800/60 hover:bg-gray-700 rounded-full backdrop-blur-sm"
            >
              ❮
            </button>

            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white px-3 py-2
          bg-gray-800/60 hover:bg-gray-700 rounded-full backdrop-blur-sm"
            >
              ❯
            </button>

            {/* DOTS */}
            <div className="flex justify-center gap-2 mt-4">
              {tiers.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-3 w-3 rounded-full cursor-pointer transition-all ${
                    index === i ? "bg-indigo-500 scale-110" : "bg-gray-600"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-24">
        <Footer/>
        </div>
      </div>
    </>
  );
};

export default AboutProduct;
