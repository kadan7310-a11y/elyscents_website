import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api.js';
import { CATEGORIES, FAMILIES } from '../../config.js';
import { useAuth } from '../../context/AuthContext.jsx';

const EMPTY = {
  name: '',
  brand: 'Elyscents',
  description: '',
  price: '',
  sizeMl: '50',
  category: 'Unisex',
  family: 'Floral',
  notes: '',
  image: '',
  stock: '0',
  featured: false,
};

export default function AdminProductForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(editing);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editing) return undefined;
    let cancelled = false;
    api(`/products/${id}`)
      .then(({ product: p }) => {
        if (cancelled) return;
        setForm({
          name: p.name,
          brand: p.brand || '',
          description: p.description || '',
          price: String(p.price),
          sizeMl: String(p.sizeMl),
          category: p.category,
          family: p.family,
          notes: (p.notes || []).join(', '),
          image: p.image || '',
          stock: String(p.stock),
          featured: Boolean(p.featured),
        });
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
  }, [editing, id]);

  function change(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const body = {
      ...form,
      price: Number(form.price),
      sizeMl: Number(form.sizeMl),
      stock: Number(form.stock),
      notes: form.notes.split(',').map((n) => n.trim()).filter(Boolean),
    };
    try {
      if (editing) await api(`/products/${id}`, { method: 'PUT', token, body });
      else await api('/products', { method: 'POST', token, body });
      navigate('/admin');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  if (loading) return <p className="state">Loading…</p>;

  return (
    <div className="page narrow">
      <h1>{editing ? 'Edit product' : 'Add product'}</h1>
      <form onSubmit={submit} className="form">
        <label>Name<input name="name" value={form.name} onChange={change} required /></label>
        <label>Brand<input name="brand" value={form.brand} onChange={change} /></label>
        <label>Description<textarea name="description" rows="4" value={form.description} onChange={change} /></label>
        <div className="row">
          <label>Price<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} required /></label>
          <label>Size (ml)<input name="sizeMl" type="number" min="1" value={form.sizeMl} onChange={change} required /></label>
          <label>Stock<input name="stock" type="number" min="0" step="1" value={form.stock} onChange={change} required /></label>
        </div>
        <div className="row">
          <label>Category
            <select name="category" value={form.category} onChange={change}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label>Scent family
            <select name="family" value={form.family} onChange={change}>
              {FAMILIES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </label>
        </div>
        <label>Notes (separate with commas)<input name="notes" value={form.notes} onChange={change} placeholder="Iris, Violet, Sandalwood" /></label>
        <label>Image URL (optional)<input name="image" type="text" value={form.image} onChange={change} placeholder="https://" /></label>
        <label className="check"><input name="featured" type="checkbox" checked={form.featured} onChange={change} /> Show on the home page</label>
        {error && <p className="error">{error}</p>}
        <div className="row">
          <button type="submit" className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save product'}</button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
