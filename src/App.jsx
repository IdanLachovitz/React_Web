import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Category from './pages/Category';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="library" element={<Category />} />
          <Route path="recommendations" element={<Category />} />
          <Route path="category/:id" element={<Category />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
