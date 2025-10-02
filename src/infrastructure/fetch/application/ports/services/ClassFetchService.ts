import type { ClassCriteriaDTO, PaginatedQuery } from "@application";
import { AuthErrors, Err, Ok, type ClassDomain } from "@domain";
import type { ClassService } from "application/ports/services/ClassService";

export function createFetchClassService(apiUrl: string): ClassService {
  const service: ClassService = {
    async createClass(newClass) {
      const response = await fetch(`${apiUrl}/classes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newClass),
      });

      if (response.status === 403) return Err(AuthErrors.Forbidden);
      if (response.status === 401) return Err(AuthErrors.Unauthorized);

      if (response.status === 200) {
        const parseRed: ClassDomain = await response.json();
        return Ok(parseRed);
      }

      throw new Error("Internal server error");
    },

    async getMyAssignedClasses(criteria) {
      const response = await fetch(`${apiUrl}/classes/assigned`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(criteria),
      });

      if (response.status === 403) return Err(AuthErrors.Forbidden);
      if (response.status === 401) return Err(AuthErrors.Unauthorized);

      if (response.status === 200) {
        const parseRed: PaginatedQuery<ClassDomain, ClassCriteriaDTO> =
          await response.json();
        return Ok(parseRed);
      }

      throw new Error("Internal server error");
    },
  };

  return service;
}
