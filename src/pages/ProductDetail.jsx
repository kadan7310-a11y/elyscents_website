import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { money } from '../config.js';
import { useCart } from '../context/CartContext.jsx';
import ProductImage from '../components/ProductImage.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setProduct(null);
    setError('');
    setQty(1);
    setAdded(false);
    api(`/products/${id}`)
      .then((data) => {
        if (!cancelled) setProduct(data.product);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div className="page narrow">
        <p className="error">{error}</p>
        <Link to="/shop">Back to shop</Link>
      </div>
    );
  }
  if (!product) return <p className="state">Loading…</p>;

  const soldOut = product.stock <= 0;
  const maxQty = Math.min(20, product.stock);

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
  }

  return (
    <div className="page detail">
      <ProductImage product={product} className="large" />
      <div className="detail-info">
        <p className="muted">{product.brand} · {product.family} · {product.category}</p>
        <h1>{product.name}</h1>
        <p className="price big">{money(product.price)} <span className="muted small">{product.sizeMl} ml</span></p>
        {product.description && <p>{product.description}</p>}
        {product.notes.length > 0 && (
          <p><strong>Notes:</strong> {product.notes.join(', ')}</p>
        )}
        {soldOut ? (
          <p className="error">Sold out</p>
        ) : (
          <div className="buy">
            <label>
              Quantity
              <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
            <button type="button" className="btn" onClick={handleAdd}>Add to cart</button>
          </div>
        )}
        {!soldOut && product.stock <= 5 && <p className="muted">Only {product.stock} left.</p>}
        {added && (
          <p className="ok">Added to cart. <Link to="/cart">View cart</Link></p>
        )}
      </div>
    </div>
  );
}