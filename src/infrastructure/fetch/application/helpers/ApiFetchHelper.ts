import type { APIErrorDTO } from "@application";
import { API_URL } from "@dependencies";
import { Err, Ok, type Result } from "@domain";
import type { ApiHelper } from "application/helpers/ApiHelper";

export const apiFetchHelper: ApiHelper = {
  async get<T>(
    endpoint: string,
    credentials: boolean = true,
    customHeaders?: HeadersInit,
  ): Promise<Result<T, APIErrorDTO>> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      credentials: credentials ? "include" : "omit",
      headers: {
        "Content-Type": "application/json",
        ...customHeaders,
      },
    });

    if (!response.ok) return Err(await mapServiceError(response));
    return Ok(await response.json());
  },

  async post<T>(
    endpoint: string,
    body: unknown,
    credentials: boolean = true,
    customHeaders?: HeadersInit,
  ): Promise<Result<T, APIErrorDTO>> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      credentials: credentials ? "include" : "omit",
      headers: {
        "Content-Type": "application/json",
        ...customHeaders,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) return Err(await mapServiceError(response));
    return Ok(await response.json());
  },

  async put<T>(
    endpoint: string,
    body: unknown,
    credentials: boolean = true,
    customHeaders?: HeadersInit,
  ): Promise<Result<T, APIErrorDTO>> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      credentials: credentials ? "include" : "omit",
      headers: {
        "Content-Type": "application/json",
        ...customHeaders,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) return Err(await mapServiceError(response));
    return Ok(await response.json());
  },

  async delete<T>(
    endpoint: string,
    credentials: boolean = true,
    customHeaders?: HeadersInit,
  ): Promise<Result<T, APIErrorDTO>> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      credentials: credentials ? "include" : "omit",
      headers: {
        "Content-Type": "application/json",
        ...customHeaders,
      },
    });

    if (!response.ok) return Err(await mapServiceError(response));
    return Ok(await response.json());
  },
};

export async function mapServiceError(res: Response): Promise<APIErrorDTO> {
  const statusErrors: Record<number, APIErrorDTO> = {
    400: { type: "input-error", data: (await res.json()).errors },
    401: { type: "unauthorized" },
    403: { type: "forbid" },
    404: { type: "not-found" },
    409: { type: "already-exists" },
    500: { type: "internal-server-error" },
  };

  return statusErrors[res.status] ?? statusErrors[500];
}
