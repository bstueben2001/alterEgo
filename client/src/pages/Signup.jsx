import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', shopName: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signup(form)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="patch tilt-b" onSubmit={handleSubmit}>
        <h1>Start Your Shop</h1>
        {error && <div className="form-error">{error}</div>}
        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={form.username}
            onChange={(e) => update('username', e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="shopName">Shop Name</label>
          <input
            id="shopName"
            placeholder="Optional — defaults to your username"
            value={form.shopName}
            onChange={(e) => update('shopName', e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            minLength={6}
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            required
          />
        </div>
        <button className="btn btn-tape" type="submit" disabled={submitting} style={{ width: '100%' }}>
          {submitting ? 'Creating account...' : 'Sign Up'}
        </button>
        <p className="auth-switch">
          Already have a shop? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  )
}
