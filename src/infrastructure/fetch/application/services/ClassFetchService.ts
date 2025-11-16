import { Err, Ok } from "@domain";
import type { ClassService, AppHook } from "@application";
import { mapAPIError } from "application/services/APIServices";

export function createFetchClassService(
  apiUrl: string,
  appHook: AppHook,
): ClassService {
  const appStore = appHook();

  const service: ClassService = {
    appStore,
    async createClass(newClass) {
      const res = await fetch(`${apiUrl}/classes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newClass),
      });

      if (!res.ok) return Err(await mapAPIError(res));
      return Ok(await res.json());
    },

    async updateClass(data) {
      const res = await fetch(`${apiUrl}/classes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) return Err(await mapAPIError(res));
      return Ok(await res.json());
    },

    async deleteClass(id) {
      const res = await fetch(`${apiUrl}/classes/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) return Err(await mapAPIError(res));
      return Ok(await res.json());
    },

    async getAssignedClasses(criteria) {
      const res = await fetch(`${apiUrl}/classes/assigned`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(criteria),
      });

      if (!res.ok) return Err(await mapAPIError(res));
      return Ok(await res.json());
    },

    async getEnrolledClasses(criteria) {
      console.log("CRITERIO ENVIADO");
      console.log(criteria);

      const res = await fetch(`${apiUrl}/classes/enrolled`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(criteria),
      });

      if (!res.ok) return Err(await mapAPIError(res));
      return Ok(await res.json());
    },

    async enrollClass(classId) {
      const res = await fetch(`${apiUrl}/classes/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ classId }),
      });

      if (!res.ok) return Err(await mapAPIError(res));
      return Ok(undefined);
    },

    async unenrollClass(classId) {
      const res = await fetch(`${apiUrl}/classes/enroll/${classId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) return Err(await mapAPIError(res));
      return Ok(undefined);
    },
  };

  return service;
}
