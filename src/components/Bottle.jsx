const TINTS = {
  Floral: '#C98FB0',
  Woody: '#8A6A4F',
  Citrus: '#E0B83C',
  Amber: '#C9772E',
  Fresh: '#6FA8B8',
  Gourmand: '#A5593F',
};

export default function Bottle({ family }) {
  const tint = TINTS[family] || '#5E4B8B';
  return (
    <svg viewBox="0 0 120 160" role="img" aria-label="Perfume bottle" className="bottle">
      <rect x="48" y="8" width="24" height="22" rx="3" fill="#232A3B" />
      <rect x="54" y="28" width="12" height="12" fill="#B9BFCB" />
      <rect x="22" y="40" width="76" height="108" rx="14" fill="#FFFFFF" stroke="#B9BFCB" strokeWidth="2" />
      <rect x="28" y="84" width="64" height="58" rx="9" fill={tint} opacity="0.85" />
      <rect x="40" y="52" width="10" height="26" rx="5" fill="#FFFFFF" opacity="0.8" />
    </svg>
  );
}
