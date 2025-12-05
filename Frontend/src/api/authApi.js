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

  // Update Profile User
  updateProfile: async (data) => {
    return await axiosClient.post("/user/profile?_method=PUT", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Forgot Password
  forgotPassword: async (email) => {
    return await axiosClient.post("/forgot-password", { email });
  },

  // Reset Password
  resetPassword: async (data) => {
    return await axiosClient.post("/reset-password", data);
  },
};

export default authApi;