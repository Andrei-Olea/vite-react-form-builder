import { SavingsFormData, ApiResponse } from '../types/form.types';
import { CONFIG } from '../types/config.types';

export const getIpAddress = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || '';
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return '';
  }
};

export const submitToGoogleSheets = async (
  formData: SavingsFormData
): Promise<ApiResponse> => {
  try {
    const formDataEncoded = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataEncoded.append(key, String(value));
    });

    await fetch(CONFIG.googleSheetsUrl, {
      method: 'POST',
      body: formDataEncoded,
      mode: 'no-cors', // Google Apps Script requires no-cors mode
    });

    // Note: With no-cors mode, we can't read the response
    // We assume success if fetch doesn't throw
    return {
      success: true,
      message: 'Datos enviados a Google Sheets exitosamente',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al enviar a Google Sheets',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const submitToBackend = async (
  formData: SavingsFormData
): Promise<ApiResponse> => {
  try {
    const response = await fetch(CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    // Get raw response text first
    const responseText = await response.text();

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error('Error al procesar la respuesta del servidor');
    }

    if (!response.ok) {
      throw new Error(data.message || 'Error al procesar el formulario');
    }

    return {
      success: true,
      message: data.message || 'Formulario enviado exitosamente',
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al enviar el formulario',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
