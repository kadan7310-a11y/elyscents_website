import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { money } from '../config.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Checkout() {
  const { user, token } = useAuth();
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user ? user.name : '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function change(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api('/orders', {
        method: 'POST',
        token,
        body: { items: items.map((i) => ({ product: i.id, qty: i.qty })), shipping: form },
      });
      clear();
      navigate('/orders', { replace: true, state: { placed: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="page narrow">
        <h1>Nothing to check out</h1>
        <Link to="/shop" className="btn">Shop fragrances</Link>
      </div>
    );
  }

  return (
    <div className="page narrow">
      <h1>Delivery details</h1>
      <form onSubmit={submit} className="form">
        <label>Full name<input name="fullName" value={form.fullName} onChange={change} required /></label>
        <label>Phone<input name="phone" value={form.phone} onChange={change} required /></label>
        <label>Address<input name="address" value={form.address} onChange={change} required /></label>
        <div className="row">
          <label>City<input name="city" value={form.city} onChange={change} required /></label>
          <label>Postal code<input name="postalCode" value={form.postalCode} onChange={change} /></label>
        </div>
        <label>Country<input name="country" value={form.country} onChange={change} required /></label>

        <div className="summary">
          <span>Pay on delivery · {items.length} {items.length === 1 ? 'item' : 'items'}</span>
          <strong>{money(total)}</strong>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn" disabled={busy}>{busy ? 'Placing order…' : 'Place order'}</button>
      </form>
    </div>
  );
}