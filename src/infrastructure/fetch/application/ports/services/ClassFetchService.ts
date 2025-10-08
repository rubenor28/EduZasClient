import { serviceErrorResponseParser, Err, Ok, type ClassDomain } from "@domain";
import type {
  ClassService,
  ClassCriteriaDTO,
  PaginatedQuery,
} from "@application";

export function createFetchClassService(apiUrl: string): ClassService {
  const service: ClassService = {
    async createClass(newClass) {
      const response = await fetch(`${apiUrl}/classes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newClass),
      });

      const error = await serviceErrorResponseParser(response);
      if (error) return Err(error);

      if (response.status === 200 || response.status === 201) {
        const parseRed: ClassDomain = await response.json();
        return Ok(parseRed);
      }

      throw new Error("Internal server error");
    },

    async updateClass(data) {
      const response = await fetch(`${apiUrl}/classes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const error = await serviceErrorResponseParser(response);
      if (error) return Err(error);

      if (response.status === 200) {
        const parseRed: ClassDomain = await response.json();
        return Ok(parseRed);
      }

      throw new Error("Internal server error");
    },

    async deleteClass(id) {
      const response = await fetch(`${apiUrl}/classes/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const error = await serviceErrorResponseParser(response);
      if (error) return Err(error);

      if (response.status === 200) {
        const parseRed: ClassDomain = await response.json();
        return Ok(parseRed);
      }

      throw new Error("Internal server error");
    },

    async getAssignedClasses(criteria) {
      const response = await fetch(`${apiUrl}/classes/assigned`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(criteria),
      });

      const error = await serviceErrorResponseParser(response);
      if (error) return Err(error);

      if (response.status === 200) {
        const parseRed: PaginatedQuery<ClassDomain, ClassCriteriaDTO> =
          await response.json();

        return Ok(parseRed);
      }

      throw new Error("Internal server error");
    },

    async getEnrolledClasses(criteria) {
      const response = await fetch(`${apiUrl}/classes/enrolled`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(criteria),
      });

      const error = await serviceErrorResponseParser(response);
      if (error) return Err(error);

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
