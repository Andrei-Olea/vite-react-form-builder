/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_SHEETS_URL: string;
  readonly VITE_API_ENDPOINT: string;
  readonly VITE_MIN_SAVINGS_AMOUNT: string;
  readonly VITE_MAX_INSTALLMENTS: string;
  readonly VITE_FORM_CLOSED: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
