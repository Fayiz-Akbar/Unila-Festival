import axiosClient from "./axiosClient";

const eventTersimpanApi = {
  /**
   * Mengambil semua event yang disimpan user
   * GET /api/event-tersimpan
   */
  getEventTersimpan: () => {
    return axiosClient.get("/event-tersimpan");
  },

  /**
   * Simpan event (bookmark)
   * POST /api/event-tersimpan
   */
  simpanEvent: (id_acara) => {
    return axiosClient.post("/event-tersimpan", { id_acara });
  },

  /**
   * Hapus event dari simpanan
   * DELETE /api/event-tersimpan/{id_acara}
   */
  hapusEvent: (id_acara) => {
    return axiosClient.delete(`/event-tersimpan/${id_acara}`);
  },

  /**
   * Cek apakah event sudah disimpan atau belum
   * GET /api/event-tersimpan/check/{id_acara}
   */
  checkEvent: (id_acara) => {
    return axiosClient.get(`/event-tersimpan/check/${id_acara}`);
  },
};

export default eventTersimpanApi;
