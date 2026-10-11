import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api.js';
import { money } from '../config.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Orders() {
  const { token } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const placed = Boolean(location.state && location.state.placed);

  useEffect(() => {
    let cancelled = false;
    api('/orders/mine', { token })
      .then((data) => {
        if (!cancelled) setOrders(data.orders);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="page narrow">
      <h1>My orders</h1>
      {placed && <p className="ok">Order placed. We will contact you to confirm delivery.</p>}
      {loading && <p className="state">Loading…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && orders.length === 0 && <p className="muted">You have not placed any orders yet.</p>}
      {orders.map((o) => (
        <article key={o._id} className="order">
          <header>
            <strong>{new Date(o.createdAt).toLocaleDateString()}</strong>
            <span className="badge">{o.status}</span>
            <strong>{money(o.totalPrice)}</strong>
          </header>
          <ul>
            {o.items.map((i) => (
              <li key={`${o._id}-${i.product}`}>{i.qty} × {i.name} <span className="muted">({money(i.price)} each)</span></li>
            ))}
          </ul>
          <p className="muted">Deliver to {o.shipping.fullName}, {o.shipping.address}, {o.shipping.city}</p>
        </article>
      ))}
    </div>
  );
}