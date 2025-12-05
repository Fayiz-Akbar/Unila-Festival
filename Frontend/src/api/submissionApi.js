import axiosClient from "./axiosClient";

const submissionApi = {
  /**
   * Mengambil daftar acara yang dibuat oleh user yang sedang login.
   * Endpoint: GET /api/submission/acara
   */
  getAcaraMilikUser: () => {
    return axiosClient.get("/submission/acara");
  },

  /**
   * Mengajukan acara baru.
   * Endpoint: POST /api/submission/acara
   */
  createAcara: (formData) => {
    return axiosClient.post("/submission/acara", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Penting untuk upload gambar
      },
    });
  },

  /**
   * Menghapus/Membatalkan pengajuan acara.
   * Endpoint: DELETE /api/submission/acara/{id}
   */
  deleteAcara: (id) => {
    return axiosClient.delete(`/submission/acara/${id}`);
  },
  
  /**
   * Update acara (jika diperlukan nanti).
   */
  updateAcara: (id, formData) => {
     return axiosClient.post(`/submission/acara/${id}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
     });
  },

  /**
   * Mengajukan penyelenggara baru.
   * Endpoint: POST /api/submission/penyelenggara
   */
  submitPenyelenggara: (formData) => {
    return axiosClient.post("/submission/penyelenggara", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Penting untuk upload file
      },
    });
  },

  /**
   * Mengambil daftar penyelenggara milik user yang sedang login.
   * Endpoint: GET /api/submission/penyelenggara
   */
  getPenyelenggaraMilikUser: () => {
    return axiosClient.get("/submission/penyelenggara");
  }
};

export default submissionApi;