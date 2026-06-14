import axios from "axios";

const ApiMe = async () => {
  try {
    const res = await axios.get("http://localhost:3000/users/me", {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};

const EditMe = async (data) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/users/me`,
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }
};

const GetAllUsers = async () => {
  try {
    const res = await axios.get("http://localhost:3000/users/all", {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};

const GetUserById = async (id) => {
  try {
    const res = await axios.get(`http://localhost:3000/users/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};

const Logout = async () => {
  try {
    const res = await axios.post("http://localhost:3000/users/logout", {}, {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};

const ApiLogin = async (data) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/users/login`,
      data,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message || "Login gagal",
      status: error.response?.status || 500,
    };
  }
};

const AddPengguna = async (data) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/users`,
      data,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }
};

const EditPengguna = async (data, id) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/users/${id}`,
      data,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }
};

const DeletePengguna = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/users/${id}`,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }
};

const GetAllProduct = async () => {
  try {
    const res = await axios.get("http://localhost:3000/produk", {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};

const GetProductById = async (id) => {
  try {
    const res = await axios.get(`http://localhost:3000/produk/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};

const AddDataProduct = async (data) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/produk`,
      data,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }
};

const EditDataProduct = async (data, id) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/produk/${id}`,
      data,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }
};

const DeleteProduct = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/produk/${id}`,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }
};

const GetAllMesin = async () => {
  try {
    const res = await axios.get("http://localhost:3000/mesin", {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};

const GetMesinById = async (id) => {
  try {
    const res = await axios.get(`http://localhost:3000/mesin/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};

const AddDataMesin = async (data) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/mesin`,
      data,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }
};

const EditDataMesin = async (data, id) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/mesin/${id}`,
      data,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }
};

const DeleteMesin = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/mesin/${id}`,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }
};

const GetAllLine = async () => {
  try {
    const res = await axios.get("http://localhost:3000/line", {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};

const GetLineById = async (id) => {
  try {
    const res = await axios.get(`http://localhost:3000/line/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};

const AddDataLine = async (data) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/line`,
      data,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }
};

const EditDataLine = async (data, id) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/line/${id}`,
      data,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }
};

const DeleteLine = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/line/${id}`,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }
};

const GetAllShift = async () => {
  try {
    const res = await axios.get("http://localhost:3000/shift", {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};

const GetAllProduksi = async () => {
  try {
    const res = await axios.get("http://localhost:3000/produksi", {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};

const GetProduksiById = async (id) => {
  try {
    const res = await axios.get(`http://localhost:3000/Produksi/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};

const AddDataProduksi = async (data) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/produksi`,
      data,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }
};

const EditDataProduksi = async (data, id) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/produksi/${id}`,
      data,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }
};

const DeleteProduksi = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/produksi/${id}`,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }
};

const GetAllLogMesin = async () => {
  try {
    const res = await axios.get("http://localhost:3000/monitoring-mesin", {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};

const GetLogMesinById = async (id) => {
  try {
    const res = await axios.get(`http://localhost:3000/monitoring-mesin/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};

const GetLogMesinByIdProduksi = async (id) => {
  try {
    const res = await axios.get(`http://localhost:3000/monitoring-mesin/produksi/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};

const AddDataLogMesin = async (data) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/monitoring-mesin`,
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    return response;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }
};

const EditDataLogMesin = async (data, id) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/monitoring-mesin/${id}`,
      data,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }
};

const EditDataAkhirLogMesin = async (data, id) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/monitoring-mesin/${id}/akhir`,
      data,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }
};

const DeleteDataLogMesin = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/monitoring-mesin/${id}`,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error", error);
    return {
      success: false,
      message: error.response?.data?.message,
      status: error.response?.status || 500,
    };
  }
};

const GetProduksiAndLogMesinByIdProduksi = async (id) => {
  try {
    const res = await axios.get(`http://localhost:3000/produksi/qrcode/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};

const GetSummary = async (q) => {
  try {
    const res = await axios.get(`http://localhost:3000/laporan/summary?${q}`, {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};

const GetChart = async (q, mode = "line") => {
  try {
    const res = await axios.get(
      `http://localhost:3000/laporan/chart?mode=${mode}&${q}`,
      { withCredentials: true }
    );

    // Pastikan selalu array
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("GetChart error:", err);
    return [];
  }
};

const GetMesinRusak = async (q) => {
  try {
    const res = await axios.get(
      `http://localhost:3000/laporan/mesin-tersering-rusak?${q}`,
      { withCredentials: true }
    );
    return res.data;
  } catch {
    return [];
  }
};

const GetKerusakanJenis = async (q) => {
  try {
    const res = await axios.get(
      `http://localhost:3000/laporan/kerusakan-jenis?${q}`,
      { withCredentials: true }
    );
    return res.data;
  } catch {
    return [];
  }
};

const GetDowntimePerLine = async (q) => {
  try {
    const res = await axios.get(
      `http://localhost:3000/laporan/downtime-line?${q}`,
      { withCredentials: true }
    );
    return res.data;
  } catch {
    return [];
  }
};

const GetRejectRate = async (q) => {
  try {
    const res = await axios.get(
      `http://localhost:3000/laporan/reject-rate?${q}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("GetRejectRate error:", err);
    return {
      totalProduksi: 0,
      totalReject: 0,
      rejectRate: 0,
    };
  }
};

const GetDashboardPdf = async (q) => {
  try {
    const res = await axios.get(
      "http://localhost:3000/laporan/dashboard/pdf",
      {
        params: q,
        withCredentials: true,
        responseType: "blob",
      }
    );

    return res.data; // Blob PDF
  } catch (err) {
    console.error("GetDashboardPdf error:", err);
    throw err;
  }
};

const GetLaporanCetakAll = async (q) => {
  try {
    const res = await axios.get(
      "http://localhost:3000/laporan/produksi/full-pdf",
      {
        params: q,
        withCredentials: true,
        responseType: "blob",
      }
    );

    return res.data;
  } catch (err) {
    console.error("GetDashboardPdf error:", err);
    throw err;
  }
};

const GetAllProduksiByProduct = async (id) => {
  try {
    const res = await axios.get(`http://localhost:3000/produksi/by-product/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};

const GetLaporanCetakAllByProduct = async (id, q) => {
  try {
    const res = await axios.get(
      `http://localhost:3000/laporan/produksi/full-pdf/${id}`,
      {
        params: q,
        withCredentials: true,
        responseType: "blob",
      }
    );

    return res.data;
  } catch (err) {
    console.error("GetDashboardPdf error:", err);
    throw err;
  }
};

const GetProduksiMesinRusak = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/produksi/mesin-rusak`, {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};

const GetProduksiDownTime = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/produksi/down-time`, {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return null;
  }
};








export { ApiLogin, GetProduksiDownTime, GetProduksiMesinRusak, GetLaporanCetakAllByProduct, GetAllProduksiByProduct, GetLaporanCetakAll, GetDashboardPdf, GetRejectRate, GetDowntimePerLine, GetKerusakanJenis, GetMesinRusak, GetSummary, GetChart, GetProduksiAndLogMesinByIdProduksi, EditDataLogMesin, EditDataAkhirLogMesin, GetLogMesinByIdProduksi, GetLogMesinById, DeleteDataLogMesin, GetAllLogMesin, AddDataLogMesin, GetAllShift, EditMe, ApiMe, Logout, GetAllUsers, AddPengguna, EditPengguna, GetUserById, DeletePengguna, GetAllProduct, AddDataProduct, EditDataProduct, DeleteProduct, GetProductById, GetAllMesin, GetMesinById, AddDataMesin, EditDataMesin, DeleteMesin, GetAllLine, GetLineById, AddDataLine, EditDataLine, DeleteLine, GetAllProduksi, GetProduksiById, AddDataProduksi, EditDataProduksi, DeleteProduksi };
