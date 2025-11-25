import { useState, useEffect } from "react";
import { apiGet, NotFoundError } from "@application";
import type { Class } from "@domain";
import { useUser } from "@presentation";

/**
 * @deprecated Este type se usa para la relacion de un profesor con una clase
 * en el backend, es probable que se mueva a @domain
 */
type ClassProfessor = {
  classId: string;
  userId: number;
  isOwner: boolean;
};

/**
 * Hook para determinar la propiedad (ownership) de un conjunto de clases para el usuario actual.
 *
 * @param classes - Un array de objetos `Class` para los cuales se verificará la propiedad.
 * @returns Un `Map<string, boolean>` donde la clave es el ID de la clase y el valor es `true` si el usuario actual es propietario, de lo contrario `false`.
 *
 * @remarks
 * Este hook realiza una llamada a la API por cada clase en la lista para verificar la relación profesor-clase.
 * Esto puede ser ineficiente para listas grandes (problema N+1).
 * Una futura optimización sería modificar el backend para que devuelva esta información en la consulta de clases principal.
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
