import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../hero.css';

// Edit the slides here: text, link and image (images live in public/products).
const SLIDES = [
  {
    id: 'signature',
    kicker: 'Small-batch fragrances',
    title: 'Find the scent people remember you by.',
    text: 'Perfumes grouped by what they actually smell like, made to stay close to the skin and last all day.',
    cta: 'Shop all fragrances',
    to: '/shop',
    image: '/products/ember-resin.png',
    alt: 'Ember Resin perfume bottle with a gold cap',
  },
  {
    id: 'gourmand',
    kicker: 'The gourmand collection',
    title: 'Warm, sweet and impossible to forget.',
    text: 'Caramel, cocoa and smoked vanilla, poured into thick glass with a gold cap.',
    cta: 'Explore gourmand',
    to: '/shop?family=Gourmand',
    image: '/products/burnt-sugar.png',
    alt: 'Burnt Sugar perfume bottle with a gold cap',
  },
  {
    id: 'woody',
    kicker: 'Deep woods',
    title: 'Cedar, smoke and evening air.',
    text: 'Dry, grounding woods for cooler nights and slower mornings.',
    cta: 'Explore woody',
    to: '/shop?family=Woody',
    image: '/products/black-oud-smoke.png',
    alt: 'Black Oud Smoke perfume bottle with a gold cap',
  },
];

const INTERVAL = 6500;

function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    return false;
  }
}

export default function HeroBanner() {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [userPaused, setUserPaused] = useState(prefersReducedMotion);
  const count = SLIDES.length;
  const paused = hovering || focused || userPaused;

  useEffect(() => {
    if (paused) return undefined;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => clearTimeout(timer);
  }, [index, paused, count]);

  function go(i) {
    setIndex((i + count) % count);
  }

  return (
    <section
      className="hero-banner"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <h1 className="sr-only">Elyscents luxury fragrances</h1>

      <div className="hero-stage" aria-live={paused ? 'polite' : 'off'}>
        {SLIDES.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={s.id}
              className={`hero-slide${active ? ' is-active' : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={active ? undefined : 'true'}
            >
              <div className="hero-copy">
                <p className="hero-kicker">{s.kicker}</p>
                <h2 className="hero-title">{s.title}</h2>
                <p className="hero-text">{s.text}</p>
                <div className="hero-cta">
                  <Link to={s.to} className="hero-btn hero-btn-gold" tabIndex={active ? 0 : -1}>{s.cta}</Link>
                  <Link to="/shop" className="hero-btn hero-btn-line" tabIndex={active ? 0 : -1}>Browse everything</Link>
                </div>
              </div>
              <div className="hero-art">
                <div className="hero-frame">
                  <img src={s.image} alt={active ? s.alt : ''} loading={i === 0 ? 'eager' : 'lazy'} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hero-controls">
        <div className="hero-dots">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`hero-dot${i === index ? ' is-active' : ''}`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <div className="hero-arrows">
          <button type="button" className="hero-pause" onClick={() => setUserPaused((p) => !p)}>
            {userPaused ? 'Play' : 'Pause'}
          </button>
          <button type="button" className="hero-arrow" aria-label="Previous slide" onClick={() => go(index - 1)}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" className="hero-arrow" aria-label="Next slide" onClick={() => go(index + 1)}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
