// Estructura de las páginas privadas: sidebar + navbar + contenido de la ruta + reproductor
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import PlayerBar from '../player/PlayerBar';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="layout__main">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="layout__content">
          <Outlet />
        </main>
      </div>
      <PlayerBar />
    </div>
  );
}
