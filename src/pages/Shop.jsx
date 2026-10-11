import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { CATEGORIES, FAMILIES } from '../config.js';
import ProductCard from '../components/ProductCard.jsx';
import '../shop.css';

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

const SECTIONS = [
  { id: 'gourmand', title: 'Gourmand', families: ['Gourmand'], blurb: 'Caramel, cocoa and vanilla. Warm and sweet.' },
  { id: 'fresh', title: 'Fresh', families: ['Fresh'], blurb: 'Linen, sea air and green tea. Clean and light.' },
  { id: 'woody', title: 'Woody', families: ['Woody'], blurb: 'Cedar, vetiver and smoke. Dry and grounding.' },
  { id: 'floral', title: 'Floral', families: ['Floral'], blurb: 'Iris, jasmine and rose. Soft and expressive.' },
  { id: 'more', title: 'Citrus and amber', families: ['Citrus', 'Amber'], blurb: 'Bright citrus peel and glowing amber resin.' },
];

const FAMILY_BLURBS = {
  Gourmand: 'Caramel, cocoa and vanilla. Warm and sweet.',
  Fresh: 'Linen, sea air and green tea. Clean and light.',
  Woody: 'Cedar, vetiver and smoke. Dry and grounding.',
  Floral: 'Iris, jasmine and rose. Soft and expressive.',
  Citrus: 'Bright peel, zest and sparkling top notes.',
  Amber: 'Resin, honey and warm spice that glow on skin.',
};

function Pill({ active, onClick, children }) {
  return (
    <button type="button" className={`pill${active ? ' is-active' : ''}`} aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  );
}

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const search = params.get('search') || '';
  const familyParam = params.get('family') || '';
  const categoryParam = params.get('category') || '';
  const sortParam = params.get('sort') || 'newest';

  const family = FAMILIES.includes(familyParam) ? familyParam : '';
  const category = CATEGORIES.includes(categoryParam) ? categoryParam : '';
  const sort = SORTS.some((s) => s.value === sortParam) ? sortParam : 'newest';
  const filtersActive = Boolean(search || family || category || sort !== 'newest');

  function update(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  function clearFilters() {
    setParams(new URLSearchParams(), { replace: true });
  }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const qs = new URLSearchParams();
    if (search) qs.set('search', search);
    if (category) qs.set('category', category);
    if (sort) qs.set('sort', sort);

    api(`/products?${qs.toString()}`)
      .then((data) => {
        if (cancelled) return;
        setProducts(data.products);
        setError('');
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
  }, [search, category, sort]);

  const visible = useMemo(
    () => (family ? products.filter((p) => p.family === family) : products),
    [products, family]
  );

  const sections = useMemo(
    () =>
      SECTIONS.map((s) => ({ ...s, items: visible.filter((p) => s.families.includes(p.family)) })).filter(
        (s) => s.items.length > 0
      ),
    [visible]
  );

  return (
    <div className="shop">
      <div className="shop-inner">
        <header className="shop-hero">
          <h1>Shop fragrances</h1>
          <p>Small-batch scents, grouped by what they actually smell like.</p>
        </header>

        <div className="filters-lux">
          <div className="filter-row">
            <span className="filter-label">Scent</span>
            <div className="pills">
              <Pill active={!family} onClick={() => update('family', '')}>All</Pill>
              {FAMILIES.map((f) => (
                <Pill key={f} active={family === f} onClick={() => update('family', f)}>{f}</Pill>
              ))}
            </div>
          </div>
          <div className="filter-row">
            <span className="filter-label">For</span>
            <div className="pills">
              <Pill active={!category} onClick={() => update('category', '')}>All</Pill>
              {CATEGORIES.map((c) => (
                <Pill key={c} active={category === c} onClick={() => update('category', c)}>{c}</Pill>
              ))}
            </div>
          </div>
          <div className="filter-row">
            <span className="filter-label">Sort</span>
            <div className="pills">
              {SORTS.map((s) => (
                <Pill key={s.value} active={sort === s.value} onClick={() => update('sort', s.value === 'newest' ? '' : s.value)}>
                  {s.label}
                </Pill>
              ))}
            </div>
          </div>
          <input
            type="search"
            className="search-lux"
            placeholder="Search by name or note"
            value={search}
            onChange={(e) => update('search', e.target.value)}
            aria-label="Search fragrances"
          />
        </div>

        {error && <p className="error shop-center">{error}</p>}
        {loading && <p className="state">Loading…</p>}

        {!loading && !error && (
          <p className="result-bar">
            {visible.length} {visible.length === 1 ? 'fragrance' : 'fragrances'}
            {filtersActive && (
              <>
                {' · '}
                <button type="button" className="link-btn" onClick={clearFilters}>Clear filters</button>
              </>
            )}
          </p>
        )}

        {!loading && !error && visible.length === 0 && (
          <p className="muted shop-center">No fragrances match these filters. Try clearing one.</p>
        )}

        {!loading &&
          sections.map((s) => (
            <section key={s.id} className={`band tone-${s.id}`} aria-labelledby={`band-${s.id}`}>
              <div className="band-head">
                <h2 id={`band-${s.id}`}>{family && s.id === 'more' ? family : s.title}</h2>
                <p className="band-blurb">{family && s.id === 'more' ? FAMILY_BLURBS[family] : s.blurb}</p>
                <span className="band-count">{s.items.length} {s.items.length === 1 ? 'fragrance' : 'fragrances'}</span>
              </div>
              <div className="pgrid">
                {s.items.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
