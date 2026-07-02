import { Router } from 'express'
import crypto from 'crypto'
import { db } from '../data/db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

function withSeller(listing) {
  const seller = db.users.find((u) => u.id === listing.sellerId)
  return {
    ...listing,
    sellerUsername: seller?.username,
    sellerShopName: seller?.shopName,
  }
}

router.get('/', (req, res) => {
  const { q, category, seller } = req.query
  let results = db.listings.filter((l) => !l.sold)

  if (seller) {
    results = db.listings.filter((l) => l.sellerId === seller)
  }
  if (category) {
    results = results.filter((l) => l.category.toLowerCase() === String(category).toLowerCase())
  }
  if (q) {
    const needle = String(q).toLowerCase()
    results = results.filter(
      (l) =>
        l.title.toLowerCase().includes(needle) ||
        l.description.toLowerCase().includes(needle) ||
        l.tags.some((t) => t.toLowerCase().includes(needle))
    )
  }

  res.json(results.map(withSeller).reverse())
})

router.get('/mine', requireAuth, (req, res) => {
  const mine = db.listings.filter((l) => l.sellerId === req.user.id)
  res.json(mine.map(withSeller).reverse())
})

router.get('/:id', (req, res) => {
  const listing = db.listings.find((l) => l.id === req.params.id)
  if (!listing) return res.status(404).json({ error: 'Listing not found' })
  res.json(withSeller(listing))
})

router.post('/', requireAuth, (req, res) => {
  const { title, description, price, category, tags, colorway } = req.body
  if (!title || !description || price === undefined || !category) {
    return res.status(400).json({ error: 'Title, description, price, and category are required' })
  }
  const numericPrice = Number(price)
  if (Number.isNaN(numericPrice) || numericPrice <= 0) {
    return res.status(400).json({ error: 'Price must be a positive number' })
  }

  const listing = {
    id: crypto.randomUUID(),
    sellerId: req.user.id,
    title,
    description,
    price: numericPrice,
    category,
    tags: Array.isArray(tags) ? tags.filter(Boolean) : String(tags || '').split(',').map((t) => t.trim()).filter(Boolean),
    colorway: colorway || '#5b4de0',
    sold: false,
    createdAt: new Date().toISOString(),
  }
  db.listings.push(listing)
  db.save()
  res.status(201).json(withSeller(listing))
})

router.put('/:id', requireAuth, (req, res) => {
  const listing = db.listings.find((l) => l.id === req.params.id)
  if (!listing) return res.status(404).json({ error: 'Listing not found' })
  if (listing.sellerId !== req.user.id) return res.status(403).json({ error: 'Not your listing' })

  const { title, description, price, category, tags, colorway } = req.body
  if (title !== undefined) listing.title = title
  if (description !== undefined) listing.description = description
  if (price !== undefined) {
    const numericPrice = Number(price)
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number' })
    }
    listing.price = numericPrice
  }
  if (category !== undefined) listing.category = category
  if (tags !== undefined) {
    listing.tags = Array.isArray(tags) ? tags.filter(Boolean) : String(tags).split(',').map((t) => t.trim()).filter(Boolean)
  }
  if (colorway !== undefined) listing.colorway = colorway
  db.save()
  res.json(withSeller(listing))
})

router.delete('/:id', requireAuth, (req, res) => {
  const listing = db.listings.find((l) => l.id === req.params.id)
  if (!listing) return res.status(404).json({ error: 'Listing not found' })
  if (listing.sellerId !== req.user.id) return res.status(403).json({ error: 'Not your listing' })

  const idx = db.listings.indexOf(listing)
  db.listings.splice(idx, 1)
  db.save()
  res.status(204).end()
})

export default router
