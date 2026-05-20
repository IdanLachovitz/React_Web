// משיכת כתובת ה-API מתוך משתני הסביבה (או שימוש ב-Localhost כגיבוי למחשב המקומי)
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const fetchCategory = async (id, token = null) => {
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  let endpoint = `/category/${id}`;
  if (id === 'library') endpoint = '/library';
  if (id === 'recommendations') endpoint = '/recommendations';

  // חיבור הכתובת המלאה של שרת הפייתון עם ה-endpoint הנכון
  const response = await fetch(`${API_URL}${endpoint}`, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch category ${id}`);
  }
  return response.json();
};

export const searchGames = async (query) => {
  // חיבור הכתובת המלאה של שרת הפייתון גם עבור פונקציית החיפוש
  const response = await fetch(`${API_URL}/search/${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Search failed');
  }
  return response.json();
};