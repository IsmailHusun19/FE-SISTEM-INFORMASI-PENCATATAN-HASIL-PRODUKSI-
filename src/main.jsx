import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/style/index.css";
import App from "./App.jsx";
import { AuthProvider } from "./component/AuthContext";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </AuthProvider>
);
