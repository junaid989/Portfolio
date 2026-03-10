import express from 'express'
import cors from 'cors'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_PATH = join(__dirname, 'data', 'db.json')
const UPLOADS_PATH = join(__dirname, 'uploads')

const upload = multer({ dest: UPLOADS_PATH })

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use('/uploads', express.static(UPLOADS_PATH))

let adminSession = null
const defaultData = {
  profile: {
    name: 'Developer',
    title: 'Full-stack Developer',
    location: 'Earth',
    bio: 'Welcome to my dev lab. I build things with code.',
    interests: 'Web, Games, 3D, AI',
    avatarUrl: '',
    email: '',
    githubUrl: '',
    linkedInUrl: '',
    resumeUrl: '',
  },
  skills: [
    { id: '1', name: 'JavaScript', category: 'Programming', level: 'Advanced' },
    { id: '2', name: 'React', category: 'Web Development', level: 'Advanced' },
    { id: '3', name: 'Three.js', category: 'Web Development', level: 'Intermediate' },
    { id: '4', name: 'Node.js', category: 'Web Development', level: 'Advanced' },
    { id: '5', name: 'C++', category: 'Game Development', level: 'Intermediate' },
    { id: '6', name: 'Git', category: 'Tools', level: 'Advanced' },
  ],
  projects: [
    {
      id: '1',
      title: '3D Portfolio',
      description: 'This very lab — a game-style WebGL portfolio.',
      tech: ['React', 'Three.js', 'Vite'],
      imageUrl: '',
      githubUrl: '',
      liveUrl: '',
    },
  ],
  timeline: [
    { id: '1', title: 'Started coding', date: '2018', description: 'First steps in programming.' },
    { id: '2', title: 'Learned C++', date: '2019', description: 'Game development basics.' },
    { id: '3', title: 'Built first game', date: '2020', description: 'Small 2D game project.' },
    { id: '4', title: 'Built portfolio', date: '2025', description: 'This 3D dev lab.' },
  ],
  adminCode: '0000',
}

async function readDb() {
  try {
    const raw = await readFile(DATA_PATH, 'utf-8')
    return { ...defaultData, ...JSON.parse(raw) }
  } catch (e) {
    return { ...defaultData }
  }
}

async function writeDb(data) {
  await mkdir(join(__dirname, 'data'), { recursive: true })
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

function adminAuth(req, res, next) {
  if (adminSession) return next()
  const auth = req.headers.authorization
  if (auth === 'Bearer ' + adminSession) return next()
  res.status(401).json({ error: 'Unauthorized' })
}

// Public API
app.get('/api/profile', async (req, res) => {
  try {
    const db = await readDb()
    res.json(db.profile)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/skills', async (req, res) => {
  try {
    const db = await readDb()
    res.json(db.skills)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/projects', async (req, res) => {
  try {
    const db = await readDb()
    res.json(db.projects)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/timeline', async (req, res) => {
  try {
    const db = await readDb()
    res.json(db.timeline)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Admin login (terminal auth)
app.post('/api/admin/login', async (req, res) => {
  const { code } = req.body || {}
  const db = await readDb()
  if (String(code) === String(db.adminCode)) {
    adminSession = 'session-' + Date.now()
    res.json({ ok: true, token: adminSession })
    return
  }
  res.status(401).json({ error: 'Invalid code' })
})

// Admin routes: accept Bearer token from client (issued on login)
const adminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (token && token.startsWith('session-')) {
    adminSession = token
    return next()
  }
  res.status(401).json({ error: 'Unauthorized' })
}

app.put('/api/admin/profile', adminMiddleware, async (req, res) => {
  try {
    const db = await readDb()
    db.profile = { ...db.profile, ...req.body }
    await writeDb(db)
    res.json(db.profile)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.put('/api/admin/skills', adminMiddleware, async (req, res) => {
  try {
    const db = await readDb()
    db.skills = Array.isArray(req.body) ? req.body : db.skills
    await writeDb(db)
    res.json(db.skills)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/admin/projects', adminMiddleware, async (req, res) => {
  try {
    const db = await readDb()
    res.json(db.projects)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/admin/projects', adminMiddleware, async (req, res) => {
  try {
    const db = await readDb()
    const proj = { ...req.body, id: String(Date.now()) }
    db.projects.push(proj)
    await writeDb(db)
    res.json(proj)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.put('/api/admin/projects/:id', adminMiddleware, async (req, res) => {
  try {
    const db = await readDb()
    const idx = db.projects.findIndex((p) => p.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Not found' })
    db.projects[idx] = { ...db.projects[idx], ...req.body }
    await writeDb(db)
    res.json(db.projects[idx])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.delete('/api/admin/projects/:id', adminMiddleware, async (req, res) => {
  try {
    const db = await readDb()
    db.projects = db.projects.filter((p) => p.id !== req.params.id)
    await writeDb(db)
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.put('/api/admin/timeline', adminMiddleware, async (req, res) => {
  try {
    const db = await readDb()
    db.timeline = Array.isArray(req.body) ? req.body : db.timeline
    await writeDb(db)
    res.json(db.timeline)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/admin/code', adminMiddleware, async (req, res) => {
  try {
    const db = await readDb()
    db.adminCode = String(req.body?.code ?? db.adminCode)
    await writeDb(db)
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/admin/upload', adminMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' })
  const url = '/uploads/' + req.file.filename
  res.json({ url })
})

const PORT = process.env.PORT || 3001
mkdir(UPLOADS_PATH, { recursive: true }).then(() => {
  app.listen(PORT, () => console.log('Server running on http://localhost:' + PORT))
})
