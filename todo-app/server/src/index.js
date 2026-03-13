const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()
const PORT = Number(process.env.PORT || 3000)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/todos', (_req, res) => {
  db.all('SELECT id, title, completed, created_at FROM todos ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch todos' })
      return
    }
    res.json(rows.map((row) => ({ ...row, completed: Boolean(row.completed) })))
  })
})

app.post('/api/todos', (req, res) => {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : ''
  if (!title) {
    res.status(400).json({ error: 'title is required' })
    return
  }

  db.run('INSERT INTO todos (title, completed) VALUES (?, ?)', [title, 0], function onInsert(err) {
    if (err) {
      res.status(500).json({ error: 'Failed to create todo' })
      return
    }

    res.status(201).json({ id: this.lastID, title, completed: false })
  })
})

app.patch('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'invalid id' })
    return
  }

  if (typeof req.body?.completed !== 'boolean') {
    res.status(400).json({ error: 'completed must be boolean' })
    return
  }

  const completed = req.body.completed ? 1 : 0
  db.run('UPDATE todos SET completed = ? WHERE id = ?', [completed, id], function onUpdate(err) {
    if (err) {
      res.status(500).json({ error: 'Failed to update todo' })
      return
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'todo not found' })
      return
    }
    res.json({ id, completed: Boolean(completed) })
  })
})

app.delete('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'invalid id' })
    return
  }

  db.run('DELETE FROM todos WHERE id = ?', [id], function onDelete(err) {
    if (err) {
      res.status(500).json({ error: 'Failed to delete todo' })
      return
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'todo not found' })
      return
    }
    res.status(204).send()
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
