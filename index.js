import express from 'express'
import bcrypt from 'bcryptjs'
import pg from 'pg'

const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `)
}

const app = express()
app.use(express.json())
app.use(express.static('public'))

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'email+password required' })
  try {
    const hash = await bcrypt.hash(password, 10)
    const r = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, hash]
    )
    res.json({ user: r.rows[0] })
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'email already exists' })
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'email+password required' })
  const r = await pool.query('SELECT id, email, password_hash FROM users WHERE email = $1', [email])
  if (!r.rows.length) return res.status(401).json({ error: 'invalid credentials' })
  const ok = await bcrypt.compare(password, r.rows[0].password_hash)
  if (!ok) return res.status(401).json({ error: 'invalid credentials' })
  res.json({ user: { id: r.rows[0].id, email: r.rows[0].email } })
})

app.get('/api/users', async (_req, res) => {
  const r = await pool.query('SELECT id, email, created_at FROM users ORDER BY id DESC LIMIT 20')
  res.json({ users: r.rows })
})

const port = process.env.PORT || 3000
ensureSchema().then(() => {
  app.listen(port, () => console.log('demo listening on :' + port))
})
