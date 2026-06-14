import { Link } from "react-router-dom";
import React from "react";

export default function Error() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-200">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-400">404</h1>
        <p className="mt-2 text-gray-400">
          Halaman tidak ditemukan
        </p>

        <Link
          to="/dashboard"
          className="inline-block mt-6 px-4 py-2
            bg-slate-800 border border-slate-600 rounded
            hover:bg-slate-700 transition"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
