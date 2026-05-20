import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import AuthModal from './AuthModal';
import LoginRequiredModal from './LoginRequiredModal';
import Toast from './Toast';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthModalOpen, setIsAuthModalOpen, isLoginRequiredModalOpen } = useAuth();

  return (
    <div className="bg-[#0e0e10] text-[#e5e1e4] h-screen w-screen overflow-hidden flex flex-col selection:bg-purple-600/30">
      <Header toggleSidebar={() => setSidebarOpen(true)} />
      
      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
        
        <main className="flex-1 w-full flex flex-col min-w-0 flex-grow overflow-y-auto max-h-[calc(100vh-41px)] relative">
          <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pb-12 pt-4">
            <Outlet />
          </div>
          
          <footer className="w-full mt-auto bg-[#0e0e10] border-t border-white/5 font-inter text-xs text-gray-500 py-6 mt-8">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="order-2 md:order-1 text-center md:text-left">© 2026 GameSense. Data provided by IGDB and Twitch.</div>
                <div className="flex gap-4 sm:gap-8 order-1 md:order-2">
                    <a className="text-gray-600 hover:text-purple-400 transition-opacity duration-200" href="#">API Status</a>
                    <a className="text-gray-600 hover:text-purple-400 transition-opacity duration-200" href="#">Community Rules</a>
                    <a className="text-gray-600 hover:text-purple-400 transition-opacity duration-200" href="#">Support</a>
                </div>
            </div>
          </footer>
        </main>
      </div>

      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
      {isLoginRequiredModalOpen && <LoginRequiredModal />}
      <Toast />
    </div>
  );
}
