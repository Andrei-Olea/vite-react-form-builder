import { useState, useEffect, useCallback } from 'react';
import { SavingsFormData, FormErrors, PaymentFrequency } from '../types/form.types';
import { validateForm, hasErrors } from '../utils/validation';
import { calculateInstallments, calculateSemesterInstallment } from '../utils/calculations';
import { useFormSubmission } from './useFormSubmission';

const initialFormData: Partial<SavingsFormData> = {
  nombre_completo: '',
  documento_identidad: '',
  ciudad: '',
  email: '',
  meta_anual_ahorro: 0,
  frecuencia_ahorro: '',
  numero_cuotas: '',
  valor_cuota_mensual: 0,
  valor_cuota_semestral: 0,
  modalidad_ahorro: '',
  polidatos: false,
  terminos: false,
  ipaddress: '',
  timestamp: '',
};

/**
 * Custom hook for Savings Form
 *
 * This hook demonstrates how to use the generic useFormSubmission hook
 * while adding custom business logic (calculations, validation, etc.)
 *
 * Pattern:
 * 1. Use useFormSubmission for submission logic
 * 2. Add your custom business logic on top
 * 3. Form component stays clean and focused on UI
 */
export const useSavingsForm = () => {
  const [formData, setFormData] = useState<Partial<SavingsFormData>>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  // Use the generic submission hook
  const {
    submitForm,
    isSubmitting,
    submitSuccess,
    submitError,
    resetSubmission,
    ipAddress,
  } = useFormSubmission();

  // Update formData with IP address when it's fetched
  useEffect(() => {
    if (ipAddress) {
      setFormData((prev) => ({ ...prev, ipaddress: ipAddress }));
    }
  }, [ipAddress]);

  // Calculate installments when relevant fields change
  useEffect(() => {
    const { meta_anual_ahorro, frecuencia_ahorro, numero_cuotas } = formData;

    if (!meta_anual_ahorro || meta_anual_ahorro < 250000) return;

    if (frecuencia_ahorro === 'Mensual' && numero_cuotas) {
      const monthlyValue = calculateInstallments(meta_anual_ahorro, Number(numero_cuotas));
      setFormData((prev) => ({
        ...prev,
        valor_cuota_mensual: monthlyValue,
        valor_cuota_semestral: 0,
      }));
    } else if (frecuencia_ahorro === 'Semestral') {
      const semesterValue = calculateSemesterInstallment(meta_anual_ahorro);
      setFormData((prev) => ({
        ...prev,
        valor_cuota_semestral: semesterValue,
        valor_cuota_mensual: 0,
      }));
    }
  }, [formData.meta_anual_ahorro, formData.frecuencia_ahorro, formData.numero_cuotas]);

  const handleInputChange = useCallback((
    name: keyof SavingsFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  }, [errors]);

  const handleFrequencyChange = useCallback((frequency: PaymentFrequency | '') => {
    setFormData((prev) => ({
      ...prev,
      frecuencia_ahorro: frequency,
      numero_cuotas: frequency === 'Mensual' ? prev.numero_cuotas : '',
      valor_cuota_mensual: frequency === 'Mensual' ? prev.valor_cuota_mensual : 0,
      valor_cuota_semestral: frequency === 'Semestral' ? prev.valor_cuota_semestral : 0,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm(formData);

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    // Submit using the generic submission hook
    const success = await submitForm(formData as SavingsFormData);

    if (success) {
      // Reset form on success
      setFormData(initialFormData);
      setErrors({});
    }
  };

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    resetSubmission();
  }, [resetSubmission]);

  return {
    formData,
    errors,
    isSubmitting,
    submitSuccess,
    submitError,
    handleInputChange,
    handleFrequencyChange,
    handleSubmit,
    resetForm,
  };
};
