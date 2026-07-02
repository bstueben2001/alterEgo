import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import ListingCard from '../Components/ListingCard'

export default function MyListings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/listings/mine')
      .then(setListings)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="page-header">
        <h1>My Shop</h1>
        <Link className="btn btn-tape" to="/sell/new">+ New Listing</Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : listings.length === 0 ? (
        <div className="empty-state">
          <h2>Empty racks.</h2>
          <p>List your first piece to open your shop.</p>
        </div>
      ) : (
        <div className="grid">
          {listings.map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
