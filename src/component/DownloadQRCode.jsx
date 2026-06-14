import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function DownloadQRCode({ value, children }) {
  const qrRef = useRef(null);

  const handleDownload = () => {
    if (typeof document === "undefined") return;
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `qrcode-${value}.png`;
    link.click();
  };

  return (
    <>
      {/* QR disembunyikan */}
      <div ref={qrRef} style={{ display: "none" }}>
        <QRCodeCanvas value={value} size={200} level="H" includeMargin />
      </div>

      {/* Tombol custom */}
      <span onClick={handleDownload} className="inline-block">
        {children}
      </span>
    </>
  );
}
