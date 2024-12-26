/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_OPENAI_API_KEY: string
  readonly MAIN_VITE_OPENAI_API_BASE_URL: string
  readonly MAIN_VITE_OPENAI_API_MODEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'better-sqlite3'
