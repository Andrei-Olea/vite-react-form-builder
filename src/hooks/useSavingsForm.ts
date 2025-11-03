import { useState, useEffect, useCallback } from 'react';
import { SavingsFormData, FormErrors, PaymentFrequency } from '../types/form.types';
import { validateForm, hasErrors } from '../utils/validation';
import { calculateInstallments, calculateSemesterInstallment } from '../utils/calculations';
import { getIpAddress, submitToGoogleSheets, submitToBackend } from '../utils/api';

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

export const useSavingsForm = () => {
  const [formData, setFormData] = useState<Partial<SavingsFormData>>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  // Fetch IP address on mount
  useEffect(() => {
    getIpAddress().then((ip) => {
      setFormData((prev) => ({ ...prev, ipaddress: ip }));
    });
  }, []);

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
    setSubmitError('');

    // Validate form
    const validationErrors = validateForm(formData);

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Add timestamp
      const submissionData: SavingsFormData = {
        ...formData as SavingsFormData,
        timestamp: new Date().toISOString(),
      };

      // Submit to both Google Sheets and backend
      const [sheetsResponse, backendResponse] = await Promise.all([
        submitToGoogleSheets(submissionData),
        submitToBackend(submissionData),
      ]);

      // Success if Google Sheets succeeds (primary data store)
      // Backend is optional (only used for email notifications and logging)
      if (sheetsResponse.success) {
        setSubmitSuccess(true);
        setFormData(initialFormData);

        // Log backend error if it failed, but don't block submission
        if (!backendResponse.success) {
          if (import.meta.env.DEV) {
            console.warn(
              '%c⚠️ Backend Submission Failed (Non-Critical)',
              'background: #fef2f2; color: #dc2626; padding: 6px 10px; border-radius: 4px; font-weight: bold;'
            );
            console.warn('Error:', backendResponse.error);
            console.warn('Data was successfully saved to Google Sheets.');
            console.warn('Backend is only needed for email notifications and logging.');
            console.warn('To enable backend: Start DDEV with "cd .. && ddev start"');
          } else {
            console.warn('Backend submission failed (non-critical):', backendResponse.error);
          }
        }
      } else {
        // Only fail if Google Sheets fails (primary requirement)
        const errorMessages = [`Google Sheets: ${sheetsResponse.error || 'Unknown error'}`];

        if (!backendResponse.success) {
          errorMessages.push(`Backend: ${backendResponse.error || 'Unknown error'}`);
        }

        throw new Error(errorMessages.join(' | '));
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Error al enviar el formulario. Por favor intenta de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setSubmitSuccess(false);
    setSubmitError('');
  }, []);

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
