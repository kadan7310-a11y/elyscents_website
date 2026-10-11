// Builds /products/{slug}.png from the product name, e.g. "Fig & Cocoa" -> /products/fig-and-cocoa.png
export function slugify(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Products added in the admin panel with a full image link (https://...) keep that link.
export function getImageSrc(product) {
  const custom = product && product.image ? String(product.image) : '';
  if (/^https?:\/\//i.test(custom)) return custom;
  return `/products/${slugify(product && product.name)}.png`;
}
