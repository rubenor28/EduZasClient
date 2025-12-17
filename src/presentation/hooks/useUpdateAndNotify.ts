import React, { useCallback } from 'react';

/**
 * Hook personalizado para manejar la actualización del estado local
 * y notificar a un componente padre (o cualquier callback onChange) en un solo paso.
 *
 * @param dispatcher La función setState de useState (e.g., setState<T>).
 * @param onChange El callback que notifica al padre (debe recibir el estado completo y actualizado).
 * @returns Una función 'update' que acepta una función 'updater' (igual que setState).
 */
export function useUpdateAndNotify<T>(
  dispatcher: React.Dispatch<React.SetStateAction<T>>,
  onChange: (newState: T) => void,
): (updater: (prev: T) => T) => void {
  // Usamos useCallback para memoizar la función 'update' y evitar
  // que cambie en cada renderizado (siempre que dispatcher y onChange no cambien).
  const update = useCallback(
    (updater: (prev: T) => T) => {
      // Usamos la forma funcional del dispatcher
      dispatcher((prev: T) => {
        // Calcular el nuevo estado
        const newState = updater(prev);
        
        // Notificar al componente padre con el estado más reciente
        onChange(newState);

        // Devolver el nuevo estado para la actualización local
        return newState;
      });
    },
    [dispatcher, onChange]
  );

  return update;
}
