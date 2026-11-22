// Carga datos de una pantalla manejando los tres estados: cargando, error y datos.
// fetcher: función que devuelve una promesa. deps: cuando cambian, vuelve a pedir.
// Devuelve { data, loading, error, reload, setData }
import { useCallback, useEffect, useState } from 'react';

export function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let cancelado = false;
    setState((prev) => ({ ...prev, loading: true, error: '' }));
    fetcher()
      .then((data) => !cancelado && setState({ data, loading: false, error: '' }))
      .catch((err) => !cancelado && setState({ data: null, loading: false, error: err.message }));
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, intento]);

  const reload = useCallback(() => setIntento((n) => n + 1), []);
  const setData = useCallback((data) => setState((prev) => ({ ...prev, data })), []);

  return { ...state, reload, setData };
}
