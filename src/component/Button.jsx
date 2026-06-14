import React from "react";

export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-6 py-3 rounded-lg font-semibold tracking-wide
        bg-gradient-to-r from-red-700 to-red-600
        hover:from-red-600 hover:to-red-500
        text-white shadow-[0_0_18px_-4px_rgba(255,0,0,0.4)]
        hover:shadow-[0_0_25px_-3px_rgba(255,50,50,0.6)]
        transition-all duration-300 active:scale-95
        ${className}`}
    >
      {children}
    </button>
  );
}
