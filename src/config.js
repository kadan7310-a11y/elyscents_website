export const CURRENCY = 'USD';

export function money(value) {
  const n = Number(value) || 0;
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: CURRENCY }).format(n);
  } catch (e) {
    return `${CURRENCY} ${n.toFixed(2)}`;
  }
}

export const CATEGORIES = ['Women', 'Men', 'Unisex'];
export const FAMILIES = ['Floral', 'Woody', 'Citrus', 'Amber', 'Fresh', 'Gourmand'];