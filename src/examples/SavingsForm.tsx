import { useSavingsForm } from '../hooks/useSavingsForm';
import { formatCurrency, parseCurrency } from '../utils/calculations';
import { CONFIG } from '../types/config.types';
import { PaymentFrequency, PaymentMethod } from '../types/form.types';
import { FormInput, FormSelect, FormCheckbox, Loader } from '../components/form';

/**
 * SavingsForm - Now built with the form scaffolding system!
 *
 * This form demonstrates using the reusable form components while maintaining
 * all the original functionality including:
 * - Submission to Google Sheets + Backend
 * - Currency formatting with transformers
 * - Conditional rendering (numero_cuotas only when frequency is Mensual)
 * - Calculated read-only fields
 * - All validation rules
 */
export const SavingsForm = () => {
  const {
    formData,
    errors,
    isSubmitting,
    submitSuccess,
    submitError,
    handleInputChange,
    handleFrequencyChange,
    handleSubmit,
    resetForm,
  } = useSavingsForm();

  if (CONFIG.formClosed) {
    return (
      <div className="form-closed">
        <h1>¡La jornada de vinculación ha terminado!</h1>
        <p>Gracias por tu interés en el programa de ahorro + Bono de bienestar navideño 2025.</p>
        <p>The company</p>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="success-message">
        <h2>¡Tu información se ha enviado con éxito!</h2>
        <p>Pronto estaremos en contacto contigo.</p>
        <button onClick={resetForm} className="button secondary">
          Enviar otro formulario
        </button>
      </div>
    );
  }

  return (
    <div className="savings-form-container">

      {/* Loading state */}
        {isSubmitting && (
          <div style={{ padding: 'var(--spacing-2xl)', textAlign: 'center' }}>
            <Loader message="Enviando tus datos..." />
          </div>
        )}

        {isSubmitting ? null : (

      <form onSubmit={handleSubmit} className="savings-form" noValidate>
        {/* Data Policy Checkbox */}
        <FormCheckbox
          name="polidatos"
          checked={formData.polidatos || false}
          onChange={(checked: boolean) => handleInputChange('polidatos', checked)}
          error={errors.polidatos}
          required
        >
          Autorizó a The company para recolectar, usar y tratar mis datos personales, conforme a la{' '}
          <a
            href="#"/* Replace with actual link to data policy */
            target="_blank"
            rel="noopener noreferrer"
          >
            Política de Protección de Datos
          </a>
        </FormCheckbox>

        {/* Personal Information */}
        <div className="form-section">
          <h2>Información Personal</h2>

          <FormInput
            name="nombre_completo"
            label="Nombres y Apellidos"
            type="text"
            value={formData.nombre_completo || ''}
            onChange={(value: string | number) => handleInputChange('nombre_completo', value)}
            error={errors.nombre_completo}
            required
          />

          <FormInput
            name="documento_identidad"
            label="Número de Identificación"
            type="text"
            value={formData.documento_identidad || ''}
            onChange={(value: string | number) => handleInputChange('documento_identidad', value)}
            error={errors.documento_identidad}
            required
            show={formData.nombre_completo?.length!== 0}
          />

          <FormInput
            name="ciudad"
            label="Ciudad"
            type="text"
            value={formData.ciudad || ''}
            onChange={(value: string | number) => handleInputChange('ciudad', value)}
            error={errors.ciudad}
            required
          />

          <FormInput
            name="email"
            label="Correo Electrónico"
            type="email"
            value={formData.email || ''}
            onChange={(value: string | number) => handleInputChange('email', value)}
            error={errors.email}
            required
          />
        </div>

        
        <div className="form-section">
          <h2>Programa de Ahorro + Bono de Bienestar Navideño 2025</h2>

          <FormInput
            name="meta_anual_ahorro"
            label="Meta anual de ahorro individual"
            type="text"
            value={formData.meta_anual_ahorro || 0}
            onChange={(value: string | number) => handleInputChange('meta_anual_ahorro', value)}
            error={errors.meta_anual_ahorro}
            required
            helpText={`Valor mínimo: ${formatCurrency(CONFIG.minSavingsAmount)}`}
            placeholder={formatCurrency(CONFIG.minSavingsAmount)}
            transformer={{
              format: (value: string | number) => formatCurrency(value as number),
              parse: (value: string) => parseCurrency(value),
            }}
          />

          <FormSelect
            name="frecuencia_ahorro"
            label="Frecuencia del ahorro"
            value={formData.frecuencia_ahorro || ''}
            onChange={(value: string | number) => handleFrequencyChange(value as PaymentFrequency | '')}
            error={errors.frecuencia_ahorro}
            required
            placeholder="Selecciona una opción"
            options={[
              { value: 'Mensual', label: 'Mensual' },
              { value: 'Semestral', label: 'Semestral diciembre 2025 y junio 2026' },
              { value: 'Una cuota diciembre 2024', label: 'Una cuota diciembre 2025' },
              { value: 'Una cuota junio 2025', label: 'Una cuota junio 2025' },
              { value: 'Traslado del ahorro individual 2024', label: 'Traslado del ahorro individual 2024' },
            ]}
          />

          <FormSelect
            name="numero_cuotas"
            label="Número de cuotas a partir de diciembre 2024"
            value={formData.numero_cuotas || ''}
            onChange={(value: string | number) => handleInputChange('numero_cuotas', parseInt(String(value), 10))}
            error={errors.numero_cuotas}
            required
            placeholder="Selecciona una opción"
            options={Array.from({ length: CONFIG.maxInstallments }, (_, i) => ({
              value: i + 1,
              label: String(i + 1),
            }))}
            show={formData.frecuencia_ahorro === 'Mensual'}
          />

          <FormInput
            name="valor_cuota_mensual"
            label="Valor de la cuota mensual"
            type="text"
            value={formData.valor_cuota_mensual ?? 0}
            onChange={(_value: string | number) => {}} // Read-only, no-op
            readOnly
            transformer={{
              format: (value: string | number) => formatCurrency(value as number),
              parse: (value: string) => parseCurrency(value),
            }}
            show={
              formData.frecuencia_ahorro === 'Mensual' &&
              !!formData.valor_cuota_mensual &&
              formData.valor_cuota_mensual > 0
            }
          />

          <FormInput
            name="valor_cuota_semestral"
            label="Valor de la cuota semestral"
            type="text"
            value={formData.valor_cuota_semestral ?? 0}
            onChange={(_value: string | number) => {}} // Read-only, no-op
            readOnly
            transformer={{
              format: (value: string | number) => formatCurrency(value as number),
              parse: (value: string) => parseCurrency(value),
            }}
            show={
              formData.frecuencia_ahorro === 'Semestral' &&
              !!formData.valor_cuota_semestral &&
              formData.valor_cuota_semestral > 0
            }
          />

          <FormSelect
            name="modalidad_ahorro"
            label="Modalidad para realizar el ahorro"
            value={formData.modalidad_ahorro || ''}
            onChange={(value: string | number) => handleInputChange('modalidad_ahorro', value as PaymentMethod)}
            error={errors.modalidad_ahorro}
            required
            placeholder="Selecciona una opción"
            options={[
              { value: 'Nómina', label: 'Nómina' },
              { value: 'Caja', label: 'Caja' },
            ]}
          />
        </div>
        
        {/* Terms and Conditions */}
        <FormCheckbox
          name="terminos"
          checked={formData.terminos || false}
          onChange={(checked: boolean) => handleInputChange('terminos', checked)}
          error={errors.terminos}
          required
          label="Confirmo que conozco y acepto las condiciones del Programa Ahorro + Bono de Bienestar Navideño 2025"
        />



        {/* Submit Error */}
        {submitError && (
          <div className="error-message">
            <p>{submitError}</p>
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="button primary" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>

      </form>
        )}
    </div>
  );
};
