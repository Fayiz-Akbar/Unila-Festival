import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authApi from '../api/authApi';
import Input from '../components/Common/Input';
import Button from '../components/Common/button';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setResetLink('');

    try {
      const response = await authApi.forgotPassword(email);
      
      // Generate link reset untuk development (dalam produksi, link dikirim via email)
      if (response.data.token && response.data.email) {
        const link = `${window.location.origin}/reset-password?token=${encodeURIComponent(response.data.token)}&email=${encodeURIComponent(response.data.email)}`;
        setResetLink(link);
      }
      
      setMessage({ 
        type: 'success', 
        text: response.data.message || 'Link reset password telah dikirim ke email Anda.'
      });
      setEmail('');
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = error.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#2a2a3e] to-[#1a1a2e] px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <span className="text-3xl font-extrabold text-white">
              <span className="text-[#FF7F3E]">Unila</span>Fest
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">Lupa Password?</h2>
          <p className="text-gray-400 text-sm">
            Masukkan email Anda dan kami akan mengirimkan link untuk reset password
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {message && (
            <div className={`p-4 rounded-lg mb-6 text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className="flex items-start">
                <svg 
                  className={`w-5 h-5 mr-2 flex-shrink-0 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  {message.type === 'success' ? (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  )}
                </svg>
                <p>{message.text}</p>
              </div>
            </div>
          )}

          {resetLink && (
            <div className="p-4 rounded-lg mb-6 text-sm bg-blue-50 border border-blue-200">
              <p className="text-blue-900 font-semibold mb-2">🔗 Link Reset Password (Development Mode):</p>
              <p className="text-xs text-blue-700 mb-2">Dalam mode produksi, link ini akan dikirim ke email Anda.</p>
              <a 
                href={resetLink}
                className="text-blue-600 hover:text-blue-800 underline break-all text-xs"
                target="_blank"
                rel="noopener noreferrer"
              >
                {resetLink}
              </a>
              <p className="text-xs text-blue-700 mt-2">Klik link di atas atau copy-paste ke browser baru.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Mengirim...' : 'Kirim Link Reset Password'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-sm text-[#FF7F3E] hover:text-[#e66b2b] font-medium transition-colors"
            >
              ← Kembali ke Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-8">
          Belum punya akun?{' '}
          <Link to="/register" className="text-[#FF7F3E] hover:text-white font-medium transition-colors">
            Daftar disini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
