import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api'
import ListingCard from '../Components/ListingCard'
import './Profile.css'

export default function SellerProfile() {
  const { id } = useParams()
  const [seller, setSeller] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get(`/users/${id}`)
      .then(setSeller)
      .catch((err) => setError(err.message))
  }, [id])

  if (error) return <div className="empty-state"><h2>{error}</h2></div>
  if (!seller) return <p>Loading...</p>

  return (
    <div>
      <div className="profile-header">
        <div className="avatar-patch" style={{ background: seller.avatarColor }}>
          {seller.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="profile-shopname">{seller.shopName}</h1>
          <p className="profile-username">@{seller.username}</p>
        </div>
      </div>

      {seller.bio && <p>{seller.bio}</p>}

      <h2 style={{ marginTop: 32 }}>Listings</h2>
      {seller.listings.length === 0 ? (
        <p>No active listings.</p>
      ) : (
        <div className="grid">
          {seller.listings.map((listing, i) => (
            <ListingCard
              key={listing.id}
              listing={{ ...listing, sellerShopName: seller.shopName, sellerUsername: seller.username }}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  )
}
