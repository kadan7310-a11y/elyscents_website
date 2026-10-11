import { useState } from 'react';
import Bottle from './Bottle.jsx';
import { getImageSrc } from '../image.js';

export default function ProductImage({ product, className = '' }) {
  const [failed, setFailed] = useState(false);
  const showPhoto = !failed;
  return (
    <div className={`product-image ${className}`}>
      {showPhoto ? (
        <img src={getImageSrc(product)} alt={product.name} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <Bottle family={product.family} />
      )}
    </div>
  );
}
