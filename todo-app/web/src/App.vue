<template>
  <main class="container">
    <h1>Todo List</h1>

    <el-form @submit.prevent="onSubmit" class="todo-form">
      <el-input v-model="input" placeholder="输入待办事项" clearable />
      <el-button type="primary" @click="onSubmit">新增</el-button>
    </el-form>

    <el-empty v-if="!store.loading && store.todos.length === 0" description="暂无任务" />

    <el-card v-for="todo in store.todos" :key="todo.id" class="todo-item">
      <div class="todo-row">
        <el-checkbox
          :model-value="todo.completed"
          @change="(val: boolean) => onToggle(todo.id, val)"
          >{{ todo.title }}</el-checkbox
        >
        <el-button type="danger" plain @click="onDelete(todo.id)">删除</el-button>
      </div>
    </el-card>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useTodoStore } from './stores/todos'

const store = useTodoStore()
const input = ref('')

onMounted(async () => {
  try {
    await store.loadTodos()
  } catch {
    ElMessage.error('加载任务失败')
  }
})

const onSubmit = async () => {
  const title = input.value.trim()
  if (!title) {
    ElMessage.warning('请输入任务内容')
    return
  }

  try {
    await store.addTodo(title)
    input.value = ''
    ElMessage.success('新增成功')
  } catch {
    ElMessage.error('新增失败')
  }
}

const onToggle = async (id: number, completed: boolean) => {
  const todo = store.todos.find((item) => item.id === id)
  if (!todo) return

  try {
    await store.updateCompleted(todo, completed)
  } catch {
    ElMessage.error('更新失败')
  }
}

const onDelete = async (id: number) => {
  try {
    await store.removeTodo(id)
    ElMessage.success('删除成功')
  } catch {
    ElMessage.error('删除失败')
  }
}
</script>

<style scoped>
.container {
  max-width: 720px;
  margin: 24px auto;
  padding: 0 16px;
}
.todo-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.todo-item {
  margin-bottom: 12px;
}
.todo-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
</style>
