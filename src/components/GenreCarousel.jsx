import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const genres = [
  { id: 12, name: 'RPG', subtitle: 'The Legend Awaits', img: 'https://i.pinimg.com/736x/6f/57/c7/6f57c7e116e497d6a9aa736c04b612ae.jpg' },
  { id: 5, name: 'Shooter', subtitle: 'Master the Craft', img: 'https://w0.peakpx.com/wallpaper/954/59/HD-wallpaper-battlefield-battlefield-3.jpg' },
  { id: 10, name: 'Racing', subtitle: 'Full Throttle', img: 'https://wallpapercat.com/w/full/d/4/3/1506648-1080x1920-samsung-full-hd-racing-game-wallpaper.jpg' },
  { id: 14, name: 'Sport', subtitle: 'Be the Champion', img: 'https://img.magnific.com/free-photo/soccer-sport-environment-filed_23-2151891691.jpg' },
  { id: 15, name: 'Strategy', subtitle: 'Master the Plan', img: 'https://wallpapercave.com/wp/wp7570046.jpg' },
  { id: 4, name: 'Fighting', subtitle: 'Face Your Fate', img: 'https://i.pinimg.com/474x/f8/6c/51/f86c51a9f0b99dd67678c25dfa2cdafa.jpg' },
  { id: 31, name: 'Adventure', subtitle: 'Discover the World', img: 'https://i.pinimg.com/736x/c7/2a/e1/c72ae1449b7718cc2c5fd6203e2bc493.jpg' },
  { id: 33, name: 'Arcade', subtitle: 'Pure Nostalgia', img: 'https://w0.peakpx.com/wallpaper/141/581/HD-wallpaper-arcade-arcade-cabinet-video-games-indoors-capcom-japan.jpg' },
  { id: 13, name: 'Simulator', subtitle: 'Live the Reality', img: 'https://w0.peakpx.com/wallpaper/387/137/HD-wallpaper-iracing-indy-car-games-pc-race-car-racing-sim-simulation.jpg' },
];

export default function GenreCarousel() {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const navigate = useNavigate();

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX);
    if (Math.abs(walk) > 5) setHasDragged(true);
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleGenreClick = (id, e) => {
    if (hasDragged) {
      e.preventDefault();
      return;
    }
    navigate(`/category/${id}`);
  };

  return (
    <div className="mt-5">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] italic mb-2">
                  Explore by Genre
              </h2>
          </div>
      </div>
      <div 
        id="genreScrollContainer"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onMouseMove={handleMouseMove}
        className={`flex overflow-x-auto gap-6 pb-8 pt-10 -mt-16 -mb-12 pl-12 pr-10 -ml-12 -mr-12 snap-x snap-mandatory custom-scrollbar scroll-pl-14 ${isDragging ? 'active-scroll' : ''}`}
      >
        {genres.map(genre => (
          <div 
            key={genre.id}
            onClick={(e) => handleGenreClick(genre.id, e)}
            className="relative h-[350px] w-[225px] rounded-3xl overflow-hidden group cursor-pointer border border-black transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_50px_-10px_rgba(147,51,234,0.5)] hover:border-purple-600/50 snap-start shrink-0"
          >
              <img src={genre.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:brightness-110" alt={genre.name} />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 group-hover:from-purple-1000/5 transition-colors duration-500"></div>
              <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
                  <div className="w-[175px] py-5 bg-black/25 backdrop-blur-[1.5px] border border-black/10 rounded-2xl flex flex-col items-center justify-center transition-all duration-500 group-hover:bg-black/50 group-hover:border-black/10 group-hover:scale-105">
                      <span className="text-3xl font-black text-white italic tracking-tighter uppercase drop-shadow-[1px_1px_1px_rgba(0,0,0,1)]">{genre.name}</span>
                      <span className="text-[9px] text-purple-400 font-black tracking-[0.4em] uppercase mt-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 drop-shadow-[1px_1px_1px_rgba(0,0,0,1)]">{genre.subtitle}</span>
                  </div>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}
