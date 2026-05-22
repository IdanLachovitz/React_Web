import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchLocalLibraryIds, addLocalToLibrary, removeLocalFromLibrary } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [libraryIds, setLibraryIds] = useState(new Set());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] = useState(false);
  const [gameCache, setGameCache] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('gs_user');
    const storedToken = localStorage.getItem('gs_token');
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
      fetchLibraryIds(storedToken).finally(() => setIsAuthLoading(false));
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  const fetchLibraryIds = async (authToken) => {
    try {
      const res = await fetchLocalLibraryIds(authToken);
      if (res.ok) {
        const ids = await res.json();
        setLibraryIds(new Set(ids));
      }
    } catch (e) {
      console.error("Library sync failed:", e);
    }
  };

  const login = (username, jwtToken) => {
    localStorage.setItem('gs_token', jwtToken);
    localStorage.setItem('gs_user_id', jwtToken); // The old app used the token as gs_user_id
    localStorage.setItem('gs_user', username);
    localStorage.setItem('gs_username', username);
    localStorage.setItem('gs_last_active', Date.now());
    setUser(username);
    setToken(jwtToken);
    setGameCache({}); // Clear cache on login to refresh user-specific data
    fetchLibraryIds(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem('gs_token');
    localStorage.removeItem('gs_user_id');
    localStorage.removeItem('gs_user');
    localStorage.removeItem('gs_username');
    localStorage.removeItem('gs_last_active');
    setUser(null);
    setToken(null);
    setGameCache({}); // Clear cache on logout
    setLibraryIds(new Set());
    showToast(`You have been logged out from ${user}.`);
  };

  const updateGameCache = useCallback((key, data) => {
    setGameCache(prev => ({ ...prev, [key]: data }));
  }, []);

  const showToast = (message, duration = 2000) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, duration);
  };

  const addToLibrary = async (gameId) => {
    if (!token) return false;
    const res = await addLocalToLibrary(gameId, token);
    if (res.ok || res.status === 400) {
      setLibraryIds(prev => new Set([...prev, gameId]));
      // Invalidate library and recommendations cache so they refresh on next view
      setGameCache(prev => {
        const newCache = { ...prev };
        delete newCache['library'];
        delete newCache['recommendations'];
        return newCache;
      });
      return true;
    }
    return false;
  };

  const removeFromLibrary = async (gameId) => {
    if (!token) return false;
    const res = await removeLocalFromLibrary(gameId, token);
    if (res.ok) {
      setLibraryIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(gameId);
        return newSet;
      });
      // Invalidate library and recommendations cache so they refresh on next view
      setGameCache(prev => {
        const newCache = { ...prev };
        delete newCache['library'];
        delete newCache['recommendations'];
        return newCache;
      });
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user, token, libraryIds, login, logout, addToLibrary, removeFromLibrary,
      isAuthModalOpen, setIsAuthModalOpen,
      isLoginRequiredModalOpen, setIsLoginRequiredModalOpen,
      toastMessage, showToast, isAuthLoading,
      gameCache, updateGameCache
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
