import axios from 'axios'

export type Todo = {
  id: number
  title: string
  completed: boolean
  created_at?: string
}

const client = axios.create({
  baseURL: 'http://localhost:3000/api'
})

export async function fetchTodos() {
  const response = await client.get<Todo[]>('/todos')
  return response.data
}

export async function createTodo(title: string) {
  const response = await client.post<Todo>('/todos', { title })
  return response.data
}

export async function toggleTodo(id: number, completed: boolean) {
  await client.patch(`/todos/${id}`, { completed })
}

export async function deleteTodo(id: number) {
  await client.delete(`/todos/${id}`)
}
