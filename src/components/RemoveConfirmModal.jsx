import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

export default function RemoveConfirmModal({ gameId, onClose }) {
  const { removeFromLibrary } = useAuth();

  const handleConfirm = async () => {
    await removeFromLibrary(gameId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110]">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md mx-auto my-20 glass-modal border border-white/10 rounded-2xl overflow-hidden p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-white italic tracking-tighter">Remove from Library</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-400 text-base mb-6">
          Are you sure you want to remove this game from your library?
        </p>
        <div className="space-y-4">
          <button 
            onClick={handleConfirm}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all"
          >
            Remove
          </button>
          <button 
            onClick={onClose}
            className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
