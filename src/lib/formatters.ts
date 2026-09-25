/**
 * Strict Indian Rupee (INR) Formatter
 * Complies with strict rule: NEVER output $, USD, or US$.
 */
export function formatINR(amount: number, options?: { showDecimals?: boolean }): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }

  const showDecimals = options?.showDecimals ?? false;

  // Format with Indian numbering system (lakhs, crores: 1,00,000)
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);

  return formatted;
}

export function formatNumber(val: number): string {
  if (isNaN(val)) return '0';
  return new Intl.NumberFormat('en-IN').format(val);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}
