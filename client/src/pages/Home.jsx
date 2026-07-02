import { useEffect, useState } from 'react'
import { api } from '../api'
import ListingCard from '../Components/ListingCard'
import './Home.css'

const CATEGORIES = ['All', 'Outerwear', 'Tops', 'Bottoms', 'Accessories']

export default function Home() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category !== 'All') params.set('category', category)

    api
      .get(`/listings?${params.toString()}`)
      .then(setListings)
      .catch(() => setListings([]))
      .finally(() => setLoading(false))
  }, [q, category])

  return (
    <div>
      <div className="hero patch patch--deep">
        <h1>Wear the seams on the outside.</h1>
        <p>Handmade, hand-mended, and hand-me-down punk fashion from independent makers.</p>
      </div>

      <div className="browse-controls">
        <input
          className="browse-search"
          type="search"
          placeholder="Search studs, denim, patches..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="browse-categories">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`btn btn-small ${category === c ? '' : 'btn-outline'}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Loading the racks...</p>
      ) : listings.length === 0 ? (
        <div className="empty-state">
          <h2>Nothing here yet.</h2>
          <p>Try another search, or be the first to list something.</p>
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
