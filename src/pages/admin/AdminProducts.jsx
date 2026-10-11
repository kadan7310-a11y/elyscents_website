import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api.js';
import { money } from '../../config.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    return api('/products')
      .then((data) => {
        setProducts(data.products);
        setError('');
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(product) {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return;
    try {
      await api(`/products/${product._id}`, { method: 'DELETE', token });
      setProducts((list) => list.filter((p) => p._id !== product._id));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="page">
      <div className="section-head">
        <h1>Manage products</h1>
        <Link to="/admin/new" className="btn">Add product</Link>
      </div>
      {error && <p className="error">{error}</p>}
      {loading && <p className="state">Loading…</p>}
      {!loading && products.length === 0 && <p className="muted">No products yet. Add your first fragrance.</p>}
      {products.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Family</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th></th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.family}</td>
                  <td>{p.category}</td>
                  <td>{money(p.price)}</td>
                  <td>{p.stock}</td>
                  <td>{p.featured ? 'Yes' : 'No'}</td>
                  <td className="actions">
                    <Link to={`/admin/edit/${p._id}`}>Edit</Link>
                    <button type="button" className="link-btn danger" onClick={() => remove(p)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
