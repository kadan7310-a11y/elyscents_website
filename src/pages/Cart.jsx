import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { money } from '../config.js';
import ProductImage from '../components/ProductImage.jsx';

export default function Cart() {
  const { items, total, setQty, removeItem } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="page narrow">
        <h1>Your cart is empty</h1>
        <p className="muted">Browse the collection and add a fragrance.</p>
        <Link to="/shop" className="btn">Shop fragrances</Link>
      </div>
    );
  }

  return (
    <div className="page narrow">
      <h1>Your cart</h1>
      <ul className="lines">
        {items.map((i) => (
          <li key={i.id} className="line">
            <ProductImage product={i} className="thumb" />
            <div className="line-info">
              <Link to={`/product/${i.id}`}><strong>{i.name}</strong></Link>
              <span className="muted">{i.sizeMl} ml · {money(i.price)}</span>
              <button type="button" className="link-btn" onClick={() => removeItem(i.id)}>Remove</button>
            </div>
            <div className="qty">
              <button type="button" aria-label={`Decrease ${i.name}`} onClick={() => setQty(i.id, i.qty - 1)}>−</button>
              <span>{i.qty}</span>
              <button type="button" aria-label={`Increase ${i.name}`} onClick={() => setQty(i.id, i.qty + 1)}>+</button>
            </div>
            <div className="line-total">{money(i.price * i.qty)}</div>
          </li>
        ))}
      </ul>
      <div className="summary">
        <span>Total</span>
        <strong>{money(total)}</strong>
      </div>
      <button type="button" className="btn" onClick={() => navigate('/checkout')}>Continue to checkout</button>
    </div>
  );
}