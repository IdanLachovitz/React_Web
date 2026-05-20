import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchCategory } from '../api';
import GenreCarousel from '../components/GenreCarousel';
import GameGrid from '../components/GameGrid';

export default function Home() {
  const { token } = useAuth();
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadHome = async () => {
      try {
        const data = await fetchCategory('recommendations', token);
        if (mounted) {
          setGames(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setIsLoading(false);
      }
    };
    loadHome();
    return () => { mounted = false; };
  }, [token]);

  return (
    <div className="pb-20">
      <div className="mb-6 relative inline-block">
        <div className="absolute inset-0 bg-purple-600/25 blur-[60px] rounded-full pointer-events-none -z-10 scale-110"></div>
        <h1 className="text-3xl sm:text-2xl md:text-[3rem] font-black text-white tracking-tighter leading-[1.1]">
          Welcome to <span className="text-purple-500">GameSense</span>
        </h1>
      </div>
      <p className="text-gray-400 font-inter text-lg md:text-l max-w-full leading-relaxed mb-10">
        Stop searching, start playing. Get tailored game recommendations and manage your ultimate personal collection
      </p>

      <GenreCarousel />
    </div>
  );
}
