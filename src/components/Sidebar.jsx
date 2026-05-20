import { NavLink } from 'react-router-dom';
import { Home, Library, Sparkles, Search, Zap, Star, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, closeSidebar }) {
  const { user, setIsLoginRequiredModalOpen } = useAuth();

  const links = [
    { to: "/", icon: <Home size={20} />, label: "Home" },
    { to: "/library", icon: <Library size={20} />, label: "Library" },
    { to: "/recommendations", icon: <Sparkles size={20} />, label: "Recommended" },
    { to: "/search", icon: <Search size={20} />, label: "Search" },
    { to: "/category/new-releases", icon: <Zap size={20} />, label: "New Releases" },
    { to: "/category/top", icon: <Star size={20} />, label: "Top Rated" },
    { to: "/category/trends", icon: <TrendingUp size={20} />, label: "Trends" },
    { to: "/category/upcoming", icon: <Calendar size={20} />, label: "Upcoming" },
  ];

  const handleLinkClick = (e, to) => {
    if (!user && (to === '/library' || to === '/recommendations')) {
      e.preventDefault();
      setIsLoginRequiredModalOpen(true);
    }
    closeSidebar();
  };

  return (
    <aside
      className={`fixed lg:sticky top-0 lg:top-0 left-0 z-[60] lg:z-40 bg-[#1f1f23] border-r border-white/10 shadow-2xl flex flex-col pb-6 font-inter text-sm font-bold uppercase w-[250px] lg:w-[180px] lg:h-[calc(100vh-41px)] transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} pt-4 h-full`}
    >
      <div className="lg:hidden px-4 mb-6 flex justify-between items-center">
        <span className="text-white italic font-black">Menu</span>
        <button className="text-gray-400" onClick={closeSidebar}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <nav className="flex-1 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={(e) => handleLinkClick(e, link.to)}
            className={({ isActive }) =>
              `w-full text-left flex items-center gap-3 px-6 lg:px-4 py-3 transition-colors duration-300 ${isActive ? 'nav-link-active' : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
              }`
            }
          >
            {link.icon}
            <span className="whitespace-nowrap truncate">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
