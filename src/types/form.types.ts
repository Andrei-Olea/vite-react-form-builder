export type PaymentFrequency = 'Mensual' | 'Semestral' | 'Una cuota diciembre 2024' | 'Una cuota junio 2025';

export type PaymentMethod = 'Nómina' | 'Caja';

export interface SavingsFormData {
  // Personal information
  nombre_completo: string;
  documento_identidad: string;
  ciudad: string;
  email: string;

  // Savings program data
  meta_anual_ahorro: number;
  frecuencia_ahorro: PaymentFrequency | '';
  numero_cuotas: number | '';
  valor_cuota_mensual: number;
  valor_cuota_semestral: number;
  modalidad_ahorro: PaymentMethod | '';

  // Terms and conditions
  polidatos: boolean;
  terminos: boolean;

  // Hidden fields
  ipaddress: string;
  timestamp: string;
}

export interface FormErrors {
  nombre_completo?: string;
  documento_identidad?: string;
  ciudad?: string;
  email?: string;
  meta_anual_ahorro?: string;
  frecuencia_ahorro?: string;
  numero_cuotas?: string;
  modalidad_ahorro?: string;
  polidatos?: string;
  terminos?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
}

export interface InstallmentCalculation {
  monthly?: number;
  semester?: number;
}
