// Todas las rutas de la app: públicas (inicio, login, registro) y privadas (con layout)
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import MainLayout from '../components/layout/MainLayout';
import Welcome from '../pages/Welcome/Welcome';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Home from '../pages/Home/Home';
import Search from '../pages/Search/Search';
import Artist from '../pages/Artist/Artist';
import Album from '../pages/Album/Album';
import Track from '../pages/Track/Track';
import Library from '../pages/Library/Library';
import Collections from '../pages/Collections/Collections';
import CollectionDetail from '../pages/CollectionDetail/CollectionDetail';
import Profile from '../pages/Profile/Profile';
import Stats from '../pages/Stats/Stats';
import Settings from '../pages/Settings/Settings';
import NotFound from '../pages/NotFound/NotFound';

export default function AppRouter() {
  return (
    <Routes>
      {/* Públicas: si ya hay sesión, mandan a / */}
      <Route element={<PublicRoute />}>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Privadas: requieren sesión y usan el layout con sidebar y navbar */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/artist/:id" element={<Artist />} />
          <Route path="/album/:id" element={<Album />} />
          <Route path="/track/:id" element={<Track />} />
          <Route path="/library" element={<Library />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:id" element={<CollectionDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
