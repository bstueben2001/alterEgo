import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { db } from '../data/db.js'
import { publicUser } from '../middleware/auth.js'

const router = Router()

const PATCH_COLORS = ['#5b4de0', '#c9cdd3', '#34363d', '#241c5e', '#eef0f3']

router.post('/signup', (req, res) => {
  const { username, email, password, shopName, bio } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }
  const emailTaken = db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())
  if (emailTaken) {
    return res.status(409).json({ error: 'An account with that email already exists' })
  }
  const usernameTaken = db.users.some((u) => u.username.toLowerCase() === username.toLowerCase())
  if (usernameTaken) {
    return res.status(409).json({ error: 'That username is taken' })
  }

  const user = {
    id: crypto.randomUUID(),
    username,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    shopName: shopName || `${username}'s Shop`,
    bio: bio || '',
    avatarColor: PATCH_COLORS[db.users.length % PATCH_COLORS.length],
    createdAt: new Date().toISOString(),
  }
  db.users.push(user)
  db.save()

  req.session.userId = user.id
  res.status(201).json(publicUser(user))
})

router.post('/login', (req, res) => {
  const { email, password } = req.body
  const user = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase())
  if (!user || !bcrypt.compareSync(password || '', user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  req.session.userId = user.id
  res.json(publicUser(user))
})

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid')
    res.status(204).end()
  })
})

router.get('/me', (req, res) => {
  const user = db.users.find((u) => u.id === req.session.userId)
  if (!user) return res.status(401).json({ error: 'Not logged in' })
  res.json(publicUser(user))
})

export default router
