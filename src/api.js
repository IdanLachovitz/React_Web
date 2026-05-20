export const fetchCategory = async (id, token = null) => {
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  let endpoint = `/category/${id}`;
  if (id === 'library') endpoint = '/library';
  if (id === 'recommendations') endpoint = '/recommendations';

  const response = await fetch(endpoint, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch category ${id}`);
  }
  return response.json();
};

export const searchGames = async (query) => {
  const response = await fetch(`/search/${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Search failed');
  }
  return response.json();
};
