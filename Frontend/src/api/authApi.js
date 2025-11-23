import axiosClient from "./axiosClient";

const authApi = {
  // Login User
  login: async (email, password) => {
    return await axiosClient.post("/login", { email, password });
  },

  // Register User Baru
  register: async (data) => {
    return await axiosClient.post("/register", data);
  },

  // Logout
  logout: async () => {
    return await axiosClient.post("/logout");
  },

  // Ambil Data User yang sedang login (Profile)
  getUser: async () => {
    return await axiosClient.get("/user");
  },
};

export default authApi;