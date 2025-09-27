export const API_URL = import.meta.env.VITE_API_URL;
if (API_URL === undefined)
  throw Error("VITE_API_URL must be defined on .env file");
