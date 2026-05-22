const express = require('express');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = 8000;

// Enable CORS so your React app on port 5173 can talk to this server
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.VITE_IGDB_CLIENT_ID;
const CLIENT_SECRET = process.env.VITE_IGDB_CLIENT_SECRET;
let cachedToken = null;

// --- IGDB HELPERS ---
const getIGDBToken = async () => {
    if (cachedToken) return cachedToken;
    const response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`, {
        method: 'POST'
    });
    const data = await response.json();
    cachedToken = data.access_token;
    return cachedToken;
};

const GAME_FIELDS = "fields name, rating, total_rating, aggregated_rating, first_release_date, genres.name, platforms.name, platforms.abbreviation, cover.url, category";

const igdbFetch = async (endpoint, query) => {
    const token = await getIGDBToken();
    const response = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
        method: 'POST',
        headers: {
            'Client-ID': CLIENT_ID,
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'text/plain'
        },
        body: query
    });

    const data = await response.json();
    return data.map(game => ({
        id: game.id,
        name: game.name,
        rating: game.total_rating ? Math.round(game.total_rating) : (game.rating ? Math.round(game.rating) : (game.aggregated_rating ? Math.round(game.aggregated_rating) : 0)),
        release_date: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString().split('T')[0] : 'N/A',
        genres: game.genres || [],
        platforms: game.platforms || [],
        cover_url: game.cover?.url
            ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}`
            : 'https://via.placeholder.com/264x352?text=No+Cover'
    }));
};

// --- DATABASE PERSISTENCE ---
const DB_PATH = './db.json';
const getDB = () => {
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }));
    return JSON.parse(fs.readFileSync(DB_PATH));
};
const saveDB = (db) => fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

// --- AUTH ROUTES ---
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const db = getDB();
    if (db.users.find(u => u.username === username)) return res.status(400).json({ detail: "User already exists" });
    db.users.push({ username, password, library: [] });
    saveDB(db);
    res.json({ status: "success" });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const db = getDB();
    const user = db.users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ detail: "Invalid credentials" });
    res.json({ username, access_token: `bearer_${username}` });
});

// --- LIBRARY ROUTES ---
app.get('/library/ids', (req, res) => {
    const auth = req.headers.authorization;
    const username = auth?.split('_')[1];
    const user = getDB().users.find(u => u.username === username);
    res.json(user ? user.library : []);
});

app.post('/library/add/:id', (req, res) => {
    const username = req.headers.authorization?.split('_')[1];
    const gameId = parseInt(req.params.id);
    const db = getDB();
    const user = db.users.find(u => u.username === username);
    if (user && !user.library.includes(gameId)) {
        user.library.push(gameId);
        saveDB(db);
    }
    res.json({ status: "success" });
});

app.delete('/library/remove/:id', (req, res) => {
    const username = req.headers.authorization?.split('_')[1];
    const gameId = parseInt(req.params.id);
    const db = getDB();
    const user = db.users.find(u => u.username === username);
    if (user) {
        user.library = user.library.filter(id => id !== gameId);
        saveDB(db);
    }
    res.json({ status: "success" });
});

// --- DATA ROUTES ---
app.get('/category/:id', async (req, res) => {
    const { id } = req.params;
    const now = Math.floor(Date.now() / 1000);
    const month = 30 * 24 * 60 * 60;

    if (id === 'library') {
        const username = req.headers.authorization?.split('_')[1];
        const user = getDB().users.find(u => u.username === username);
        if (!user || user.library.length === 0) return res.json([]);
        return res.json(await igdbFetch('games', `${GAME_FIELDS}; where id = (${user.library.join(',')});`));
    }

    let query = "";
    switch (id) {
        case 'top': query = `${GAME_FIELDS}; where total_rating != null & category = 0; sort total_rating desc; limit 40;`; break;
        case 'new-releases': query = `${GAME_FIELDS}; where first_release_date < ${now} & first_release_date > ${now - month} & category = 0; sort first_release_date desc; limit 40;`; break;
        case 'upcoming': query = `${GAME_FIELDS}; where first_release_date > ${now} & category = 0; sort first_release_date asc; limit 40;`; break;
        case 'trends': query = `${GAME_FIELDS}; where (hypes > 0 | popularity > 0) & category = 0; sort popularity desc; limit 40;`; break;
        default: query = `${GAME_FIELDS}; where genres = (${id}) & category = 0; sort popularity desc; limit 40;`; break;
    }
    res.json(await igdbFetch('games', query));
});

app.get('/recommendations', async (req, res) => {
    res.json(await igdbFetch('games', `${GAME_FIELDS}; where total_rating > 85 & category = 0; sort popularity desc; limit 4;`));
});

app.get('/search/:query', async (req, res) => {
    res.json(await igdbFetch('games', `${GAME_FIELDS}; search "${req.params.query}"; where category = 0; limit 50;`));
});

app.listen(PORT, () => console.log(`Node.js Server running on http://localhost:${PORT}`));