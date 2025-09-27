/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // otras variables VITE_* si las tienes
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
