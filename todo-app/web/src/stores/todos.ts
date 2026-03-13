import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createTodo, deleteTodo, fetchTodos, toggleTodo, type Todo } from '../api/todos'

export const useTodoStore = defineStore('todos', () => {
  const todos = ref<Todo[]>([])
  const loading = ref(false)

  async function loadTodos() {
    loading.value = true
    try {
      todos.value = await fetchTodos()
    } finally {
      loading.value = false
    }
  }

  async function addTodo(title: string) {
    const created = await createTodo(title)
    todos.value.unshift(created)
  }

  async function updateCompleted(todo: Todo, completed: boolean) {
    await toggleTodo(todo.id, completed)
    todo.completed = completed
  }

  async function removeTodo(id: number) {
    await deleteTodo(id)
    todos.value = todos.value.filter((todo) => todo.id !== id)
  }

  return { todos, loading, loadTodos, addTodo, updateCompleted, removeTodo }
})
