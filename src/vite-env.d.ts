/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module "carbon-preprocess-svelte" {
  function optimizeImports(): void;
}

interface ImportMetaEnv {
  readonly CLEAN_NOTIFICATIONS_AT_STARTUP: boolean;
  readonly LOAD_TEST_NOTIFICATIONS: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
