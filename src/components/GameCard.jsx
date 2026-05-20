import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlayCircle, Check, Plus } from 'lucide-react';
import GameModal from './GameModal';
import RemoveConfirmModal from './RemoveConfirmModal';

export default function GameCard({ game }) {
  const { libraryIds, addToLibrary, removeFromLibrary, user, setIsLoginRequiredModalOpen } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const isInLibrary = libraryIds.has(game.id);
  const rating = (game.total_rating !== undefined && game.total_rating !== null) ? Math.round(game.total_rating) + '%' : 'N/A';
  const cover = game.cover_url || 'https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?q=80&w=2067&auto=format&fit=crop';
  const genre = game.genres && game.genres.length > 0 ? game.genres[0].name : 'Game';
  const developer = game.involved_companies && game.involved_companies.find(c => c.developer) ? game.involved_companies.find(c => c.developer).company.name : 'Unknown';

  const handleLibraryToggle = async (e) => {
    e.stopPropagation();
    if (!user) {
      setIsLoginRequiredModalOpen(true);
      return;
    }
    if (isInLibrary) {
      setIsRemoveModalOpen(true);
    } else {
      await addToLibrary(game.id);
    }
  };

  const handlePlayTrailer = (e) => {
    e.stopPropagation();
    setIsPlaying(true);
  };

  return (
    <>
      <div 
        className="game-card bg-[#1f1f23] rounded-xl overflow-hidden border border-white/5 transition-all duration-300 cursor-pointer group flex flex-col" 
        onClick={() => setIsModalOpen(true)}
      >
        <div className="aspect-[3/4] bg-[#2a2a2c] relative overflow-hidden shrink-0">
          {isPlaying ? (
            <div className="absolute inset-0 z-20 bg-black">
                <iframe className="w-full h-full" src={`${game.trailer_url}?autoplay=1&mute=1`} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                <button onClick={(e) => {e.stopPropagation(); setIsPlaying(false)}} className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white hover:bg-black transition-colors z-30">
                    <span className="material-symbols-outlined text-xs">close</span>
                </button>
            </div>
          ) : (
            <>
              <img alt={game.name} className="w-full h-full object-cover" src={cover} loading="lazy"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                  <div className="game-rating">{rating}</div>
                  {game.total_rating_count && <div className="text-[9px] text-white/70 font-bold bg-black/60 px-1.5 py-0.5 rounded-lg backdrop-blur-sm border border-white/10 tracking-tight">{game.total_rating_count.toLocaleString()} reviews</div>}
              </div>
              {game.trailer_url && (
                <button onClick={handlePlayTrailer} className="absolute top-2 left-2 p-1 bg-purple-600/80 rounded-lg text-white md:opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-purple-600">
                    <PlayCircle size={16} />
                </button>
              )}
              <button 
                onClick={handleLibraryToggle} 
                className={`absolute top-10 left-2 p-1 ${isInLibrary ? 'bg-purple-600 md:hover:bg-red-600' : 'bg-white/10 md:hover:bg-purple-600'} rounded-lg text-white md:opacity-0 group-hover:opacity-100 transition-opacity z-20`}
                title={isInLibrary ? 'Remove from Library' : 'Add to Library'}
              >
                  {isInLibrary ? <Check size={16} /> : <Plus size={16} />}
              </button>
            </>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1 justify-between gap-3">
            <div className="space-y-2">
            <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest block mb-0.5">{genre}</span>
                <p className="text-white font-bold truncate text-sm leading-tight">{game.name}</p>
            <p className="text-[11px] text-gray-400 font-medium truncate -mt-1">{developer}</p>
                <div className="flex flex-wrap gap-1">
                    {(game.platforms || []).map(p => (
                        <span key={p.id} className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-gray-400 font-bold">
                            {p.abbreviation || p.name}
                        </span>
                    ))}
                </div>
            </div>
            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[9px] text-gray-500 font-black uppercase tracking-tighter">Released</span>
                    <span className="text-[10px] text-gray-300 font-bold">{game.release_date_formatted || 'TBA'}</span>
                </div>
            </div>
        </div>
      </div>
      {isModalOpen && <GameModal game={game} onClose={() => setIsModalOpen(false)} />}
      {isRemoveModalOpen && <RemoveConfirmModal gameId={game.id} onClose={() => setIsRemoveModalOpen(false)} />}
    </>
  );
}
