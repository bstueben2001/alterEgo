import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const STORE_PATH = path.join(__dirname, 'store.json')

function seed() {
  const now = new Date().toISOString()
  const users = [
    {
      id: 'u-crow',
      username: 'crowbait',
      email: 'crow@alterego.test',
      passwordHash: bcrypt.hashSync('password123', 10),
      shopName: 'Crowbait Studs & Scraps',
      bio: 'Hand-riveted leather and reclaimed denim. Every seam is a scar with a story.',
      avatarColor: '#5b4de0',
      createdAt: now,
    },
    {
      id: 'u-marrow',
      username: 'marrowmender',
      email: 'marrow@alterego.test',
      passwordHash: bcrypt.hashSync('password123', 10),
      shopName: 'Marrow Mender Mending Co.',
      bio: 'Visible mending, patchwork jackets, and safety-pin couture out of a squat in the industrial district.',
      avatarColor: '#c9cdd3',
      createdAt: now,
    },
  ]

  const listings = [
    {
      id: 'l-1',
      sellerId: 'u-crow',
      title: 'Studded Battle Vest, Reclaimed Denim',
      description: 'Cut from a dead man\'s Levis and covered in hand-set cone studs. One of one. Runs big, wear it open.',
      price: 88,
      category: 'Outerwear',
      tags: ['denim', 'studs', 'vest', 'diy'],
      colorway: '#09090b',
      sold: false,
      createdAt: now,
    },
    {
      id: 'l-2',
      sellerId: 'u-crow',
      title: 'Chain-Link Choker, Blackened Brass',
      description: 'Heavy gauge chain, blackened by hand, clasp reinforced twice because someone always yanks it on the dance floor.',
      price: 34,
      category: 'Accessories',
      tags: ['jewelry', 'chain', 'choker'],
      colorway: '#34363d',
      sold: false,
      createdAt: now,
    },
    {
      id: 'l-3',
      sellerId: 'u-marrow',
      title: 'Patchwork Bondage Trousers',
      description: 'Seven dead pairs of trousers, one new pair. Bar tacks everywhere it counts. Straps included, obviously.',
      price: 76,
      category: 'Bottoms',
      tags: ['trousers', 'patchwork', 'straps'],
      colorway: '#241c5e',
      sold: false,
      createdAt: now,
    },
    {
      id: 'l-4',
      sellerId: 'u-marrow',
      title: 'Visible-Mend Flannel, Safety Pin Trim',
      description: 'Thrifted flannel, mended loud instead of quiet. Sashiko stitching in chrome thread, pins down both cuffs.',
      price: 52,
      category: 'Tops',
      tags: ['flannel', 'mending', 'patchwork'],
      colorway: '#c9cdd3',
      sold: false,
      createdAt: now,
    },
    {
      id: 'l-5',
      sellerId: 'u-crow',
      title: 'Screen-Printed Patch Set (x6)',
      description: 'Six iron-on patches, hand screen-printed on canvas scraps. Bleach-stained on purpose.',
      price: 22,
      category: 'Accessories',
      tags: ['patches', 'diy', 'canvas'],
      colorway: '#eef0f3',
      sold: false,
      createdAt: now,
    },
    {
      id: 'l-6',
      sellerId: 'u-marrow',
      title: 'Ripped Fishnet Layering Top',
      description: 'Hand-distressed fishnet, reinforced neckline so it survives more than one show.',
      price: 28,
      category: 'Tops',
      tags: ['fishnet', 'layering'],
      colorway: '#5b4de0',
      sold: true,
      createdAt: now,
    },
  ]

  return { users, listings, orders: [] }
}

function load() {
  if (!fs.existsSync(STORE_PATH)) {
    const initial = seed()
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2))
    return initial
  }
  return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'))
}

let store = load()

function save() {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2))
}

export const db = {
  get users() { return store.users },
  get listings() { return store.listings },
  get orders() { return store.orders },
  save,
  reset() {
    store = seed()
    save()
  },
}
