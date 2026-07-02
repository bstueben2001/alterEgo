import { db } from '../data/db.js'

export function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' })
  }
  const user = db.users.find((u) => u.id === req.session.userId)
  if (!user) {
    return res.status(401).json({ error: 'Not logged in' })
  }
  req.user = user
  next()
}

export function publicUser(user) {
  const { passwordHash, ...rest } = user
  return rest
}
