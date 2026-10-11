import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { FAMILIES } from '../config.js';
import HeroBanner from '../components/HeroBanner.jsx';
import ProductCard from '../components/ProductCard.jsx';
import PerfumeBundles from '../components/PerfumeBundles';
import '../hero.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api('/products?featured=true')
      .then((data) => {
        if (!cancelled) setFeatured(data.products);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <HeroBanner />
<PerfumeBundles />

      <div className="home-body">
        <div className="home-inner">
          <section className="home-block">
            <h2>Shop by scent</h2>
            <div className="chips">
              {FAMILIES.map((f) => (
                <Link key={f} to={`/shop?family=${f}`} className="chip">{f}</Link>
              ))}
            </div>
          </section>

          <section className="home-block">
            <div className="section-head">
              <h2>Featured</h2>
              <Link to="/shop">See all fragrances</Link>
            </div>
            {error && <p className="error">{error}</p>}
            {!error && featured.length === 0 && <p className="muted">No featured fragrances yet.</p>}
            <div className="pgrid">
              {featured.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
