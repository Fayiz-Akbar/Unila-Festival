import axiosClient from "./axiosClient";

const authApi = {
  // Mengambil CSRF cookie (Wajib untuk Laravel Sanctum SPA/API)
  getCsrfToken: async () => {
    return await axiosClient.get("/sanctum/csrf-cookie");
  },

  // Login User
  login: async (email, password) => {
    // Pancing cookie dulu untuk keamanan CSRF
    await authApi.getCsrfToken(); 
    // Kirim request login
    return await axiosClient.post("/login", { email, password });
  },

  // Register User Baru
  register: async (data) => {
    await authApi.getCsrfToken();
    return await axiosClient.post("/register", data);
  },

  // Logout
  logout: async () => {
    return await axiosClient.post("/logout");
  },

  // Ambil Data User yang sedang login (Profile)
  getUser: async () => {
    return await axiosClient.get("/me");
  },
};

export default authApi;