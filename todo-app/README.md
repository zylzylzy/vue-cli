# Todo Project (Vue3 + TS + Pinia + Element Plus + Express + SQLite)

## 环境要求
- Node.js `v22.13.0`
- npm

## 项目结构
- `web`: Vue3 + TypeScript + Pinia + Element Plus (Vite)
- `server`: Express + SQLite
- 数据库文件：`server/data/todo.db`

## 安装依赖
```bash
cd todo-app
npm install
npm install --prefix server
npm install --prefix web
```

## 一条命令同时启动前后端
```bash
npm run dev
```

说明：
- 根目录使用 `concurrently` 并发执行：
  - `npm run dev --prefix server`
  - `npm run dev --prefix web`
- 前端默认：`http://localhost:5173`
- 后端默认：`http://localhost:3000`

## API 列表
- `GET /api/todos` 获取列表
- `POST /api/todos` 新增 todo（`title` 必填）
- `PATCH /api/todos/:id` 更新完成状态（`completed` 布尔值）
- `DELETE /api/todos/:id` 删除 todo

## 基础测试（smoke test）
先启动后端（单独终端执行）：
```bash
npm run dev --prefix server
```
再运行：
```bash
npm run smoke
```
