import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useCart } from '../context/CartContext'
import './Cart.css'

export default function Checkout() {
  const { items, total, clear } = useCart()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handlePlaceOrder(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const order = await api.post('/orders', {
        items: items.map((item) => ({ listingId: item.id })),
      })
      clear()
      navigate(`/orders/${order.id}/confirmation`, { state: { order } })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return <div className="empty-state"><h2>Nothing to check out.</h2></div>
  }

  return (
    <div className="auth-page">
      <form className="patch tilt-b" onSubmit={handlePlaceOrder} style={{ maxWidth: 460 }}>
        <h1>Checkout</h1>
        {error && <div className="form-error">{error}</div>}

        <div className="cart-list">
          {items.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-swatch" style={{ background: item.colorway }} />
              <div className="cart-item-info">
                <h3>{item.title}</h3>
              </div>
              <span className="price-tag">${item.price}</span>
            </div>
          ))}
        </div>

        <div className="field">
          <label htmlFor="card">Card Number</label>
          <input id="card" placeholder="4242 4242 4242 4242" maxLength={19} required />
        </div>
        <div className="field">
          <label htmlFor="expiry">Expiry</label>
          <input id="expiry" placeholder="MM/YY" required />
        </div>

        <p className="form-note">This is a demo checkout — no real payment is processed.</p>

        <div className="cart-summary patch patch--deep" style={{ marginBottom: 16 }}>
          <span>Total</span>
          <span className="price-tag">${total}</span>
        </div>

        <button className="btn btn-tape" type="submit" disabled={submitting} style={{ width: '100%' }}>
          {submitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  )
}
