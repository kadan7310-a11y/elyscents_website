import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Bottle from './Bottle.jsx';
import { useCart } from '../context/CartContext.jsx';
import { money } from '../config.js';
import '../shop.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const soldOut = product.stock <= 0;
  const notes = (product.notes || []).slice(0, 3).join(', ');
  const href = `/product/${product._id}`;

  useEffect(() => {
    if (!added) return undefined;
    const timer = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(timer);
  }, [added]);

  function handleAdd() {
    addItem(product, 1);
    setAdded(true);
  }

  return (
    <article className="pcard" data-family={product.family}>
      <div className="pcard-media">
        <Link to={href} className="pcard-link" aria-label={`View ${product.name}`}>
          {product.image && !imgFailed ? (
            <img src={product.image} alt="" loading="lazy" onError={() => setImgFailed(true)} />
          ) : (
            <Bottle family={product.family} />
          )}
        </Link>
        <span className="pcard-badge">{product.family}</span>
        {soldOut ? (
          <span className="pcard-soldout">Sold out</span>
        ) : (
          <button type="button" className="pcard-add" onClick={handleAdd}>
            {added ? 'Added to bag' : 'Add to bag'}
          </button>
        )}
      </div>
      <div className="pcard-body">
        <h3><Link to={href}>{product.name}</Link></h3>
        {notes && <p className="pcard-notes">{notes}</p>}
        <p className="pcard-meta">
          <span>{product.sizeMl} ml · {product.category}</span>
          <span className="pcard-price">{money(product.price)}</span>
        </p>
      </div>
    </article>
  );
}
