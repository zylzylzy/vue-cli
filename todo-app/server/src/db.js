const path = require('node:path')
const fs = require('node:fs')
const sqlite3 = require('sqlite3').verbose()

const dbFile = path.join(__dirname, '..', 'data', 'todo.db')
fs.mkdirSync(path.dirname(dbFile), { recursive: true })

const db = new sqlite3.Database(dbFile)

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
})

module.exports = db
