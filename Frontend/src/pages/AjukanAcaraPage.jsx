import Layout from "../components/Common/Layout";
import FormAjuanAcara from "../components/Submission/FormAjuanAcara";

export default function AjukanAcaraPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Buat Acara Baru</h1>
            <p className="text-gray-600 mt-2">
              Isi formulir di bawah ini untuk mengajukan event baru. Pastikan data akurat agar cepat disetujui admin.
            </p>
          </div>

          {/* Grid Layout: Kiri Form, Kanan Info/Preview (Opsional) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Kolom Utama: Form */}
            <div className="lg:col-span-2">
              <FormAjuanAcara />
            </div>

            {/* Kolom Sidebar: Tips */}
            <div className="lg:col-span-1">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-blue-800 mb-3">Tips Pengajuan Cepat</h4>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-2">
                  <li>Gunakan poster rasio 3:4 atau 1:1 berkualitas tinggi.</li>
                  <li>Jelaskan deskripsi acara dengan detail (rundown, benefit, dll).</li>
                  <li>Pastikan tanggal selesai tidak sebelum tanggal mulai.</li>
                  <li>Acara berbayar akan dikenakan potongan biaya admin 5%.</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}