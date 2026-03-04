import cors from 'cors';
import express from 'express';
import http from 'http';
import { initTasks } from './helpers/utilities';
import { TaskService } from './services/task-service';
import { createTaskRouter } from './routes/task-routes';
import type { Task } from './types/task.type';
import { WebSocketServer, WebSocket } from 'ws';

const app = express();
const PORT = process.env.PORT || 3000;
const TASKS_COUNT = Number(process.env.TASKS_COUNT) || 10;
const tasks = new Map<string, Task>();
initTasks(TASKS_COUNT, tasks);
const taskService = new TaskService(tasks);

app.use(cors());
app.use(express.json());
app.use('/tasks', createTaskRouter(taskService));

const server = http.createServer(app);

const wss = new WebSocketServer({
  server,
  path: '/ws',
});

wss.on('connection', (ws: WebSocket) => {
  console.log('Клиент подключился к WebSocket');

  taskService.addClient(ws);
  ws.on('close', () => {
    taskService.removeClient(ws);
    console.log('Клиент разорвал WebSocket соединение, количество активных клиентов: ', taskService.getClientCount());
  });

  ws.on('error', (error) => {
    console.error('Ошибка WbSocket соединения: ', error);
  })
});

const shutdown = () => {
  console.log('Завершение работы...');
  taskService.stopSimulation();
  wss.clients.forEach((ws) => ws.close());
  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGINT', shutdown);

server.listen(PORT, () => {
  console.log(`Мок аггрегатор запущен на порту ${PORT}`);
  console.log(`REST API доступен по адресу http://localhost:${PORT}/tasks`);
  console.log(`WebSocket API доступен по адресу ws://localhost:${PORT}/ws`);
});