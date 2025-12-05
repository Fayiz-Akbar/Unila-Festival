import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import authApi from '../api/authApi';

const ProfilePage = () => {
  const { user, setAuthData, token } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    nama: user?.nama || '',
    email: user?.email || '',
    current_password: '',
    password: '',
    password_confirmation: ''
  });
  const [fotoProfile, setFotoProfile] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(user?.foto_profile_url || null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoProfile(file);
      // Preview foto
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewFoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form jika cancel
      setFormData({
        nama: user?.nama || '',
        email: user?.email || '',
        current_password: '',
        password: '',
        password_confirmation: ''
      });
      setFotoProfile(null);
      setPreviewFoto(user?.foto_profile_url || null);
      setMessage(null);
    }
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    // Validasi password
    if (formData.password) {
      if (!formData.current_password) {
        setMessage({ type: 'error', text: 'Masukkan password lama Anda untuk mengubah password' });
        setLoading(false);
        return;
      }
      if (formData.password !== formData.password_confirmation) {
        setMessage({ type: 'error', text: 'Password baru dan konfirmasi password tidak cocok' });
        setLoading(false);
        return;
      }
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nama', formData.nama);
      formDataToSend.append('email', formData.email);

      // Hanya kirim password jika diisi
      if (formData.password) {
        formDataToSend.append('current_password', formData.current_password);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('password_confirmation', formData.password_confirmation);
      }

      // Kirim foto jika ada
      if (fotoProfile) {
        formDataToSend.append('foto_profile', fotoProfile);
      }

      const response = await authApi.updateProfile(formDataToSend);
      
      // Update user data di context
      setAuthData(response.data.user, token);
      
      setMessage({ type: 'success', text: 'Profile berhasil diperbarui!' });
      setIsEditing(false);
      
      // Reset password fields dan foto
      setFormData({
        ...formData,
        current_password: '',
        password: '',
        password_confirmation: ''
      });
      setFotoProfile(null);
      setPreviewFoto(response.data.user.foto_profile_url);
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(', ');
        setMessage({ type: 'error', text: errorMessages });
      } else {
        const errorMsg = error.response?.data?.message || 'Gagal memperbarui profile';
        setMessage({ type: 'error', text: errorMsg });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-gray-600">Silakan login terlebih dahulu</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header Profile */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-[#1a1a2e] to-[#2a2a3e] h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex items-end -mt-16 mb-4">
              <div className="h-32 w-32 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-4xl font-bold text-[#FF7F3E]">
                {user.foto_profile_url ? (
                  <img src={user.foto_profile_url} alt={user.nama} className="w-full h-full object-cover" />
                ) : (
                  user.nama ? user.nama.charAt(0).toUpperCase() : 'U'
                )}
              </div>
              <div className="ml-6 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{user.nama}</h1>
                <p className="text-gray-600">{user.email}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                  user.peran === 'Admin' ? 'bg-red-100 text-red-800' : 
                  user.is_penyelenggara ? 'bg-orange-100 text-orange-800' : 
                  'bg-blue-100 text-blue-800'
                }`}>
                  {user.peran === 'Admin' ? 'Administrator' : 
                   user.is_penyelenggara ? 'Penyelenggara' : 'Pengguna'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'info'
                    ? 'border-[#FF7F3E] text-[#FF7F3E]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Informasi Akun
              </button>
              {user.is_penyelenggara && (
                <button
                  onClick={() => setActiveTab('organizer')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'organizer'
                      ? 'border-[#FF7F3E] text-[#FF7F3E]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Info Penyelenggara
                </button>
              )}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Informasi Akun</h2>
                  <button
                    onClick={handleEditToggle}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isEditing 
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                        : 'bg-[#FF7F3E] text-white hover:bg-[#e66b2b]'
                    }`}
                  >
                    {isEditing ? 'Batal' : 'Edit Profile'}
                  </button>
                </div>

                {message && (
                  <div className={`p-3 rounded text-sm ${
                    message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {message.text}
                  </div>
                )}

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Upload Foto Profile */}
                    <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                      <div className="h-24 w-24 rounded-full overflow-hidden flex items-center justify-center text-3xl font-bold text-[#FF7F3E] bg-gray-100 border-2 border-gray-200">
                        {previewFoto ? (
                          <img src={previewFoto} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          user.nama ? user.nama.charAt(0).toUpperCase() : 'U'
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profile</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFotoChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max. 2MB)</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <input
                          type="text"
                          name="nama"
                          value={formData.nama}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF7F3E] focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF7F3E] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Section - Full Width */}
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Ubah Password (Opsional)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
                          <input
                            type="password"
                            name="current_password"
                            value={formData.current_password}
                            onChange={handleChange}
                            placeholder="Password saat ini"
                            className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF7F3E] focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password baru"
                            className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF7F3E] focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                          <input
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            placeholder="Ulangi password baru"
                            className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF7F3E] focus:border-transparent"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">* Kosongkan jika tidak ingin mengubah password</p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={handleEditToggle}
                        className="px-6 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 rounded-lg text-sm font-medium bg-[#FF7F3E] text-white hover:bg-[#e66b2b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        {user.nama}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        {user.email}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Peran</label>
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        {user.peran}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        {user.is_penyelenggara ? 'Penyelenggara Terverifikasi' : 'Pengguna Umum'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'organizer' && user.is_penyelenggara && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Informasi Penyelenggara</h2>
                
                {user.penyelenggara_yang_dikelola && user.penyelenggara_yang_dikelola.length > 0 ? (
                  <div className="space-y-4">
                    {user.penyelenggara_yang_dikelola.map((penyelenggara) => (
                      <div key={penyelenggara.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            {penyelenggara.logo_url && (
                              <img 
                                src={penyelenggara.logo_url} 
                                alt={penyelenggara.nama_penyelenggara}
                                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                              />
                            )}
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">
                                {penyelenggara.nama_penyelenggara}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Tipe: <span className="font-medium">{penyelenggara.tipe}</span>
                              </p>
                              {penyelenggara.deskripsi_singkat && (
                                <p className="text-sm text-gray-600 mt-2">
                                  {penyelenggara.deskripsi_singkat}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            penyelenggara.pivot?.status_tautan === 'Approved' 
                              ? 'bg-green-100 text-green-800' 
                              : penyelenggara.pivot?.status_tautan === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {penyelenggara.pivot?.status_tautan || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-gray-600">Belum ada organisasi penyelenggara</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
