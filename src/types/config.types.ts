export interface AppConfig {
  googleSheetsUrl: string;
  apiEndpoint: string;
  minSavingsAmount: number;
  maxInstallments: number;
  formClosed: boolean;
}

// Helper functions to get required environment variables
// These will throw clear errors if values are missing
const getRequiredEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please check your .env file and ensure ${key} is set.\n` +
      `See .env.example for reference.`
    );
  }
  return value;
};

const getRequiredEnvNumber = (key: string): number => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please check your .env file and ensure ${key} is set.\n` +
      `See .env.example for reference.`
    );
  }
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Invalid number for ${key}: ${value}`);
  }
  return num;
};

const getRequiredEnvBoolean = (key: string): boolean => {
  const value = import.meta.env[key];
  if (value === undefined || value === '') {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please check your .env file and ensure ${key} is set.\n` +
      `See .env.example for reference.`
    );
  }
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`Invalid boolean for ${key}: ${value} (must be 'true' or 'false')`);
};

// Configuration loaded from environment variables
// All frontend env vars must be prefixed with VITE_ to be exposed to the client
// .env is the ONLY source of truth - no fallback values
export const CONFIG: AppConfig = {
  googleSheetsUrl: getRequiredEnvVar('VITE_GOOGLE_SHEETS_URL'),
  apiEndpoint: getRequiredEnvVar('VITE_API_ENDPOINT'),
  minSavingsAmount: getRequiredEnvNumber('VITE_MIN_SAVINGS_AMOUNT'),
  maxInstallments: getRequiredEnvNumber('VITE_MAX_INSTALLMENTS'),
  formClosed: getRequiredEnvBoolean('VITE_FORM_CLOSED'),
};
