import { Link } from 'react-router-dom'
import './ListingCard.css'

const TILTS = ['tilt-a', 'tilt-b', 'tilt-c', 'tilt-d']

export default function ListingCard({ listing, index = 0 }) {
  const tilt = TILTS[index % TILTS.length]

  return (
    <Link to={`/listing/${listing.id}`} className={`listing-card patch ${tilt}`}>
      <div className="listing-card-swatch" style={{ background: listing.colorway }}>
        {listing.sold && <span className="badge-sold listing-card-sold">Sold</span>}
      </div>
      <h3 className="listing-card-title">{listing.title}</h3>
      <p className="listing-card-seller">by {listing.sellerShopName || listing.sellerUsername}</p>
      <span className="price-tag">${listing.price}</span>
    </Link>
  )
}
