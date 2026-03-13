const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const { URL } = require('node:url')
const { DatabaseSync } = require('node:sqlite')

const PORT = Number(process.env.PORT || 3000)
const PUBLIC_DIR = path.join(__dirname, 'public')

const db = new DatabaseSync(path.join(__dirname, 'todo.db'))
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(payload))
}

const serveStatic = (pathname, res) => {
  const requestedPath = pathname === '/' ? '/index.html' : pathname
  const normalized = path.normalize(requestedPath).replace(/^([.][.][/\\])+/, '')
  const filePath = path.join(PUBLIC_DIR, normalized)

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404)
      res.end('Not found')
      return
    }

    const ext = path.extname(filePath)
    const contentType = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8'
    }[ext] || 'application/octet-stream'

    res.writeHead(200, { 'Content-Type': contentType })
    res.end(content)
  })
}

const collectJsonBody = (req) => new Promise((resolve, reject) => {
  let body = ''
  req.on('data', (chunk) => {
    body += chunk
    if (body.length > 1_000_000) {
      reject(new Error('Request body too large'))
      req.destroy()
    }
  })
  req.on('end', () => {
    try {
      resolve(body ? JSON.parse(body) : {})
    } catch {
      reject(new Error('Invalid JSON payload'))
    }
  })
  req.on('error', reject)
})

const server = http.createServer(async (req, res) => {
  if (!req.url || !req.method) {
    res.writeHead(400)
    res.end('Bad request')
    return
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`)

  if (req.method === 'GET' && parsedUrl.pathname === '/api/tasks') {
    const tasks = db.prepare('SELECT id, title, created_at FROM tasks ORDER BY id DESC').all()
    sendJson(res, 200, tasks)
    return
  }

  if (req.method === 'POST' && parsedUrl.pathname === '/api/tasks') {
    try {
      const payload = await collectJsonBody(req)
      const title = typeof payload.title === 'string' ? payload.title.trim() : ''

      if (!title) {
        sendJson(res, 400, { error: 'Task title is required.' })
        return
      }

      const result = db.prepare('INSERT INTO tasks (title) VALUES (?)').run(title)
      sendJson(res, 201, { id: Number(result.lastInsertRowid), title })
    } catch (error) {
      sendJson(res, 400, { error: error.message })
    }
    return
  }

  if (req.method === 'DELETE' && parsedUrl.pathname.startsWith('/api/tasks/')) {
    const taskId = Number(parsedUrl.pathname.split('/').pop())

    if (Number.isNaN(taskId)) {
      sendJson(res, 400, { error: 'Invalid task ID.' })
      return
    }

    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId)
    if (result.changes === 0) {
      sendJson(res, 404, { error: 'Task not found.' })
      return
    }

    res.writeHead(204)
    res.end()
    return
  }

  if (req.method === 'GET') {
    serveStatic(parsedUrl.pathname, res)
    return
  }

  res.writeHead(405)
  res.end('Method not allowed')
})

server.listen(PORT, () => {
  console.log(`Todo app listening at http://localhost:${PORT}`)
})
