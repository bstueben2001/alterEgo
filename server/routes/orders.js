import { Router } from 'express'
import crypto from 'crypto'
import { db } from '../data/db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/', requireAuth, (req, res) => {
  const { items } = req.body
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' })
  }

  const orderItems = []
  for (const { listingId } of items) {
    const listing = db.listings.find((l) => l.id === listingId)
    if (!listing) {
      return res.status(404).json({ error: `Listing ${listingId} no longer exists` })
    }
    if (listing.sold) {
      return res.status(409).json({ error: `"${listing.title}" already sold` })
    }
    orderItems.push({
      listingId: listing.id,
      title: listing.title,
      price: listing.price,
      sellerId: listing.sellerId,
    })
  }

  orderItems.forEach(({ listingId }) => {
    const listing = db.listings.find((l) => l.id === listingId)
    listing.sold = true
  })

  const order = {
    id: crypto.randomUUID(),
    buyerId: req.user.id,
    items: orderItems,
    total: orderItems.reduce((sum, item) => sum + item.price, 0),
    createdAt: new Date().toISOString(),
  }
  db.orders.push(order)
  db.save()
  res.status(201).json(order)
})

router.get('/mine', requireAuth, (req, res) => {
  const mine = db.orders.filter((o) => o.buyerId === req.user.id)
  res.json(mine.reverse())
})

export default router
