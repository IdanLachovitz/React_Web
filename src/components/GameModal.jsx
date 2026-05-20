import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, PlayCircle, Star } from 'lucide-react';
import RemoveConfirmModal from './RemoveConfirmModal';

export default function GameModal({ game, onClose }) {
  const { libraryIds, addToLibrary, removeFromLibrary, user, setIsLoginRequiredModalOpen } = useAuth();
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const isInLibrary = libraryIds.has(game.id);
  const rating = game.total_rating ? Math.round(game.total_rating) + '%' : 'N/A';
  const genre = game.genres && game.genres.length > 0 ? game.genres[0].name : 'Game';
  const summary = game.summary || 'No description available for this title.';
  const releaseDate = game.release_date_formatted || 'TBA';
  const developer = game.involved_companies && game.involved_companies.find(c => c.developer) ? game.involved_companies.find(c => c.developer).company.name : 'Unknown';

  const handleLibraryToggle = async () => {
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

  return (
    <div className="modal fixed inset-0 z-[100]">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl mx-auto glass-modal border border-white/10 sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full sm:h-auto sm:min-h-[60vh] sm:max-h-[90vh] sm:my-8">
        <div className="p-4 md:p-6 lg:p-8 flex justify-between items-start border-b border-white/10 sticky top-0 bg-[#1f1f23] z-10 sm:relative">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white italic tracking-tighter text-left pr-8">{game.name}</h2>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="aspect-video bg-black rounded-xl overflow-hidden border border-white/10 relative group">
                {isPlayingTrailer ? (
                    <iframe className="w-full h-full" src={`${game.trailer_url}?autoplay=1`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                ) : (
                  <>
                    {game.trailer_url && (
                        <button className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors z-10" onClick={() => setIsPlayingTrailer(true)}>
                            <PlayCircle size={64} className="text-white opacity-80" />
                        </button>
                    )}
                    <img alt="Media" className="w-full h-full object-cover opacity-60" src={game.screenshot_urls && game.screenshot_urls.length > 0 ? game.screenshot_urls[0] : (game.cover_url || '')} loading="lazy"/>
                  </>
                )}
              </div>
              <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-purple-500">description</span> Overview
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-lg">{summary}</p>
              </div>
              {game.screenshot_urls && game.screenshot_urls.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-purple-500">gallery_thumbnail</span> Screenshots
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {game.screenshot_urls.slice(0, 3).map((url, i) => (
                            <div key={i} className="aspect-video rounded-lg bg-[#2a2a2c] overflow-hidden border border-white/5">
                                <img className="w-full h-full object-cover" src={url} loading="lazy"/>
                            </div>
                        ))}
                    </div>
                </div>
              )}
            </div>
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-6">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Critics Rating</p>
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <span className="text-4xl font-black text-[#00e479]">{rating}</span>
                                {game.total_rating_count && <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{game.total_rating_count.toLocaleString()} reviews</span>}
                            </div>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className={i < (game.total_rating / 20) ? 'text-yellow-500 fill-current' : 'text-gray-600'} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Release Date</p>
                            <p className="text-white font-semibold">{releaseDate}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Genre</p>
                            <p className="text-white font-semibold">{genre}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Developer</p>
                            <p className="text-white font-semibold">{developer}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Platforms</p>
                        <div className="flex flex-wrap gap-2">
                            {(game.platforms || []).map(p => (
                                <span key={p.id} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white font-bold">{p.abbreviation || p.name}</span>
                            ))}
                        </div>
                    </div>
                    <button 
                        onClick={handleLibraryToggle} 
                        className={`w-full py-4 ${isInLibrary ? 'bg-red-600 hover:bg-red-700 shadow-red-900/40' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-900/40'} text-white font-bold rounded-xl transition-all shadow-lg`}
                    >
                        {isInLibrary ? 'REMOVE FROM LIBRARY' : 'ADD TO LIBRARY'}
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
      {isRemoveModalOpen && <RemoveConfirmModal gameId={game.id} onClose={() => setIsRemoveModalOpen(false)} />}
    </div>
  );
}
