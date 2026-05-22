export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// --- REWRITTEN API ENDPOINTS ---
export const fetchCategory = async (id, token = null) => {
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  let endpoint = `/category/${id}`;
  if (id === 'recommendations') endpoint = '/recommendations';

  const response = await fetch(`${API_URL}${endpoint}`, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch category ${id}`);
  }
  return response.json();
};

export const searchGames = async (query) => {
  const response = await fetch(`${API_URL}/search/${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Search failed');
  }
  return response.json();
};

// --- AUTHENTICATION & LIBRARY ACTIONS ---
export const localLogin = async (username, password) => {
  return fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
};

export const localRegister = async (username, password) => {
  return fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
};

export const fetchLocalLibraryIds = async (token) => {
  return fetch(`${API_URL}/library/ids`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

export const addLocalToLibrary = async (gameId, token) => {
  return fetch(`${API_URL}/library/add/${gameId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

export const removeLocalFromLibrary = async (gameId, token) => {
  return fetch(`${API_URL}/library/remove/${gameId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
};