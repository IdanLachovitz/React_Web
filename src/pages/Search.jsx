import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { searchGames } from '../api';
import GameGrid from '../components/GameGrid';

export default function Search() {
  const [query, setQuery] = useState('');
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    setHasSearched(true);
    try {
      const data = await searchGames(query);
      setGames(data);
    } catch (err) {
      console.error(err);
      setGames([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-[2.5rem] font-black text-white mb-2 tracking-tighter">
              DISCOVER <span className="text-purple-500">TITLES</span>
          </h1>
      </div>
      
      <div className="relative max-w-2xl group mb-4 z-20">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon size={20} className="text-gray-500 group-focus-within:text-purple-500 transition-colors" />
          </div>
          <input 
              type="text" 
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Type a game name..."
              className="block w-full pl-12 pr-4 sm:pr-32 py-4 bg-[#1f1f23] border-2 border-transparent text-white placeholder-gray-500 rounded-xl focus:ring-0 focus:border-purple-600 transition-all font-inter text-left"
          />
          <button 
              onClick={handleSearch}
              className="sm:absolute right-2 top-2 bottom-2 mt-2 sm:mt-0 px-6 py-3 sm:py-0 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 active:scale-95 transition-all w-full sm:w-auto"
          >
              Search
          </button>
      </div>

      {!hasSearched ? (
        <div className="text-center flex flex-col items-center relative pt-0 -mt-8">
            <div className="relative mt-2">
                <img alt="Gaming Controller" className="opacity-100 h-auto w-[150px]" src="https://cdn-icons-png.magnific.com/128/8002/8002123.png" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e10] via-transparent to-transparent"></div>
            </div>
            <p className="text-gray-500 mt-6 font-bold uppercase tracking-[0.3em] text-xs">Enter a search command to begin discovery</p>
        </div>
      ) : (
        <GameGrid games={games} isLoading={isLoading} />
      )}
    </div>
  );
}
