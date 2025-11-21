import CardAcara from '../Common/CardAcara';
import { Link } from 'react-router-dom';
import { FaSearch, FaRegSadTear } from 'react-icons/fa';

export default function AgendaSayaList({ agendaList, isHistory }) {
  
  // --- TAMPILAN EMPTY STATE YANG KEREN (Jika List Kosong) ---
  if (agendaList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fadeIn">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
           {isHistory ? (
             <FaRegSadTear className="text-4xl text-gray-400" />
           ) : (
             <FaSearch className="text-4xl text-primary-300" />
           )}
        </div>
        
        <h3 className="text-xl font-bold text-secondary-900 mb-2">
          {isHistory ? "Belum ada riwayat acara." : "Wah, belum ada jadwal nih!"}
        </h3>
        
        <p className="text-gray-500 max-w-md mb-8">
          {isHistory 
            ? "Anda belum menyelesaikan acara apapun." 
            : "Anda belum mendaftar ke acara apapun. Temukan seminar atau lomba menarik sekarang."}
        </p>

        {!isHistory && (
          <Link 
            to="/" 
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-full shadow-lg hover:shadow-primary-500/30 transition-all transform hover:-translate-y-1"
          >
            Jelajahi Event Sekarang
          </Link>
        )}
      </div>
    );
  }

  // --- GRID LAYOUT UNTUK KARTU ---
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
      {agendaList.map((acara) => (
        <CardAcara key={acara.id} acara={acara} />
      ))}
    </div>
  );
}