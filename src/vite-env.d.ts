/// <reference types="vite/client" />

// see https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript

interface ImportMetaEnv {
  readonly VITE_PUBLIC_LENS_API: string | undefined;
  // more env variables...
}

/*
interface ImportMeta {
  readonly env: ImportMetaEnv
}*/
