/**
 * URL del backend establecida en las variables de entorno.
 * Si no se define se utiliza http://localhost:5018
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5018";
