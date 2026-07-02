import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="empty-state">
      <h2>404 — Torn Page</h2>
      <p>Whatever you were looking for got ripped off the wall.</p>
      <Link className="btn btn-tape" to="/">Back Home</Link>
    </div>
  )
}
