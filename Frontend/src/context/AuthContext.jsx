// Frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import authApi from '../api/authApi';
import submissionApi from '../api/submissionApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. Load data dari LocalStorage saat awal (agar tidak hilang saat refresh)
  const [user, setUser] = useState(() => 
    JSON.parse(localStorage.getItem('AUTH_USER')) || null
  );
  // State untuk menyimpan token (opsional di state, tapi wajib di localStorage)
  const [token, setToken] = useState(() => 
    localStorage.getItem('AUTH_TOKEN') || null
  );
  
  const [isPenyelenggara, setIsPenyelenggara] = useState(false);
  const [loading, setLoading] = useState(false);

  // 2. Cek status penyelenggara setiap kali user berubah (login/refresh)
  useEffect(() => {
    if (user && token) {
      // User model sudah punya accessor 'is_penyelenggara' yang cek status Approved
      if (user.is_penyelenggara === true) {
        setIsPenyelenggara(true);
      } else {
        setIsPenyelenggara(false);
      }
    } else {
      setIsPenyelenggara(false);
    }
  }, [user, token]);

  const login = async (email, password) => {
    try {
        setLoading(true);
        const response = await authApi.login(email, password);
        
        // PENTING: Backend mengirim 'access_token' & 'user'
        const { access_token, user: userData } = response.data;

        if (access_token && userData) {
            // Simpan ke State
            setToken(access_token);
            setUser(userData);

            // Simpan ke LocalStorage (Sesuai kode lama Anda)
            localStorage.setItem('AUTH_TOKEN', access_token);
            localStorage.setItem('AUTH_USER', JSON.stringify(userData));
        }
        
        return response;
    } catch (error) {
        throw error;
    } finally {
        setLoading(false);
    }
  };

  const register = async (data) => {
    try {
        setLoading(true);
        const response = await authApi.register(data);
        
        const { access_token, user: userData } = response.data;

        if (access_token && userData) {
            setToken(access_token);
            setUser(userData);
            
            localStorage.setItem('AUTH_TOKEN', access_token);
            localStorage.setItem('AUTH_USER', JSON.stringify(userData));
        }
        
        return response;
    } catch (error) {
        throw error;
    } finally {
        setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error", error);
    }
    // Hapus semua data sesi
    localStorage.removeItem('AUTH_TOKEN');
    localStorage.removeItem('AUTH_USER');
    setToken(null);
    setUser(null);
    setIsPenyelenggara(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isPenyelenggara, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);