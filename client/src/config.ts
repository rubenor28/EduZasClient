export const VITE_API_URL = import.meta.env.VITE_API_URL;
export const VITE_CLIENT_URL = import.meta.env.VITE_CLIENT_URL;

if (VITE_API_URL === undefined) throw Error("VITE_API_URL must be defined in env file");
if (VITE_CLIENT_URL === undefined) throw Error("VITE_CLIENT_URL must be defined in env file");
