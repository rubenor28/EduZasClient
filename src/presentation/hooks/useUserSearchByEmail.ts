import { useState, useCallback } from "react";
import { apiGet } from "@application";
import type { User } from "@domain";
import { NotFoundError } from "@application";

/**
 * Hook para buscar un usuario por su correo electrónico.
 * Valida el formato del email antes de realizar la petición.
 *
 * @returns Objeto con el usuario encontrado (si existe), estado de carga y error.
 */
export const useUserSearchByEmail = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUser = useCallback(async (email: string) => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Introduce un email válido.");
      setUser(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setUser(null);

    try {
      const foundUser = await apiGet<User>(`/users/${email}`);
      setUser(foundUser);
    } catch (e) {
      if (e instanceof NotFoundError) {
        setError("No se encontró ningún usuario con ese email.");
      } else {
        const fetchError = e instanceof Error ? e.message : "Error desconocido";
        setError(fetchError);
        console.error(`Error fetching user by email ${email}:`, fetchError);
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setUser(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return { user, isLoading, error, searchUser, reset };
};
