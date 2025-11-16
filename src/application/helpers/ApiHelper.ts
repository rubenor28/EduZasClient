import type { Result } from "@domain";
import type { APIErrorDTO } from "application";

export type ApiHelper = {
  get<T>(
    endpoint: string,
    credentials: boolean,
    customHeaders?: HeadersInit,
  ): Promise<Result<T, APIErrorDTO>>;

  post<T>(
    endpoint: string,
    body: unknown,
    credentials: boolean,
    customHeaders?: HeadersInit,
  ): Promise<Result<T, APIErrorDTO>>;

  put<T>(
    endpoint: string,
    body: unknown,
    credentials: boolean,
    customHeaders?: HeadersInit,
  ): Promise<Result<T, APIErrorDTO>>;

  delete<T>(
    endpoint: string,
    credentials: boolean,
    customHeaders?: HeadersInit,
  ): Promise<Result<T, APIErrorDTO>>;
};
