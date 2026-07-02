import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { items } = useCart()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="navbar-brand-mark">&#10007;</span> AlterEgo
      </Link>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Browse
          </NavLink>
        </li>
        {user && (
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              My Shop
            </NavLink>
          </li>
        )}
        {user && (
          <li>
            <NavLink to="/orders" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Orders
            </NavLink>
          </li>
        )}
        <li>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Cart{items.length > 0 && <span className="cart-badge">{items.length}</span>}
          </NavLink>
        </li>
      </ul>
      <div className="navbar-auth">
        {user ? (
          <>
            <NavLink to="/profile" className="navbar-user">
              {user.username}
            </NavLink>
            <button className="btn btn-tape btn-small" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Log In
            </Link>
            <Link to="/signup" className="btn btn-tape btn-small">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
