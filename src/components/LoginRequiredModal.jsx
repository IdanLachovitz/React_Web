import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

export default function LoginRequiredModal() {
  const { setIsLoginRequiredModalOpen, setIsAuthModalOpen } = useAuth();

  const handleClose = () => {
    setIsLoginRequiredModalOpen(false);
  };

  const handleOpenAuth = () => {
    setIsLoginRequiredModalOpen(false);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[110]">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose}></div>
      <div className="relative w-full max-w-md mx-auto my-20 glass-modal border border-white/10 rounded-2xl overflow-hidden p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-white italic tracking-tighter">Login Required</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-400 text-base mb-6">
          You need to be logged in to view your game library or recommendations.
        </p>
        <div className="space-y-4">
          <button 
            onClick={handleOpenAuth}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all"
          >
            Login / Register
          </button>
          <button 
            onClick={handleClose}
            className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
