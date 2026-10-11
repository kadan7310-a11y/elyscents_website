import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="nav">
      <Link to="/" className="brand">Elyscents</Link>
      <nav className="nav-links" aria-label="Main">
        <NavLink to="/shop">Shop</NavLink>
        {user && <NavLink to="/orders">My orders</NavLink>}
        {user && user.role === 'admin' && <NavLink to="/admin">Manage products</NavLink>}
      </nav>
      <div className="nav-right">
        <NavLink to="/cart" className="cart-link">Cart ({count})</NavLink>
        {user ? (
          <>
            <span className="muted hide-sm">{user.name}</span>
            <button type="button" className="btn btn-ghost" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <Link to="/register" className="btn btn-small">Sign up</Link>
          </>
        )}
      </div>
    </header>
  );
}
