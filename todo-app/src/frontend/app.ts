import { createApp, onMounted, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js'

type Task = {
  id: number
  title: string
  created_at: string
}

createApp({
  setup() {
    const tasks = ref<Task[]>([])
    const newTask = ref('')
    const errorMessage = ref('')

    const loadTasks = async () => {
      const response = await fetch('/api/tasks')
      tasks.value = await response.json()
    }

    const createTask = async () => {
      errorMessage.value = ''

      if (!newTask.value.trim()) {
        errorMessage.value = 'Please enter a task title.'
        return
      }

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask.value })
      })

      if (!response.ok) {
        errorMessage.value = 'Failed to create task.'
        return
      }

      newTask.value = ''
      await loadTasks()
    }

    const deleteTask = async (id: number) => {
      const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        errorMessage.value = 'Failed to delete task.'
        return
      }

      await loadTasks()
    }

    onMounted(loadTasks)

    return {
      tasks,
      newTask,
      errorMessage,
      createTask,
      deleteTask
    }
  },
  template: `
    <main>
      <h1>Todo App</h1>
      <form @submit.prevent="createTask">
        <input v-model="newTask" type="text" placeholder="Add a new task" />
        <button type="submit">Add</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <ul>
        <li v-for="task in tasks" :key="task.id">
          <span>{{ task.title }}</span>
          <button @click="deleteTask(task.id)">Delete</button>
        </li>
      </ul>
    </main>
  `
}).mount('#app')
