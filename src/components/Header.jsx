import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Bell, Settings } from 'lucide-react';
import { useState } from 'react';
import LogoutConfirmModal from './LogoutConfirmModal';

export default function Header({ toggleSidebar }) {
  const { user, setIsAuthModalOpen } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleAvatarClick = () => {
    if (user) {
      setIsLogoutModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <header className="bg-[#0e0e10]/80 backdrop-blur-md sticky top-0 w-full z-50 border-b border-white/10 shadow-xl">
        <div className="flex justify-between items-center px-4 md:px-6 max-w-[1440px] mx-auto py-1">
          <div className="flex items-center gap-4 md:gap-8">
            <button className="lg:hidden p-1 text-gray-400 hover:text-white" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <Link to="/" className="text-xl md:text-2xl font-black text-white italic tracking-tighter cursor-pointer">
              Game<span className="text-purple-500">Sense</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all active:scale-95">
              <Bell size={20} />
            </button>
            <button className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all active:scale-95">
              <Settings size={20} />
            </button>
            <div 
              onClick={handleAvatarClick}
              className={`w-8 h-8 rounded-full flex items-center justify-center ml-1 md:ml-2 border border-white/10 cursor-pointer active:scale-95 transition-transform overflow-hidden ${user ? 'bg-purple-800' : 'bg-purple-600'}`}
            >
              {user ? (
                <span className="text-white text-sm font-bold">{user.charAt(0).toUpperCase()}</span>
              ) : (
                <img 
                  alt="User avatar" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZKZSWkSYh-hTmBCJlTLUWj6300GIn6MvmmSlZ-QyfENfjd7eaOMQt7xhcR_NRO8LfWu_y2nbEeZvtPJgbLJSqCI4CkbaeCEqVsh4QVhnV2LkGyBHR_mr_cFWmpvwgsC97LjskzbqqRJw_xoV5yoyZMWARI92xVSrZcX53M-cf4_OwYmtetp8qwMZf0Ol1XzB6SHBJzM_6dRbFXBKVkMQbhg_677z0cyKEtQDYkgAuoxituHEaJzNqjaJFVNfMRZb8_QoRjGdM-tw" 
                />
              )}
            </div>
          </div>
        </div>
      </header>
      {isLogoutModalOpen && <LogoutConfirmModal onClose={() => setIsLogoutModalOpen(false)} />}
    </>
  );
}
