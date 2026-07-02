import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Cart.css'

export default function Cart() {
  const { items, removeItem, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h2>Your cart is empty.</h2>
        <p>Go find something worth ripping the tags off.</p>
        <Link className="btn btn-tape" to="/">Browse</Link>
      </div>
    )
  }

  function handleCheckout() {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } })
      return
    }
    navigate('/checkout')
  }

  return (
    <div>
      <h1>Your Cart</h1>
      <div className="cart-list">
        {items.map((item) => (
          <div className="cart-item patch" key={item.id}>
            <div className="cart-item-swatch" style={{ background: item.colorway }} />
            <div className="cart-item-info">
              <h3>{item.title}</h3>
              <p className="form-note">{item.sellerShopName || item.sellerUsername}</p>
            </div>
            <span className="price-tag">${item.price}</span>
            <button className="btn btn-outline btn-small" onClick={() => removeItem(item.id)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="cart-summary patch patch--deep">
        <span>Total</span>
        <span className="price-tag">${total}</span>
      </div>

      <button className="btn btn-tape" onClick={handleCheckout} style={{ width: '100%', marginTop: 16 }}>
        Checkout
      </button>
    </div>
  )
}
