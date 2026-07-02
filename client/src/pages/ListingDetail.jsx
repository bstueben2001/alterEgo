import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './ListingDetail.css'

export default function ListingDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { items, addItem } = useCart()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get(`/listings/${id}`)
      .then(setListing)
      .catch((err) => setError(err.message))
  }, [id])

  async function handleDelete() {
    if (!confirm('Take this listing down for good?')) return
    await api.del(`/listings/${id}`)
    navigate('/dashboard')
  }

  if (error) return <div className="empty-state"><h2>{error}</h2></div>
  if (!listing) return <p>Loading...</p>

  const isOwner = user?.id === listing.sellerId
  const inCart = items.some((item) => item.id === listing.id)

  return (
    <div className="listing-detail patch tilt-c">
      <div className="listing-detail-swatch" style={{ background: listing.colorway }}>
        {listing.sold && <span className="badge-sold">Sold</span>}
      </div>
      <div className="listing-detail-body">
        <h1>{listing.title}</h1>
        <p className="listing-detail-seller">
          by{' '}
          <Link to={`/sellers/${listing.sellerId}`} className="listing-detail-seller-link">
            {listing.sellerShopName}
          </Link>
        </p>
        <p>{listing.description}</p>
        <div>
          {listing.tags.map((tag) => (
            <span className="tag" key={tag}>{tag}</span>
          ))}
        </div>
        <div className="listing-detail-footer">
          <span className="price-tag">${listing.price}</span>
          {isOwner ? (
            <div className="listing-detail-actions">
              <Link className="btn btn-outline btn-small" to={`/sell/${listing.id}/edit`}>Edit</Link>
              <button className="btn btn-danger btn-small" onClick={handleDelete}>Delete</button>
            </div>
          ) : (
            <button
              className="btn btn-tape"
              disabled={listing.sold || inCart}
              onClick={() => addItem(listing)}
            >
              {listing.sold ? 'Sold Out' : inCart ? 'In Cart' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
