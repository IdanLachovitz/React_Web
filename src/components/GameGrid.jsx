import { useState, useEffect } from 'react';
import GameCard from './GameCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function GameGrid({ games, isLoading }) {
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 16;
  
  // Reset pagination when games change
  useEffect(() => {
    setCurrentPage(1);
  }, [games]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="responsive-grid">
          {[...Array(gamesPerPage)].map((_, i) => (
            <div key={i} className="animate-pulse bg-[#1f1f23] rounded-xl overflow-hidden border border-white/5">
                <div className="aspect-[3/4] bg-white/5"></div>
                <div className="p-4 space-y-3">
                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                    <div className="flex gap-1">
                        <div className="h-3 bg-white/10 rounded w-8"></div>
                        <div className="h-3 bg-white/10 rounded w-8"></div>
                    </div>
                    <div className="pt-3 border-t border-white/5 flex justify-between">
                        <div className="h-3 bg-white/10 rounded w-12"></div>
                        <div className="h-3 bg-white/10 rounded w-8"></div>
                    </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!games || games.length === 0) {
    return (
      <div className="w-full">
        <div className="col-span-full py-20 text-center text-gray-500 uppercase tracking-widest text-xs">
          No entries found.
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(games.length / gamesPerPage);
  const start = (currentPage - 1) * gamesPerPage;
  const gamesToDisplay = games.slice(start, start + gamesPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPageNumbers = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (totalPages > 5) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
          pages.push(
            <button key={i} onClick={() => handlePageChange(i)} className={`w-10 h-10 rounded-lg font-bold transition-colors ${currentPage === i ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
              {i}
            </button>
          );
        } else if (i === currentPage - 2 || i === currentPage + 2) {
          pages.push(<span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-gray-600">...</span>);
        }
      } else {
        pages.push(
          <button key={i} onClick={() => handlePageChange(i)} className={`w-10 h-10 rounded-lg font-bold transition-colors ${currentPage === i ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
            {i}
          </button>
        );
      }
    }
    return pages;
  };

  return (
    <div className="w-full">
      <div className="responsive-grid">
        {gamesToDisplay.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-8 mt-8">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 disabled:opacity-20 disabled:cursor-not-allowed"
            >
                <ChevronLeft size={24} />
            </button>
            <div className="flex gap-1">
                {renderPageNumbers()}
            </div>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 disabled:opacity-20 disabled:cursor-not-allowed"
            >
                <ChevronRight size={24} />
            </button>
        </div>
      )}
    </div>
  );
}
