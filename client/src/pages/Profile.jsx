import { useState } from 'react'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import './Profile.css'

const AVATAR_COLORS = ['#5b4de0', '#c9cdd3', '#34363d', '#241c5e', '#eef0f3']

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    shopName: user.shopName,
    bio: user.bio,
    avatarColor: user.avatarColor,
  })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const updated = await api.put('/users/me', form)
      updateUser(updated)
      setSaved(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="profile-header">
        <div className="avatar-patch" style={{ background: form.avatarColor }}>
          {user.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="profile-shopname">{form.shopName}</h1>
          <p className="profile-username">@{user.username}</p>
        </div>
      </div>

      <form className="patch tilt-a" onSubmit={handleSubmit} style={{ maxWidth: 460 }}>
        <h2>Edit Shop Details</h2>
        {error && <div className="form-error">{error}</div>}

        <div className="field">
          <label htmlFor="shopName">Shop Name</label>
          <input id="shopName" value={form.shopName} onChange={(e) => update('shopName', e.target.value)} required />
        </div>

        <div className="field">
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" value={form.bio} onChange={(e) => update('bio', e.target.value)} />
        </div>

        <div className="field">
          <label>Avatar Color</label>
          <div className="avatar-color-picker">
            {AVATAR_COLORS.map((color) => (
              <button
                type="button"
                key={color}
                className={`colorway-swatch ${form.avatarColor === color ? 'selected' : ''}`}
                style={{ background: color }}
                onClick={() => update('avatarColor', color)}
              />
            ))}
          </div>
        </div>

        <button className="btn btn-tape" type="submit" disabled={submitting} style={{ width: '100%' }}>
          {submitting ? 'Saving...' : 'Save'}
        </button>
        {saved && <p className="form-note">Saved.</p>}
      </form>
    </div>
  )
}
