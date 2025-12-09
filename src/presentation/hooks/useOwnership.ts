import { useState, useEffect } from "react";
import { apiGet, NotFoundError } from "@application";
import type { Class, ClassProfessor } from "@domain";
import { useUser } from "@presentation";

/**
 * Hook para verificar si el usuario actual es propietario de una lista de clases.
 *
 * @param classes - Lista de clases a verificar.
 * @returns Un mapa donde la clave es el ID de la clase y el valor es `true` si es propietario.
 *
 * @remarks
 * **Nota de Rendimiento:** Actualmente realiza una petición por cada clase (problema N+1).
 * Idealmente, el backend debería devolver esta información en la lista de clases.
 */
export const useOwnership = (classes: Class[] | undefined) => {
  const { user } = useUser();
  const [ownershipMap, setOwnershipMap] = useState<Map<string, boolean>>(
    new Map(),
  );

  useEffect(() => {
    if (!classes || classes.length === 0) {
      setOwnershipMap(new Map());
      return;
    }

    let isMounted = true;

    const fetchOwnership = async () => {
      const promises = classes.map(async (classData) => {
        try {
          const relation = await apiGet<ClassProfessor>(
            `/classes/professors/${classData.id}/${user.id}`,
          );
          return [classData.id, relation.isOwner] as const;
        } catch (error) {
          if (error instanceof NotFoundError) {
            return [classData.id, false] as const;
          }
          // Para otros errores, asumimos que no es propietario para estar seguros.
          console.error(
            `Error fetching ownership for class ${classData.id}:`,
            error,
          );
          return [classData.id, false] as const;
        }
      });

      const results = await Promise.all(promises);

      if (isMounted) {
        setOwnershipMap(new Map(results));
      }
    };

    fetchOwnership();

    return () => {
      isMounted = false;
    };
  }, [classes, user.id]);

  return ownershipMap;
};
