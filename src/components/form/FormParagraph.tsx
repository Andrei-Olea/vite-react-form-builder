import { FormParagraphProps } from '../../types/formComponents.types';

/**
 * FormParagraph - Static content component for forms
 *
 * Renders static content including plain text, HTML strings, or React elements.
 * Useful for displaying instructions, disclaimers, or informational content within forms.
 *
 * Features:
 * - Automatic HTML detection and rendering
 * - Support for React elements
 * - Conditional rendering via show prop
 * - Custom styling via className
 *
 * @example
 * // Simple text
 * <FormParagraph
 *   name="intro"
 *   content="Please fill out all required fields."
 * />
 *
 * @example
 * // HTML content
 * <FormParagraph
 *   name="terms"
 *   content='By continuing, you agree to our <a href="/terms">Terms of Service</a>.'
 * />
 *
 * @example
 * // Conditional rendering
 * <FormParagraph
 *   name="cdatInfo"
 *   content="<strong>Important:</strong> Your CDAT will be created with the selected term."
 *   show={formData.instruccion_ahorro === 'apertura_cdat'}
 * />
 *
 * @example
 * // React elements
 * <FormParagraph
 *   name="notice"
 *   content={
 *     <>
 *       <strong>Note:</strong> Data saved to{' '}
 *       <a href="https://sheets.google.com">Google Sheets</a>
 *     </>
 *   }
 * />
 *
 * @example
 * // Custom styling
 * <FormParagraph
 *   name="warning"
 *   content="This action cannot be undone."
 *   className="warning-text"
 * />
 */
export const FormParagraph = ({
  content,
  className = '',
  show = true,
}: FormParagraphProps) => {
  // Conditional rendering
  if (!show) {
    return null;
  }

  // Check if content is an HTML string (contains HTML tags)
  const isHtmlString =
    typeof content === 'string' && /<[^>]+>/.test(content);

  return (
    <div className={`form-paragraph ${className}`.trim()}>
      {isHtmlString ? (
        <div dangerouslySetInnerHTML={{ __html: content as string }} />
      ) : (
        <div>{content}</div>
      )}
    </div>
  );
};
