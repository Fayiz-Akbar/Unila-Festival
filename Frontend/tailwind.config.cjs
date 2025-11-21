import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- INTEGRASI TEMA ---
        // Kita gunakan warna 'Violet' (Ungu) sebagai Primary 
        // agar cocok dengan selera Anda tapi tetap mengikuti struktur kawan Anda.
        primary: {
            DEFAULT: '#6E6189', // Warna Ungu Aesthetic Pilihan Anda
            ...colors.violet,   // Menyediakan shade 100-900 untuk kode kawan Anda
        },
        // Secondary untuk warna gelap/teks
        secondary: {
            DEFAULT: '#0A0B24', // Warna Gelap Aesthetic Pilihan Anda
            ...colors.slate,
        },
        // Alias khusus jika Anda ingin tetap pakai nama 'unila' di kode Anda
        unila: {
            light: '#CBC9CC',
            medium: '#9C90AA',
            DEFAULT: '#6E6189',
            dark: '#443A67',
            deep: '#0A0B24',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Font modern profesional
      },
    },
  },
  plugins: [],
}