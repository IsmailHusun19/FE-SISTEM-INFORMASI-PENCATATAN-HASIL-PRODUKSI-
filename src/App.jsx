import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutProduct from "./pages/AboutProduct";
import Company from "./pages/Company";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SidebarContextProvider from "./component/SidebarContextProvider";
import ProtectedRoute from "./component/ProtectedRoute";
import { Toaster } from "sonner";
import UnitHead from "./pages/UnitHead";
import AddUnitHead from "./pages/AddUnitHead";
import Error from "./pages/Error";
import EditUnitHead from "./pages/EditUnitHead";
import KetuaRegu from "./pages/KetuaRegu";
import AddKetuaRegu from "./pages/AddKetuaRegu";
import EditKetuaRegu from "./pages/EditKetuaRegu";
import OperatorProduksi from "./pages/OperatorProduksi";
import EditOperatorProduksi from "./pages/EditOperatorProduksi";
import AddOperatorProduksi from "./pages/AddOperatorProduksi";
import Product from "./pages/Product";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Mesin from "./pages/Mesin";
import EditMesin from "./pages/EditMesin";
import AddMesin from "./pages/AddMesin";
import Profile from "./pages/Profile";
import Line from "./pages/Line";
import AddLine from "./pages/AddLine";
import EditLine from "./pages/EditLine";
import Produksi from "./pages/Produksi";
import AddProduksi from "./pages/AddProduksi";
import EditProduksi from "./pages/EditProduksi";
import LogMesin from "./pages/LogMesin";
import AddLogMesin from "./pages/AddLogMesin";
import DetailLogMesin from "./pages/DetailLogMesin";
import EditLogMesin from "./pages/EditLogMesin";
import ValidasiProduksi from "./pages/ValidasiProduksi";
import DetailValidasiProduksi from "./pages/DetailValidasiProduksi";
import Monitoring from "./pages/Monitoring";
import LaporanProduct from "./pages/LaporanProduct";
import LaporanProduksiByProduct from "./pages/LaporanProduksiByProduct";
import DetailLaporan from "./pages/DetailLaporan";
import MesinRusak from "./pages/MesinRusak";
import DownTime from "./pages/DownTime";
import Reject from "./pages/Reject";

const App = () => {
  return (
    <>
      <Toaster richColors theme="dark" />
      <Router>
        <Routes>
          <Route>
            <Route path="/" element={<Home />} />
            <Route path="/about-product" element={<AboutProduct />} />
            <Route path="/company" element={<Company />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Error />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <Dashboard />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <Profile />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pengguna/unit head"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <UnitHead />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pengguna/tambah/unit head"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <AddUnitHead />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pengguna/edit/unit head/:id"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <EditUnitHead />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pengguna/ketua regu"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <KetuaRegu />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pengguna/tambah/ketua regu"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <AddKetuaRegu />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pengguna/edit/ketua regu/:id"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <EditKetuaRegu />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pengguna/operator produksi"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <OperatorProduksi />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pengguna/tambah/operator produksi"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <AddOperatorProduksi />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pengguna/edit/operator produksi/:id"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <EditOperatorProduksi />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/produk"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <Product />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tambah/produk"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <AddProduct />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/produk/:id"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <EditProduct />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/mesin"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <Mesin />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tambah/mesin"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <AddMesin />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/mesin/:id"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <EditMesin />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/line"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <Line />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tambah/line"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <AddLine />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/line/:id"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <EditLine />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/produksi"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <Produksi />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tambah/produksi"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <AddProduksi />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/produksi/:id"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <EditProduksi />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/log-mesin"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <LogMesin />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tambah/log-mesin"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <AddLogMesin />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/detail/log-mesin/:id"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <DetailLogMesin />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/log-mesin/:id"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <EditLogMesin />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/approval-produksi"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <ValidasiProduksi />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/detail/approval-produksi/:id"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <DetailValidasiProduksi />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/monitoring"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <Monitoring />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/laporan"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <LaporanProduct />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/laporan-produksi/:id"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <LaporanProduksiByProduct />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/detail-laporan/:id"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <DetailLaporan />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/mesin-rusak"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <MesinRusak />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/down-time"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <DownTime />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/produksi-reject"
              element={
                <ProtectedRoute>
                  <SidebarContextProvider>
                    <Reject />
                  </SidebarContextProvider>
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
