import { SavingsFormData, FormErrors } from '../types/form.types';
import { CONFIG } from '../types/config.types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateForm = (data: Partial<SavingsFormData>): FormErrors => {
  const errors: FormErrors = {};

  // Personal information validation
  if (!data.nombre_completo?.trim()) {
    errors.nombre_completo = 'El nombre completo es requerido';
  }

  if (!data.documento_identidad?.trim()) {
    errors.documento_identidad = 'El número de identificación es requerido';
  }

  if (!data.ciudad?.trim()) {
    errors.ciudad = 'La ciudad es requerida';
  }

  if (!data.email?.trim()) {
    errors.email = 'El correo electrónico es requerido';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Por favor ingresa un correo electrónico válido';
  }

  // Savings program validation
  if (!data.meta_anual_ahorro || data.meta_anual_ahorro < CONFIG.minSavingsAmount) {
    errors.meta_anual_ahorro = `La meta anual mínima de ahorro es $${CONFIG.minSavingsAmount.toLocaleString('es-CO')}`;
  }

  if (!data.frecuencia_ahorro) {
    errors.frecuencia_ahorro = 'Selecciona una frecuencia de ahorro';
  }

  if (data.frecuencia_ahorro === 'Mensual' && !data.numero_cuotas) {
    errors.numero_cuotas = 'Selecciona el número de cuotas';
  }

  if (!data.modalidad_ahorro) {
    errors.modalidad_ahorro = 'Selecciona una modalidad de ahorro';
  }

  // Terms validation
  if (!data.polidatos) {
    errors.polidatos = 'Debes aceptar la política de protección de datos';
  }

  if (!data.terminos) {
    errors.terminos = 'Debes aceptar las condiciones del programa';
  }

  return errors;
};

export const hasErrors = (errors: FormErrors): boolean => {
  return Object.keys(errors).length > 0;
};
