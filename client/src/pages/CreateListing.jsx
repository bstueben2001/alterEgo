import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import './CreateListing.css'

const CATEGORIES = ['Outerwear', 'Tops', 'Bottoms', 'Accessories']
const COLORWAYS = [
  { label: 'Blackout', value: '#09090b' },
  { label: 'Gunmetal', value: '#34363d' },
  { label: 'Silver', value: '#c9cdd3' },
  { label: 'Chrome', value: '#eef0f3' },
  { label: 'Indigo', value: '#5b4de0' },
  { label: 'Deep Indigo', value: '#241c5e' },
]

export default function CreateListing() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: CATEGORIES[0],
    tags: '',
    colorway: COLORWAYS[0].value,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isEditing) return
    api
      .get(`/listings/${id}`)
      .then((listing) =>
        setForm({
          title: listing.title,
          description: listing.description,
          price: listing.price,
          category: listing.category,
          tags: listing.tags.join(', '),
          colorway: listing.colorway,
        })
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, isEditing])

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = { ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) }
      const listing = isEditing ? await api.put(`/listings/${id}`, payload) : await api.post('/listings', payload)
      navigate(`/listing/${listing.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="auth-page">
      <form className="patch tilt-a" onSubmit={handleSubmit}>
        <h1>{isEditing ? 'Edit Listing' : 'New Listing'}</h1>
        {error && <div className="form-error">{error}</div>}

        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" value={form.title} onChange={(e) => update('title', e.target.value)} required />
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="price">Price (USD)</label>
          <input
            id="price"
            type="number"
            min="1"
            step="1"
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" value={form.category} onChange={(e) => update('category', e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input id="tags" value={form.tags} onChange={(e) => update('tags', e.target.value)} placeholder="denim, studs, diy" />
        </div>

        <div className="field">
          <label>Colorway</label>
          <div className="colorway-picker">
            {COLORWAYS.map((c) => (
              <button
                type="button"
                key={c.value}
                title={c.label}
                className={`colorway-swatch ${form.colorway === c.value ? 'selected' : ''}`}
                style={{ background: c.value }}
                onClick={() => update('colorway', c.value)}
              />
            ))}
          </div>
        </div>

        <button className="btn btn-tape" type="submit" disabled={submitting} style={{ width: '100%' }}>
          {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'List It'}
        </button>
      </form>
    </div>
  )
}
