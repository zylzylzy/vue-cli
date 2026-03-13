const base = 'http://localhost:3000/api/todos'

const getJson = async (url, options) => {
  const response = await fetch(url, options)
  const text = await response.text()
  let payload = null
  try {
    payload = text ? JSON.parse(text) : null
  } catch {
    payload = text
  }
  return { status: response.status, payload }
}

const listBefore = await getJson(base)
if (listBefore.status !== 200) throw new Error('GET /todos failed')

const created = await getJson(base, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ title: 'smoke test task' })
})
if (created.status !== 201 || !created.payload?.id) throw new Error('POST /todos failed')

const todoId = created.payload.id

const toggled = await getJson(`${base}/${todoId}`, {
  method: 'PATCH',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ completed: true })
})
if (toggled.status !== 200) throw new Error('PATCH /todos/:id failed')

const removed = await getJson(`${base}/${todoId}`, { method: 'DELETE' })
if (removed.status !== 204) throw new Error('DELETE /todos/:id failed')

console.log('Smoke test passed')
