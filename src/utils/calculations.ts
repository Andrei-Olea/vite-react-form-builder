export const calculateInstallments = (
  annualGoal: number,
  numInstallments: number
): number => {
  if (!annualGoal || numInstallments <= 0) return 0;
  return Math.round(annualGoal / numInstallments);
};

export const calculateSemesterInstallment = (annualGoal: number): number => {
  return calculateInstallments(annualGoal, 2);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const parseCurrency = (value: string): number => {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '');
  return parseInt(cleaned, 10) || 0;
};
