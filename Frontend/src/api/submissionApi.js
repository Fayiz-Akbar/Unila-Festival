import axiosClient from "./axiosClient";

const submissionApi = {
  // 1. Mengajukan diri sebagai Penyelenggara
  submitPenyelenggara: async (formData) => {
    return await axiosClient.post("/submission/penyelenggara", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Wajib untuk upload file (logo)
      },
    });
  },

  // 2. Cek status pengajuan Penyelenggara (apakah sudah disetujui?)
  checkStatusPenyelenggara: async () => {
    return await axiosClient.get("/submission/penyelenggara/status");
  },

  // 3. Mengajukan Acara Baru
  submitAcara: async (formData) => {
    return await axiosClient.post("/submission/acara", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Wajib untuk upload file (poster)
      },
    });
  },
};

export default submissionApi;