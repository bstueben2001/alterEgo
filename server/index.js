import express from 'express'
import session from 'express-session'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import listingRoutes from './routes/listings.js'
import userRoutes from './routes/users.js'
import orderRoutes from './routes/orders.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

app.set('trust proxy', 1)

if (!IS_PRODUCTION) {
  app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }))
}
app.use(express.json())
app.use(
  session({
    name: 'alterego.sid',
    secret: process.env.SESSION_SECRET || 'dev-only-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: IS_PRODUCTION,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
)

app.use('/api/auth', authRoutes)
app.use('/api/listings', listingRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)

app.get('/api/health', (req, res) => res.json({ ok: true }))

if (IS_PRODUCTION) {
  const clientDist = path.join(__dirname, '../client/dist')
  app.use(express.static(clientDist))
  // SPA fallback for client-side routing — anything that isn't /api/* gets index.html.
  app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`AlterEgo listening on http://localhost:${PORT}`)
})
