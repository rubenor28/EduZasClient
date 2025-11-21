import { useState, useEffect } from 'react';

/**
 * Hook que retrasa la actualización de un valor.
 *
 * @param value El valor a "debounced".
 * @param delay El tiempo de espera en milisegundos.
 * @returns El valor después del tiempo de espera.
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Establece un temporizador para actualizar el valor debounced
    // después del retraso especificado
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Función de limpieza que se ejecuta si el valor cambia antes
    // de que se complete el retraso. Cancela el temporizador anterior.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Solo se vuelve a ejecutar si el valor o el retraso cambian

  return debouncedValue;
};
