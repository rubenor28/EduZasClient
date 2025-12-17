import { useState, useCallback, useEffect } from 'react';

/**
 * Hook personalizado para manejar el estado local inicializado por un prop (initialState)
 * y notificar a una función de callback (onChange) cada vez que el estado interno cambia.
 *
 * Este hook es ideal para crear componentes controlados que encapsulan su propia lógica
 * de estado, pero que también reportan su valor actualizado al componente padre.
 *
 * @param initialState El valor inicial (prop) del estado.
 * @param onChange El callback que notifica al padre con el nuevo estado (newState: T).
 * @returns [state, update] donde 'state' es el valor actual y 'update' es la función para actualizarlo.
 */
export function useControlledState<T>(
  initialState: T,
  onChange: (newState: T) => void,
): [T, (updater: (prev: T) => T) => void] {
  // Manejar el estado interno
  // Usamos la prop initialState como valor inicial.
  const [state, setState] = useState<T>(initialState);

  // Sincroniza el estado interno si el prop `initialState` cambia desde el padre.
  // Esto es crucial para evitar que el estado se vuelva obsoleto (stale).
  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  // Crear la función centralizada de actualización y notificación
  // Usamos useCallback para memoizar 'update', ya que onChange y setState son dependencias estables.
  const update = useCallback(
    (updater: (prev: T) => T) => {
      setState((prev: T) => {
        // Calcular el nuevo estado
        const newState = updater(prev);

        // Notificar al componente padre con el estado más reciente
        onChange(newState);

        // Devolver el nuevo estado para la actualización local
        return newState;
      });
    },
    [onChange] // Solo necesitamos onChange como dependencia
  );

  // Retornar el estado actual y la función de actualización
  return [state, update];
}
