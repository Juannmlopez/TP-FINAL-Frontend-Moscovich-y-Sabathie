// Acceso al reproductor global desde cualquier componente
import { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer tiene que usarse dentro de <PlayerProvider>');
  }
  return context;
}
