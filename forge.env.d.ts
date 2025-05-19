/// <reference types="vite/client" />
/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />

interface ImportMetaEnv {
    readonly VITE_PUBLIC_BASE_URL: string;
    readonly VITE_PUBLIC_SOCKET_URL: string;
    readonly VITE_PUBLIC_CONVERSION_RATE: string;
    readonly VITE_PUBLIC_ENCRYPTION_KEY: string;
    readonly VITE_PUBLIC_OS: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  