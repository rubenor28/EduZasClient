import { useState, useEffect } from "react";
import { apiGet } from "@application";
import { NotFoundError } from "@application";
import type { ClassProfessor } from "@domain";

/**
 * Hook para obtener la relación entre un usuario y una clase.
 * Útil para determinar si un usuario es profesor o propietario de una clase específica.
 *
 * @param classId - ID de la clase.
 * @param userId - ID del usuario.
 * @returns Objeto con la relación, estado de carga y error.
 */
export const useClassProfessorRelation = (classId?: string, userId?: number) => {
  const [relation, setRelation] = useState<ClassProfessor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // No fetch if ids are not provided
    if (!classId || !userId) {
      setRelation(null);
      return;
    }

    const fetchRelation = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiGet<ClassProfessor>(
          `/classes/professors/${classId}/${userId}`
        );
        setRelation(result);
      } catch (e) {
        // A 404 is expected if the user is not a professor in that class, treat it as a null relation
        if (e instanceof NotFoundError) {
          setRelation(null);
        } else {
          setError(e instanceof Error ? e : new Error("Error fetching relation"));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelation();
  }, [classId, userId]);

  return { relation, isLoading, error };
};
