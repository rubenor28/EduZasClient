export const AuthErrors = {
  Unauthorized: "unauthorized",
  Forbidden: "forbidden",
} as const;

export type AuthErrors = (typeof AuthErrors)[keyof typeof AuthErrors];
