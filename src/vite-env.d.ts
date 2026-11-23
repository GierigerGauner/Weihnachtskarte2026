/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_REVIEW_MODE?: string;
  readonly VITE_DEFAULT_VARIANT?: string;
  readonly VITE_BRIDGE_B_TO_A?: string;
}
interface ImportMeta { readonly env: ImportMetaEnv }
