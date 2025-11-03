/**
 * Generic Form Submission Hook
 *
 * This hook provides a standardized way to submit ANY form to Google Sheets + Backend.
 * Just pass your form data and it handles submission, loading states, errors, and success.
 *
 * @example
 * const { submitForm, isSubmitting, submitSuccess, submitError, resetSubmission } = useFormSubmission();
 *
 * const handleSubmit = async (e: FormEvent) => {
 *   e.preventDefault();
 *   const success = await submitForm(formData);
 *   if (success) {
 *     // Handle success
 *   }
 * };
 */

import { useState, useCallback, useEffect } from 'react';
import { submitToGoogleSheets, submitToBackend, getIpAddress } from '../utils/api';

interface UseFormSubmissionOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  includeBackend?: boolean; // Whether to submit to backend (default: true)
  includeIpAddress?: boolean; // Whether to fetch and include IP address (default: true)
  includeTimestamp?: boolean; // Whether to include timestamp (default: true)
}

export const useFormSubmission = (options: UseFormSubmissionOptions = {}) => {
  const {
    onSuccess,
    onError,
    includeBackend = true,
    includeIpAddress = true,
    includeTimestamp = true,
  } = options;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [ipAddress, setIpAddress] = useState<string>('');

  // Fetch IP address on mount if needed
  useEffect(() => {
    if (includeIpAddress) {
      getIpAddress().then((ip) => {
        setIpAddress(ip);
      });
    }
  }, [includeIpAddress]);

  /**
   * Submit form data to Google Sheets (and optionally backend)
   *
   * @param formData - Your form data object (any structure)
   * @returns boolean - true if submission was successful
   */
  const submitForm = useCallback(async (formData: Record<string, any>): Promise<boolean> => {
    setSubmitError('');
    setIsSubmitting(true);

    try {
      // Prepare submission data
      const submissionData: Record<string, any> = { ...formData };

      // Add IP address if enabled
      if (includeIpAddress) {
        submissionData.ipaddress = ipAddress;
      }

      // Add timestamp if enabled
      if (includeTimestamp) {
        submissionData.timestamp = new Date().toISOString();
      }

      // Submit to Google Sheets (required) and backend (optional)
      // Cast to any to allow any form data structure
      const submissions = [submitToGoogleSheets(submissionData as any)];

      if (includeBackend) {
        submissions.push(submitToBackend(submissionData as any));
      }

      const [sheetsResponse, backendResponse] = await Promise.all(submissions);

      // Success if Google Sheets succeeds (primary data store)
      if (sheetsResponse.success) {
        setSubmitSuccess(true);

        // Log backend error if it failed, but don't block submission
        if (includeBackend && backendResponse && !backendResponse.success) {
          if (import.meta.env.DEV) {
            console.warn(
              '%c⚠️ Backend Submission Failed (Non-Critical)',
              'background: #fef2f2; color: #dc2626; padding: 6px 10px; border-radius: 4px; font-weight: bold;'
            );
            console.warn('Error:', backendResponse.error);
            console.warn('Data was successfully saved to Google Sheets.');
          } else {
            console.warn('Backend submission failed (non-critical):', backendResponse.error);
          }
        }

        // Call success callback
        if (onSuccess) {
          onSuccess();
        }

        return true;
      } else {
        // Only fail if Google Sheets fails (primary requirement)
        const errorMessages = [`Google Sheets: ${sheetsResponse.error || 'Unknown error'}`];

        if (includeBackend && backendResponse && !backendResponse.success) {
          errorMessages.push(`Backend: ${backendResponse.error || 'Unknown error'}`);
        }

        const errorMessage = errorMessages.join(' | ');
        setSubmitError(errorMessage);

        if (onError) {
          onError(errorMessage);
        }

        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Error al enviar el formulario. Por favor intenta de nuevo.';

      setSubmitError(errorMessage);

      if (onError) {
        onError(errorMessage);
      }

      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [ipAddress, includeBackend, includeIpAddress, includeTimestamp, onSuccess, onError]);

  /**
   * Reset submission state (useful for "Submit another" flows)
   */
  const resetSubmission = useCallback(() => {
    setSubmitSuccess(false);
    setSubmitError('');
    setIsSubmitting(false);
  }, []);

  return {
    submitForm,
    isSubmitting,
    submitSuccess,
    submitError,
    resetSubmission,
    ipAddress, // Expose IP address in case you need it in your form
  };
};
