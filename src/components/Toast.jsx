import { useAuth } from '../context/AuthContext';

export default function Toast() {
  const { toastMessage } = useAuth();

  if (!toastMessage) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center pointer-events-none">
      <div className="bg-black/80 backdrop-blur-sm p-8 rounded-xl border border-white/10 text-white text-lg font-bold text-center animate-in fade-in zoom-in duration-300">
        <p>{toastMessage}</p>
      </div>
    </div>
  );
}
