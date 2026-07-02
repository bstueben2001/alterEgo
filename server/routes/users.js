import { Router } from 'express'
import { db } from '../data/db.js'
import { requireAuth, publicUser } from '../middleware/auth.js'

const router = Router()

router.get('/:id', (req, res) => {
  const user = db.users.find((u) => u.id === req.params.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  const listings = db.listings.filter((l) => l.sellerId === user.id && !l.sold)
  res.json({ ...publicUser(user), listings })
})

router.put('/me', requireAuth, (req, res) => {
  const { shopName, bio, avatarColor } = req.body
  if (shopName !== undefined) req.user.shopName = shopName
  if (bio !== undefined) req.user.bio = bio
  if (avatarColor !== undefined) req.user.avatarColor = avatarColor
  db.save()
  res.json(publicUser(req.user))
})

export default router
