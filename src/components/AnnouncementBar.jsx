import '../hero.css';

// Edit these messages to change the scrolling bar at the top of the site.
const MESSAGES = [
  'Cash on delivery available',
  'Small-batch fragrances',
  'Six scent families to explore',
  'Order today, pay when it arrives',
];

function Set({ hidden = false }) {
  return (
    <div className="ann-set" aria-hidden={hidden ? 'true' : undefined}>
      {MESSAGES.map((m) => (
        <span key={m} className="ann-item">
          {m}
          <span className="ann-gem" aria-hidden="true">◆</span>
        </span>
      ))}
    </div>
  );
}

export default function AnnouncementBar() {
  return (
    <div className="ann" role="region" aria-label="Announcements">
      <div className="ann-track">
        <Set />
        <Set hidden />
      </div>
    </div>
  );
}
