export const VITE_API_URL = import.meta.env.VITE_API_URL;

if (VITE_API_URL === undefined) throw Error("VITE_API_URL must be defined in env file");
