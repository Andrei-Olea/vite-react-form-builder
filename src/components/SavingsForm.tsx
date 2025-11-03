import { useSavingsForm } from '../hooks/useSavingsForm';
import { formatCurrency, parseCurrency } from '../utils/calculations';
import { CONFIG } from '../types/config.types';
import { PaymentFrequency, PaymentMethod } from '../types/form.types';

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
        <p>Codecol</p>
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

      <form onSubmit={handleSubmit} className="savings-form" noValidate>
        {/* Data Policy Checkbox */}
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={formData.polidatos || false}
              onChange={(e) => handleInputChange('polidatos', e.target.checked)}
              required
            />
            <span>
              Autorizó a Codecol para recolectar, usar y tratar mis datos personales, conforme a la{' '}
              <a
                href="https://www.codecol.com.co/documentos/POLITICA-PROTECCION-DATOS-PERSONALES.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Protección de Datos
              </a>
            </span>
          </label>
          {errors.polidatos && <span className="error">{errors.polidatos}</span>}
        </div>

        {/* Personal Information */}
        <div className="form-section">
          <h2>Información Personal</h2>

          <div className="form-group">
            <label htmlFor="nombre_completo">
              Nombres y Apellidos <span className="required">*</span>
            </label>
            <input
              type="text"
              id="nombre_completo"
              value={formData.nombre_completo || ''}
              onChange={(e) => handleInputChange('nombre_completo', e.target.value)}
              className={errors.nombre_completo ? 'error' : ''}
              required
            />
            {errors.nombre_completo && <span className="error">{errors.nombre_completo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="documento_identidad">
              Número de Identificación <span className="required">*</span>
            </label>
            <input
              type="text"
              id="documento_identidad"
              value={formData.documento_identidad || ''}
              onChange={(e) => handleInputChange('documento_identidad', e.target.value)}
              className={errors.documento_identidad ? 'error' : ''}
              required
            />
            {errors.documento_identidad && <span className="error">{errors.documento_identidad}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="ciudad">
              Ciudad <span className="required">*</span>
            </label>
            <input
              type="text"
              id="ciudad"
              value={formData.ciudad || ''}
              onChange={(e) => handleInputChange('ciudad', e.target.value)}
              className={errors.ciudad ? 'error' : ''}
              required
            />
            {errors.ciudad && <span className="error">{errors.ciudad}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Correo Electrónico <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'error' : ''}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
        </div>

        {/* Savings Program Information */}
        <div className="form-section">
          <h2>Programa de Ahorro + Bono de Bienestar Navideño 2025</h2>

          <div className="form-group">
            <label htmlFor="meta_anual_ahorro">
              Meta anual de ahorro individual <span className="required">*</span>
            </label>
            <small>Valor mínimo: {formatCurrency(CONFIG.minSavingsAmount)}</small>
            <input
              type="text"
              id="meta_anual_ahorro"
              value={formData.meta_anual_ahorro ? formatCurrency(formData.meta_anual_ahorro) : ''}
              onChange={(e) => {
                const value = parseCurrency(e.target.value);
                handleInputChange('meta_anual_ahorro', value);
              }}
              className={errors.meta_anual_ahorro ? 'error' : ''}
              placeholder={formatCurrency(CONFIG.minSavingsAmount)}
              required
            />
            {errors.meta_anual_ahorro && <span className="error">{errors.meta_anual_ahorro}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="frecuencia_ahorro">
              Frecuencia del ahorro <span className="required">*</span>
            </label>
            <select
              id="frecuencia_ahorro"
              value={formData.frecuencia_ahorro || ''}
              onChange={(e) => handleFrequencyChange(e.target.value as PaymentFrequency | '')}
              className={errors.frecuencia_ahorro ? 'error' : ''}
              required
            >
              <option value="">Selecciona una opción</option>
              <option value="Mensual">Mensual</option>
              <option value="Semestral">Semestral diciembre 2025 y junio 2026</option>
              <option value="Una cuota diciembre 2024">Una cuota diciembre 2025</option>
              <option value="Una cuota junio 2025">Una cuota junio 2025</option>
              <option value="Traslado del ahorro individual 2024">Traslado del ahorro individual 2024</option>
            </select>
            {errors.frecuencia_ahorro && <span className="error">{errors.frecuencia_ahorro}</span>}
          </div>

          {formData.frecuencia_ahorro === 'Mensual' && (
            <div className="form-group">
              <label htmlFor="numero_cuotas">
                Número de cuotas a partir de diciembre 2024 <span className="required">*</span>
              </label>
              <select
                id="numero_cuotas"
                value={formData.numero_cuotas || ''}
                onChange={(e) => handleInputChange('numero_cuotas', parseInt(e.target.value, 10))}
                className={errors.numero_cuotas ? 'error' : ''}
                required
              >
                <option value="">Selecciona una opción</option>
                {Array.from({ length: CONFIG.maxInstallments }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              {errors.numero_cuotas && <span className="error">{errors.numero_cuotas}</span>}
            </div>
          )}

          {formData.frecuencia_ahorro === 'Mensual' && formData.valor_cuota_mensual && formData.valor_cuota_mensual > 0 && (
            <div className="form-group">
              <label>Valor de la cuota mensual</label>
              <input
                type="text"
                value={formatCurrency(formData.valor_cuota_mensual ?? 0)}
                readOnly
                className="readonly"
              />
            </div>
          )}

          {formData.frecuencia_ahorro === 'Semestral' && formData.valor_cuota_semestral && formData.valor_cuota_semestral > 0 && (
            <div className="form-group">
              <label>Valor de la cuota semestral</label>
              <input
                type="text"
                value={formatCurrency(formData.valor_cuota_semestral ?? 0)}
                readOnly
                className="readonly"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="modalidad_ahorro">
              Modalidad para realizar el ahorro <span className="required">*</span>
            </label>
            <select
              id="modalidad_ahorro"
              value={formData.modalidad_ahorro || ''}
              onChange={(e) => handleInputChange('modalidad_ahorro', e.target.value as PaymentMethod)}
              className={errors.modalidad_ahorro ? 'error' : ''}
              required
            >
              <option value="">Selecciona una opción</option>
              <option value="Nómina">Nómina</option>
              <option value="Caja">Caja</option>
            </select>
            {errors.modalidad_ahorro && <span className="error">{errors.modalidad_ahorro}</span>}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={formData.terminos || false}
              onChange={(e) => handleInputChange('terminos', e.target.checked)}
              required
            />
            <span>
              Confirmo que conozco y acepto las condiciones del Programa Ahorro + Bono de Bienestar Navideño 2025
            </span>
          </label>
          {errors.terminos && <span className="error">{errors.terminos}</span>}
        </div>

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
    </div>
  );
};
