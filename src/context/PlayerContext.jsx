// Reproductor global: cola, canción actual, audio (preview de 30 s de Deezer), volumen,
// aleatorio y bucle. Registra cada reproducción en el historial del backend.
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as musicService from '../services/music.service';
import * as statsService from '../services/stats.service';
import { useAuth } from '../hooks/useAuth';
import { loadSettings } from '../utils/localSettings';

// oxlint-disable-next-line react/only-export-components
export const PlayerContext = createContext(null);

const MIN_MS_HISTORIAL = 3000; // menos que esto no cuenta como reproducción

export function PlayerProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;

  const audioRef = useRef(null);
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(() => loadSettings(userId, 'playback').volume);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off'); // off | all | one

  // Espejo en un ref para usar el estado dentro de los eventos del <audio> sin datos viejos
  const stateRef = useRef({});
  useEffect(() => {
    stateRef.current = { queue, index, shuffle, repeat, userId };
  }, [queue, index, shuffle, repeat, userId]);
  const pasadoRef = useRef([]); // índices ya reproducidos (para "anterior" en aleatorio)
  const registroRef = useRef({ id: null, enviado: false });
  const reintentoRef = useRef(false);

  const current = index >= 0 ? queue[index] : null;

  // Crea el <audio> una sola vez
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.removeAttribute('src');
    };
  }, []);

  // Manda al historial lo escuchado de la canción actual (una sola vez por reproducción)
  const registrar = useCallback(() => {
    const audio = audioRef.current;
    const { queue: q, index: i } = stateRef.current;
    const track = q[i];
    const reg = registroRef.current;
    if (!audio || !track || reg.id !== track.id || reg.enviado) return;
    const ms = Math.round(audio.currentTime * 1000);
    if (ms < MIN_MS_HISTORIAL) return;
    reg.enviado = true;
    statsService.addHistoryEntry({ contentId: track.id, msPlayed: ms }).catch(() => {});
  }, []);

  // Índice de la canción siguiente según aleatorio y bucle; -1 si se terminó la cola
  const calcularSiguiente = useCallback((porFinal) => {
    const { queue: q, index: i, shuffle: mezcla, repeat: modo } = stateRef.current;
    if (q.length === 0) return -1;
    if (porFinal && modo === 'one') return i;
    if (mezcla && q.length > 1) {
      let n = i;
      while (n === i) n = Math.floor(Math.random() * q.length);
      return n;
    }
    if (i + 1 < q.length) return i + 1;
    return modo === 'all' ? 0 : -1;
  }, []);

  const irA = useCallback(
    (nuevo, { recordar = true } = {}) => {
      registrar();
      if (recordar && stateRef.current.index >= 0) pasadoRef.current.push(stateRef.current.index);
      setIndex(nuevo);
      setPlaying(nuevo >= 0);
      setCurrentTime(0);
    },
    [registrar]
  );

  const next = useCallback(
    (porFinal = false) => {
      const n = calcularSiguiente(porFinal);
      const audio = audioRef.current;
      if (n === -1) {
        registrar();
        setPlaying(false);
        setCurrentTime(0);
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        return;
      }
      if (n === stateRef.current.index) {
        // Bucle de una canción (o única canción en la cola): reinicia el audio
        registrar();
        registroRef.current = { id: stateRef.current.queue[n].id, enviado: false };
        audio.currentTime = 0;
        audio.play().catch(() => setPlaying(false));
        return;
      }
      irA(n);
    },
    [calcularSiguiente, irA, registrar]
  );

  const prev = useCallback(() => {
    const audio = audioRef.current;
    // Pasados 3 segundos, "anterior" reinicia la canción
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const { queue: q, index: i, shuffle: mezcla, repeat: modo } = stateRef.current;
    if (q.length === 0) return;
    if (mezcla && pasadoRef.current.length > 0) {
      irA(pasadoRef.current.pop(), { recordar: false });
    } else if (i > 0) {
      irA(i - 1, { recordar: false });
    } else if (modo === 'all') {
      irA(q.length - 1, { recordar: false });
    } else if (audio) {
      audio.currentTime = 0;
    }
  }, [irA]);

  // Carga y reproduce la canción actual cada vez que cambia
  const trackId = current?.id;
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !trackId) return undefined;
    const track = stateRef.current.queue[stateRef.current.index];
    let cancelado = false;
    registroRef.current = { id: track.id, enviado: false };
    reintentoRef.current = false;
    setError('');
    setBuffering(true);

    async function cargar() {
      try {
        let url = track.previewUrl;
        if (!url) {
          const data = await musicService.getTrack(track.externalId);
          url = data.track.previewUrl;
        }
        if (cancelado) return;
        if (!url) throw new Error('Esta canción no tiene audio disponible');
        audio.src = url;
        await audio.play();
      } catch (err) {
        if (cancelado || err.name === 'AbortError') return;
        setError(err.name === 'NotAllowedError' ? '' : err.message || 'No se pudo reproducir');
        setBuffering(false);
        setPlaying(false);
      }
    }
    cargar();
    return () => {
      cancelado = true;
    };
  }, [trackId]);

  // Eventos del <audio>
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onPlaying = () => {
      setBuffering(false);
      setPlaying(true);
    };
    const onPause = () => {
      if (!audio.ended) setPlaying(false);
    };
    const onWaiting = () => setBuffering(true);
    const onEnded = () => {
      registrar();
      const { userId: uid, repeat: modo } = stateRef.current;
      if (modo !== 'one' && loadSettings(uid, 'playback').autoplay === false) {
        setPlaying(false);
        setCurrentTime(0);
        return;
      }
      next(true);
    };
    const onError = async () => {
      // El link del preview vence: lo pedimos de nuevo una vez
      const track = stateRef.current.queue[stateRef.current.index];
      if (!track || !audio.src || reintentoRef.current) {
        setBuffering(false);
        setPlaying(false);
        if (track) setError('No se pudo reproducir esta canción');
        return;
      }
      reintentoRef.current = true;
      try {
        const data = await musicService.getTrack(track.externalId);
        audio.src = data.track.previewUrl;
        await audio.play();
      } catch {
        setBuffering(false);
        setPlaying(false);
        setError('No se pudo reproducir esta canción');
      }
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [next, registrar]);

  // Volumen
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Al entrar, se usa el volumen inicial guardado en Configuración
  useEffect(() => {
    if (userId) setVolumeState(loadSettings(userId, 'playback').volume);
  }, [userId]);

  // Al cerrar sesión se corta todo
  useEffect(() => {
    if (user) return;
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
    }
    setQueue([]);
    setIndex(-1);
    setPlaying(false);
    setCurrentTime(0);
  }, [user]);

  // ----- Acciones públicas -----

  // Reproduce una lista desde la posición indicada (reemplaza la cola)
  const playList = useCallback(
    (tracks, startIndex = 0) => {
      const lista = tracks.filter((t) => t && t.type !== 'album' && t.type !== 'artist');
      if (lista.length === 0) return;
      registrar();
      pasadoRef.current = [];
      const inicio = Math.min(Math.max(startIndex, 0), lista.length - 1);
      const audio = audioRef.current;
      // Misma canción que ya estaba cargada: el efecto de carga no se dispara, reiniciamos a mano
      if (audio && audio.src && stateRef.current.queue[stateRef.current.index]?.id === lista[inicio].id) {
        registroRef.current = { id: lista[inicio].id, enviado: false };
        audio.currentTime = 0;
        audio.play().catch(() => setPlaying(false));
      }
      stateRef.current.queue = lista;
      stateRef.current.index = inicio;
      setQueue(lista);
      setIndex(inicio);
      setPlaying(true);
      setCurrentTime(0);
    },
    [registrar]
  );

  const playTrack = useCallback((track) => playList([track], 0), [playList]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !stateRef.current.queue[stateRef.current.index]) return;
    if (audio.paused) {
      if (audio.src) audio.play().catch(() => setPlaying(false));
      else setPlaying(true);
    } else {
      audio.pause();
    }
  }, []);

  const seek = useCallback((segundos) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = segundos;
    setCurrentTime(segundos);
  }, []);

  const setVolume = useCallback((v) => setVolumeState(Math.min(1, Math.max(0, v))), []);

  const addToQueue = useCallback(
    (track) => {
      if (!track) return;
      if (stateRef.current.queue.length === 0) {
        playList([track], 0);
        return;
      }
      setQueue((q) => [...q, track]);
    },
    [playList]
  );

  // Inserta justo después de la canción actual
  const playNext = useCallback(
    (track) => {
      if (!track) return;
      if (stateRef.current.queue.length === 0) {
        playList([track], 0);
        return;
      }
      const pos = stateRef.current.index + 1;
      setQueue((q) => [...q.slice(0, pos), track, ...q.slice(pos)]);
    },
    [playList]
  );

  const removeFromQueue = useCallback(
    (posicion) => {
      const { queue: q, index: i } = stateRef.current;
      if (posicion < 0 || posicion >= q.length) return;
      const nueva = q.filter((_, p) => p !== posicion);
      if (posicion !== i) {
        setQueue(nueva);
        if (posicion < i) setIndex(i - 1);
        return;
      }
      // Se borró la que estaba sonando: pasa a la que sigue (o se corta si no queda ninguna)
      registrar();
      if (nueva.length === 0) {
        const audio = audioRef.current;
        audio.pause();
        audio.removeAttribute('src');
        setQueue([]);
        setIndex(-1);
        setPlaying(false);
        setCurrentTime(0);
        return;
      }
      const nuevoIdx = posicion < nueva.length ? posicion : 0;
      stateRef.current.queue = nueva;
      stateRef.current.index = nuevoIdx;
      setQueue(nueva);
      setIndex(nuevoIdx);
      setCurrentTime(0);
    },
    [registrar]
  );

  // Mueve una canción de una posición a otra de la cola
  const moveInQueue = useCallback((desde, hasta) => {
    const { queue: q, index: i } = stateRef.current;
    if (desde === hasta || desde < 0 || hasta < 0 || desde >= q.length || hasta >= q.length) return;
    const nueva = [...q];
    const [movida] = nueva.splice(desde, 1);
    nueva.splice(hasta, 0, movida);
    let nuevoIdx = i;
    if (i === desde) nuevoIdx = hasta;
    else if (desde < i && hasta >= i) nuevoIdx = i - 1;
    else if (desde > i && hasta <= i) nuevoIdx = i + 1;
    setQueue(nueva);
    setIndex(nuevoIdx);
  }, []);

  const playAt = useCallback((posicion) => irA(posicion), [irA]);

  const clearQueue = useCallback(() => {
    registrar();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
    }
    setQueue([]);
    setIndex(-1);
    setPlaying(false);
    setCurrentTime(0);
  }, [registrar]);

  const toggleShuffle = useCallback(() => {
    pasadoRef.current = [];
    setShuffle((s) => !s);
  }, []);

  const cycleRepeat = useCallback(() => setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off')), []);

  const goNext = useCallback(() => next(false), [next]);

  const value = useMemo(
    () => ({
      queue,
      index,
      current,
      playing,
      buffering,
      error,
      currentTime,
      duration,
      volume,
      shuffle,
      repeat,
      playList,
      playTrack,
      togglePlay,
      next: goNext,
      prev,
      seek,
      setVolume,
      addToQueue,
      playNext,
      removeFromQueue,
      moveInQueue,
      playAt,
      clearQueue,
      toggleShuffle,
      cycleRepeat,
    }),
    [
      queue, index, current, playing, buffering, error, currentTime, duration, volume, shuffle, repeat,
      playList, playTrack, togglePlay, goNext, prev, seek, setVolume, addToQueue, playNext,
      removeFromQueue, moveInQueue, playAt, clearQueue, toggleShuffle, cycleRepeat,
    ]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
