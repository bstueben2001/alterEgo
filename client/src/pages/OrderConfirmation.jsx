import { Link, useLocation } from 'react-router-dom'

export default function OrderConfirmation() {
  const location = useLocation()
  const order = location.state?.order

  if (!order) {
    return (
      <div className="empty-state">
        <h2>Order confirmed.</h2>
        <p>Check your order history for details.</p>
        <Link className="btn btn-tape" to="/orders">My Orders</Link>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="patch tilt-a" style={{ maxWidth: 460, textAlign: 'center' }}>
        <h1>Order Placed!</h1>
        <p>Order #{order.id.slice(0, 8)} — {order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
        <span className="price-tag">${order.total}</span>
        <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link className="btn btn-tape" to="/">Keep Browsing</Link>
          <Link className="btn btn-outline" to="/orders">My Orders</Link>
        </div>
      </div>
    </div>
  )
}
