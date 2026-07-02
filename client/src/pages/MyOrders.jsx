import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/orders/mine')
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <h2>No orders yet.</h2>
        <Link className="btn btn-tape" to="/">Browse</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>My Orders</h1>
      <div className="stack">
        {orders.map((order) => (
          <div className="patch" key={order.id}>
            <div className="page-header" style={{ marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Order #{order.id.slice(0, 8)}</h3>
              <span className="price-tag">${order.total}</span>
            </div>
            <p className="form-note">{new Date(order.createdAt).toLocaleString()}</p>
            <ul>
              {order.items.map((item) => (
                <li key={item.listingId}>{item.title} — ${item.price}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
