import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchCategory } from '../api';
import GameGrid from '../components/GameGrid';

export default function Category() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { token, user, setIsLoginRequiredModalOpen, gameCache, updateGameCache, isAuthLoading } = useAuth();
  const [allGames, setAllGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [platformFilter, setPlatformFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');

  // Derive category ID from path if not in params
  const categoryId = id || (pathname === '/library' ? 'library' : pathname === '/recommendations' ? 'recommendations' : '');

  // Format title based on category ID
  const getTitle = () => {
    switch (categoryId) {
      case 'library': return 'YOUR LIBRARY';
      case 'recommendations': return 'RECOMMENDED FOR YOU';
      case 'new-releases': return 'NEW RELEASES';
      case 'top': return 'TOP RATED';
      case 'trends': return 'TRENDING NOW';
      case 'upcoming': return 'UPCOMING';
      // Genres
      case '12': return 'RPG';
      case '5': return 'SHOOTER';
      case '10': return 'RACING';
      case '14': return 'SPORT';
      case '15': return 'STRATEGY';
      case '4': return 'FIGHTING';
      case '31': return 'ADVENTURE';
      case '33': return 'ARCADE';
      case '13': return 'SIMULATOR';
      default: return 'GAMES';
    }
  };

  const isGenreCat = !isNaN(categoryId);

  const cachedData = gameCache[categoryId];

  useEffect(() => {
    let mounted = true;

    // Wait for auth to initialize
    if (isAuthLoading || !categoryId) return;

    if (categoryId === 'library' && !user) {
      setIsLoginRequiredModalOpen(true);
      navigate('/');
      return;
    }

    const loadGames = async () => {
      // If we have cached data, use it but don't return, allowing sync update
      if (cachedData) {
        setAllGames(cachedData);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await fetchCategory(categoryId, token);
        if (mounted) {
          setAllGames(data);
          updateGameCache(categoryId, data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setIsLoading(false);
      }
    };

    loadGames();
    return () => { mounted = false; };
  }, [categoryId, token, user, cachedData, updateGameCache, isAuthLoading]);

  useEffect(() => {
    let filtered = allGames;

    if (platformFilter !== 'all') {
      filtered = filtered.filter(game => {
        if (!game.platforms) return false;
        return game.platforms.some(p => {
          const name = (p.name || '').toLowerCase();
          const abbr = (p.abbreviation || '').toLowerCase();
          if (platformFilter === 'pc') return name.includes('pc') || name.includes('windows') || name.includes('linux') || name.includes('mac') || abbr.includes('pc') || abbr.includes('win') || abbr.includes('mac');
          if (platformFilter === 'playstation') return name.includes('playstation') || abbr.includes('ps');
          if (platformFilter === 'xbox') return name.includes('xbox') || name.includes('series') || abbr.includes('xb') || abbr.includes('xone');
          if (platformFilter === 'nintendo') return name.includes('nintendo') || name.includes('switch') || abbr.includes('switch');
          if (platformFilter === 'mobile') return name.includes('ios') || name.includes('android') || name.includes('mobile') || abbr.includes('ios') || abbr.includes('and');
          if (platformFilter === 'vr') return name.includes('vr') || name.includes('oculus') || name.includes('quest') || name.includes('vive') || name.includes('index') || abbr.includes('vr');
          return false;
        });
      });
    }

    if (genreFilter !== 'all') {
      filtered = filtered.filter(game => {
        if (!game.genres) return false;
        return game.genres.some(g => g.name === genreFilter);
      });
    }

    setFilteredGames(filtered);
  }, [allGames, platformFilter, genreFilter]);


  const platforms = [
    { id: 'all', name: 'All' }, { id: 'pc', name: 'PC' }, { id: 'playstation', name: 'PlayStation' },
    { id: 'xbox', name: 'Xbox' }, { id: 'nintendo', name: 'Nintendo' }, { id: 'mobile', name: 'Mobile' }, { id: 'vr', name: 'VR' }
  ];

  const genres = [
    { id: 'all', name: 'All', value: 'all' }, { id: 'rpg', name: 'RPG', value: 'Role-playing (RPG)' },
    { id: 'racing', name: 'Racing', value: 'Racing' }, { id: 'shooter', name: 'Shooter', value: 'Shooter' },
    { id: 'sport', name: 'Sport', value: 'Sport' }, { id: 'strategy', name: 'Strategy', value: 'Strategy' },
    { id: 'fighting', name: 'Fighting', value: 'Fighting' }, { id: 'arcade', name: 'Arcade', value: 'Arcade' },
    { id: 'simulator', name: 'Simulator', value: 'Simulator' }, { id: 'adventure', name: 'Adventure', value: 'Adventure' }
  ];

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl md:text-[2.5rem] font-black text-white mb-2 tracking-tighter uppercase">{getTitle()}</h1>
      <div className="flex flex-col gap-4 mt-6 mb-8 border-b border-white/5 pb-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest md:w-34">Platform Filter</span>
            <div className="flex flex-wrap gap-2">
              {platforms.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPlatformFilter(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border border-white/10 ${platformFilter === p.id ? 'bg-purple-600 text-white border-purple-500' : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {!isGenreCat && (
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest md:w-32">Genre Filter</span>
              <div className="flex flex-wrap gap-2">
                {genres.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setGenreFilter(g.value)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border border-white/10 ${genreFilter === g.value ? 'bg-purple-600 text-white border-purple-500' : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <GameGrid games={filteredGames} isLoading={isLoading} />
    </div>
  );
}
